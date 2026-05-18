import sharp from 'sharp';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { aotImageSizes } from './image-size-config';

export type AotFormat = 'webp' | 'avif' | 'jpeg';

export interface AotOptimizerOptions {
  /** Absolute path to the dist browser folder. */
  distDir: string;
  /**
   * Glob-style relative paths (relative to `distDir`).
   * Supports `**` (recursive) and `*` wildcards. Extension filtering is
   * automatic – only supported image types (jpg, jpeg, png, webp, avif, gif, tiff)
   * are processed; you do **not** need to include `*.{jpg,...}` in your patterns.
   *
   * @example
   * ```ts
   * paths: ['assets/**', 'images/hero.*']
   * ```
   */
  paths: string[];
  /** Output quality (1–100). Default: 90. */
  quality?: number;
  /** Output format. Default: 'webp'. */
  format?: AotFormat;
  /**
   * Pixel widths to generate. Each image will be resized to every width in
   * this list (without upscaling). Default: [640, 828, 1080, 1200, 1920].
   */
  widths?: number[];
  /** Max concurrent sharp operations. Default: 4. */
  concurrency?: number;
  /**
   * Glob patterns for paths to **exclude** from processing (relative to `distDir`).
   * Supports the same `**` and `*` wildcards as `paths`.
   *
   * @example
   * ```ts
   * skip: ['icons/**', 'og-image.*']
   * ```
   */
  skip?: string[];
  /** Generate a small, blurred placeholder image. Default: false. */
  blur?: boolean;
}

export interface AotResult {
  totalImages: number;
  totalVariants: number;
  succeeded: number;
  skipped: number;
  failed: number;
  errors: Array<{ file: string; width: number; error: string }>;
}

const DEFAULT_WIDTHS = aotImageSizes;
const DEFAULT_QUALITY = 90;
const DEFAULT_FORMAT: AotFormat = 'webp';
const DEFAULT_CONCURRENCY = 4;

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.tiff']);

/** Recursively expand a directory, collecting all supported image paths. */
function collectImages(baseDir: string, patterns: string[]): string[] {
  const matched: string[] = [];

  for (const pattern of patterns) {
    const expanded = expandPattern(baseDir, pattern);
    matched.push(...expanded);
  }

  // Deduplicate
  return [...new Set(matched)];
}

/**
 * Returns true if `absolutePath` matches any of the skip patterns.
 * Patterns are resolved relative to `baseDir`.
 */
function shouldSkip(absolutePath: string, baseDir: string, patterns: string[]): boolean {
  if (patterns.length === 0) return false;
  // Normalise to forward-slash relative path for matching
  const rel = path.relative(baseDir, absolutePath).replace(/\\/g, '/');
  for (const pattern of patterns) {
    const expanded = expandBraces(pattern);
    for (const p of expanded) {
      if (matchGlobPattern(rel, p)) return true;
    }
  }
  return false;
}

/** Simple forward-slash glob match (supports `*` and `**`). */
function matchGlobPattern(subject: string, pattern: string): boolean {
  // Build a regex: ** matches anything including /, * matches anything except /
  const regexStr =
    '^' +
    pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape regex specials except * ?
      .replace(/\*\*/g, '\u0000') // placeholder for **
      .replace(/\*/g, '[^/]*') // * → match within segment
      .replace(/\u0000/g, '.*') + // ** → match across segments
    '$';
  return new RegExp(regexStr).test(subject);
}

/**
 * Minimal glob expansion without external deps.
 * Supports `**`, `*`, and `{a,b}` brace expansion.
 */
function expandPattern(baseDir: string, pattern: string): string[] {
  // Expand brace expressions first: `{jpg,jpeg,png}` → multiple patterns
  const patterns = expandBraces(pattern);
  const results: string[] = [];
  for (const p of patterns) {
    results.push(...globMatch(baseDir, p));
  }
  return results;
}

function expandBraces(pattern: string): string[] {
  const match = pattern.match(/^(.*)\{([^}]+)\}(.*)$/);
  if (!match) return [pattern];
  const [, prefix, inner, suffix] = match;
  return inner.split(',').flatMap((part) => expandBraces(`${prefix}${part}${suffix}`));
}

function globMatch(baseDir: string, pattern: string): string[] {
  const parts = pattern.split('/');
  return matchParts(baseDir, parts);
}

function isAotFile(filename: string): boolean {
  return /.+\.\d+q\d+\.(webp|avif|jpeg)$/i.test(filename);
}

function matchParts(dir: string, parts: string[]): string[] {
  if (parts.length === 0) return [];

  const [head, ...rest] = parts;
  const results: string[] = [];

  if (head === '**') {
    // When ** is the last segment: collect all image files in the current dir
    if (rest.length === 0) {
      try {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile() && !isAotFile(entry.name)) {
            const ext = path.extname(entry.name).toLowerCase();
            if (SUPPORTED_EXTENSIONS.has(ext)) {
              results.push(path.join(dir, entry.name));
            }
          }
        }
      } catch {
        // ignore
      }
    } else {
      // Match current dir files with remaining pattern
      results.push(...matchParts(dir, rest));
    }
    // Always recurse into sub-directories carrying the full `**` segment
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          results.push(...matchParts(path.join(dir, entry.name), parts));
        }
      }
    } catch {
      // Directory not accessible
    }
    return results;
  }

  if (rest.length === 0) {
    // Leaf – match files
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && !isAotFile(entry.name) && matchSegment(entry.name, head)) {
          const ext = path.extname(entry.name).toLowerCase();
          if (SUPPORTED_EXTENSIONS.has(ext)) {
            results.push(path.join(dir, entry.name));
          }
        }
      }
    } catch {
      // ignore
    }
    return results;
  }

  // Intermediate segment
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && matchSegment(entry.name, head)) {
        results.push(...matchParts(path.join(dir, entry.name), rest));
      }
    }
  } catch {
    // ignore
  }

  return results;
}

function matchSegment(name: string, pattern: string): boolean {
  const regex = new RegExp('^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '[^/]*') + '$');
  return regex.test(name);
}

/**
 * Builds the output filename for a given source image, width, quality, format.
 *
 * Convention: `<name>.<width>q<quality>.<format>`
 * Example: `hero.1080q90.webp`
 */
export function buildAotFilename(
  sourcePath: string,
  width: number,
  quality: number,
  format: AotFormat,
): string {
  const dir = path.dirname(sourcePath);
  const ext = path.extname(sourcePath);
  const base = path.basename(sourcePath, ext);
  return path.join(dir, `${base}.${width}q${quality}.${format}`);
}

/**
 * Builds the public URL for an AOT image given its web-root-relative src path.
 *
 * `src` should be the same string passed to `NgOptimizedImage` (e.g. `/assets/hero.jpg`).
 * Returns e.g. `/assets/hero.1080q90.webp`.
 */
export function buildAotUrl(
  src: string,
  width: number,
  quality: number,
  format: AotFormat,
): string {
  const ext = path.posix.extname(src);
  const base = src.slice(0, src.length - ext.length);
  return `${base}.${width}q${quality}.${format}`;
}

async function optimizeOne(
  inputPath: string,
  outputPath: string,
  width: number,
  quality: number,
  format: AotFormat,
): Promise<void> {
  const input = readFileSync(inputPath);
  const transformer = sharp(input).rotate().resize(width, undefined, { withoutEnlargement: true });

  // if (blur && width <= 30) {
  //   transformer.blur(10);
  // }

  if (format === 'avif') {
    transformer.avif({ quality: Math.max(quality - 20, 1), effort: 3 });
  } else if (format === 'webp') {
    transformer.webp({ quality });
  } else {
    transformer.jpeg({ quality, mozjpeg: true });
  }

  const optimized = await transformer.toBuffer();
  writeFileSync(outputPath, optimized);
}

export async function runAotOptimizer(options: AotOptimizerOptions): Promise<AotResult> {
  const {
    distDir,
    paths,
    quality = DEFAULT_QUALITY,
    format = DEFAULT_FORMAT,
    widths = DEFAULT_WIDTHS,
    concurrency = DEFAULT_CONCURRENCY,
    skip = [],
    blur = false,
  } = options;

  if (!existsSync(distDir)) {
    throw new Error(`distDir does not exist: ${distDir}`);
  }

  const allImages = collectImages(distDir, paths);
  // Apply --skip patterns
  const skipPatterns = skip.flatMap((s) => expandBraces(s));
  const images: string[] = [];
  let skippedImageCount = 0;

  for (const img of allImages) {
    if (shouldSkip(img, distDir, skipPatterns)) {
      skippedImageCount++;
    } else {
      images.push(img);
    }
  }

  if (images.length === 0) {
    return {
      totalImages: allImages.length,
      totalVariants: 0,
      succeeded: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };
  }

  const pathMap = new Map<string, Array<{ inputPath: string; ext: string; width: number }>>();

  const finalWidths = blur ? Array.from(new Set([...widths, 30])).sort((a, b) => a - b) : widths;

  for (const imgPath of images) {
    const ext = path.extname(imgPath).toLowerCase();
    for (const width of finalWidths) {
      const outputPath = buildAotFilename(imgPath, width, quality, format);
      if (!pathMap.has(outputPath)) {
        pathMap.set(outputPath, []);
      }
      pathMap.get(outputPath)!.push({ inputPath: imgPath, ext, width });
    }
  }

  const tasks: Array<{ inputPath: string; outputPath: string; width: number }> = [];
  const PRIORITY: Record<string, number> = {
    '.webp': 1,
    '.png': 2,
    '.jpg': 3,
    '.jpeg': 4,
    '.avif': 5,
  };

  pathMap.forEach((sources, outputPath) => {
    const winner = sources.sort((a, b) => {
      return (PRIORITY[a.ext] || 99) - (PRIORITY[b.ext] || 99);
    })[0];
    tasks.push({ inputPath: winner.inputPath, outputPath, width: winner.width });
  });

  const errors: AotResult['errors'] = [];
  let succeeded = 0;
  // let upToDateSkipped = 0;

  const jobs = tasks.map(({ inputPath, outputPath, width }) => async () => {
    // // Skip if output already exists and is newer than input
    // if (existsSync(outputPath)) {
    //   const inputMtime = statSync(inputPath).mtimeMs;
    //   const outputMtime = statSync(outputPath).mtimeMs;
    //   if (outputMtime >= inputMtime) {
    //     upToDateSkipped++;
    //     return;
    //   }
    // }

    try {
      await optimizeOne(inputPath, outputPath, width, quality, format);
      succeeded++;
    } catch (err) {
      errors.push({
        file: path.relative(distDir, inputPath),
        width,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  // Run concurrently with a simple semaphore
  const semaphore = { running: 0 };
  await new Promise<void>((resolve) => {
    let idx = 0;
    let settled = 0;

    function next() {
      while (idx < jobs.length && semaphore.running < concurrency) {
        const job = jobs[idx++];
        semaphore.running++;
        job().finally(() => {
          semaphore.running--;
          settled++;
          if (settled === jobs.length) resolve();
          else next();
        });
      }
      if (idx >= jobs.length && semaphore.running === 0) resolve();
    }

    next();
  });

  return {
    totalImages: allImages.length,
    totalVariants: tasks.length,
    succeeded,
    skipped: skippedImageCount,
    failed: errors.length,
    errors,
  };
}
