import fs from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { LRUCache } from 'lru-cache';
import { defaultConfig } from './config';

const CACHE_DIR = path.join(process.cwd(), '.image-cache');

if (!existsSync(CACHE_DIR)) {
  mkdirSync(CACHE_DIR, { recursive: true });
}

const memoryCache = new LRUCache<string, number>({
  maxSize: defaultConfig.maxCacheSize || 50 * 1024 * 1024,
  sizeCalculation: (value) => value,
  dispose: async (value, key) => {
    try {
      const dir = path.join(CACHE_DIR, key);
      await fs.rm(dir, { recursive: true, force: true });
    } catch (e) {
      console.error(`LRU dispose error for ${key}:`, e);
    }
  },
});

export async function writeToCacheDir(
  cacheKey: string,
  extension: string,
  maxAge: number,
  expireAt: number,
  buffer: Buffer,
  etag: string,
  upstreamEtag: string,
) {
  const dir = path.join(CACHE_DIR, cacheKey);
  const filename = path.join(dir, `${maxAge}.${expireAt}.${etag}.${upstreamEtag}.${extension}`);

  await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filename, buffer);

  // Register in memory LRU tracker
  memoryCache.set(cacheKey, buffer.length);
}

export async function readFromCacheDir(cacheKey: string) {
  const dir = path.join(CACHE_DIR, cacheKey);
  const files = await fs.readdir(dir).catch(() => []);
  const file = files[0];
  if (!file) {
    memoryCache.delete(cacheKey);
    throw new Error(`cache entry "${cacheKey}" not found`);
  }

  const [maxAgeSt, expireAtSt, etag, upstreamEtag, extension] = file.split('.', 5);
  const filePath = path.join(dir, file);
  const stat = await fs.stat(filePath);
  const buffer = await fs.readFile(filePath);

  // Promote LRU entry tracking since it was successfully accessed
  memoryCache.set(cacheKey, stat.size);

  return {
    maxAge: Number(maxAgeSt),
    expireAt: Number(expireAtSt),
    etag,
    upstreamEtag,
    buffer,
    extension,
  };
}

// Resiliency scanning - Pre-populate the LRU tracking queue instantly on startup
async function setupCacheSync() {
  try {
    const entries = await fs.readdir(CACHE_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const cacheKey = entry.name;
        const dir = path.join(CACHE_DIR, cacheKey);
        const files = await fs.readdir(dir);
        if (files[0]) {
          const stat = await fs.stat(path.join(dir, files[0]));
          memoryCache.set(cacheKey, stat.size);
        }
      }
    }
  } catch (err) {
    // Ignore initial failures (like folder not existing)
  }
}

// Start synchronization proactively in the background
setupCacheSync();
