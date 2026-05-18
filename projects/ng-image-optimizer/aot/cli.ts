#!/usr/bin/env node
/**
 * ng-image-optimizer-aot CLI
 *
 * Pre-optimizes images in the Angular dist folder at build time.
 *
 * Usage:
 *   ng-image-optimizer-aot \
 *     --dist ./dist/my-app/browser \
 *     --paths "assets/images/**\/*.{jpg,jpeg,png}" \
 *     --quality 90 \
 *     --format webp \
 *     --widths 640,828,1080,1200,1920 \
 *     --concurrency 4
 */

import path from 'node:path';
import { runAotOptimizer, AotFormat } from './aot-optimizer';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseArgs(argv: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        result[key] = next;
        i++;
      } else {
        result[key] = 'true';
      }
    }
  }
  return result;
}

function printHelp(): void {
  console.log(`
ng-image-optimizer-aot – Ahead-of-Time image pre-optimizer

Usage:
  ng-image-optimizer-aot [options]

Options:
  --dist         <path>     Path to the Angular browser dist folder (required)
  --paths        <globs>    Comma-separated glob patterns relative to --dist
                            Extension filtering is automatic – only image files
                            (jpg, jpeg, png, webp, avif, gif, tiff) are processed.
                            (default: "**")
  --skip         <globs>    Comma-separated glob patterns to exclude from processing
                            Supports the same ** and * wildcards as --paths.
                            Example: "icons/**,og-image.*"
  --quality      <1-100>    Output quality (default: 90)
  --format       <format>   Output format: webp | avif | jpeg (default: webp)
  --widths       <px,...>   Comma-separated pixel widths to generate
                            (default: 640,828,1080,1200,1920)
  --concurrency  <n>        Max parallel sharp operations (default: 4)
  --blur                    Generate a small, blurred placeholder (width: 64)
  --help                    Show this help message

Examples:
  ng-image-optimizer-aot --dist ./dist/my-app/browser --format webp
  ng-image-optimizer-aot --dist ./dist/app/browser --paths "assets/**,images/**" --skip "icons/**" --quality 80 --format avif
`);
}

function exitError(msg: string): never {
  console.error(`\n❌  ${msg}\n`);
  process.exit(1);
}

// ─── Formatting ──────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function bar(filled: number, total: number, width = 30): string {
  if (total === 0) return '─'.repeat(width);
  const fill = Math.round((filled / total) * width);
  return '█'.repeat(fill) + '░'.repeat(width - fill);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if ('help' in args || 'h' in args) {
    printHelp();
    process.exit(0);
  }

  // ── Validate required args ────────────────────────────────────────────────
  if (!args['dist']) {
    exitError('--dist is required. Example: --dist ./dist/my-app/browser');
  }

  const distDir = path.resolve(process.cwd(), args['dist']);

  // ── Parse paths ───────────────────────────────────────────────────────────
  const rawPaths = args['paths'] ?? '**';
  const paths = rawPaths.split(',').map((p) => p.trim()).filter(Boolean);

  // ── Parse skip ────────────────────────────────────────────────────────────
  const rawSkip = args['skip'] ?? '';
  const skip = rawSkip.split(',').map((s) => s.trim()).filter(Boolean);

  // ── Parse quality ─────────────────────────────────────────────────────────
  const rawQuality = args['quality'] ?? '90';
  const quality = parseInt(rawQuality, 10);
  if (isNaN(quality) || quality < 1 || quality > 100) {
    exitError('--quality must be an integer between 1 and 100');
  }

  // ── Parse format ──────────────────────────────────────────────────────────
  const rawFormat = (args['format'] ?? 'webp') as AotFormat;
  const VALID_FORMATS: AotFormat[] = ['webp', 'avif', 'jpeg'];
  if (!VALID_FORMATS.includes(rawFormat)) {
    exitError(`--format must be one of: ${VALID_FORMATS.join(', ')}`);
  }

  // ── Parse widths ──────────────────────────────────────────────────────────
  const rawWidths = args['widths'] ?? '640,828,1080,1200,1920';
  const widths = rawWidths
    .split(',')
    .map((w) => parseInt(w.trim(), 10))
    .filter((w) => !isNaN(w) && w > 0);
  if (widths.length === 0) {
    exitError('--widths must be a comma-separated list of positive integers');
  }

  // ── Parse concurrency ─────────────────────────────────────────────────────
  const rawConcurrency = args['concurrency'] ?? '4';
  const concurrency = parseInt(rawConcurrency, 10);
  if (isNaN(concurrency) || concurrency < 1) {
    exitError('--concurrency must be a positive integer');
  }

  // ── Parse blur ────────────────────────────────────────────────────────────
  const blur = args['blur'] === 'true';

  // ── Print config banner ───────────────────────────────────────────────────
  console.log('\n🖼️  ng-image-optimizer-aot\n');
  console.log(`  dist        ${distDir}`);
  console.log(`  paths       ${paths.join(', ')}`);
  if (skip.length > 0) {
    console.log(`  skip        ${skip.join(', ')}`);
  }
  console.log(`  format      ${rawFormat}`);
  console.log(`  quality     ${quality}`);
  console.log(`  widths      ${widths.join(', ')} px`);
  console.log(`  concurrency ${concurrency}`);
  console.log(`  blur        ${blur}\n`);

  const start = Date.now();

  try {
    const result = await runAotOptimizer({
      distDir,
      paths,
      skip,
      quality,
      format: rawFormat,
      widths,
      concurrency,
      blur,
    });

    const duration = Date.now() - start;

    // ── Results summary ───────────────────────────────────────────────────
    console.log('─'.repeat(50));
    console.log(`  Images found    ${result.totalImages}`);
    console.log(`  Variants total  ${result.totalVariants}`);
    console.log(`  ✅ Succeeded    ${result.succeeded}`);
    if (result.skipped > 0) {
      console.log(`  ⏭️  Skipped      ${result.skipped}  (up-to-date)`);
    }
    if (result.failed > 0) {
      console.log(`  ❌ Failed       ${result.failed}`);
    }
    console.log(
      `\n  ${bar(result.succeeded, result.totalVariants)} ${result.totalVariants > 0 ? Math.round((result.succeeded / result.totalVariants) * 100) : 0}%`,
    );
    console.log(`\n  Done in ${formatDuration(duration)}`);
    console.log('─'.repeat(50));

    // ── Error detail ──────────────────────────────────────────────────────
    if (result.errors.length > 0) {
      console.error('\nErrors:');
      for (const { file, width, error } of result.errors) {
        console.error(`  • ${file} @ ${width}px — ${error}`);
      }
    }

    // ── Loader hint ───────────────────────────────────────────────────────
    if (result.succeeded > 0) {
      console.log(`
💡 Update your Angular provider to use pre-optimized files:

   provideImageOptimizerLoader({
     aot: { format: '${rawFormat}', quality: ${quality} }
   })
`);
    }

    process.exit(result.failed > 0 ? 1 : 0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    exitError(msg);
  }
}

main();
