import { createHash } from 'node:crypto';

/**
 * Custom error class for image optimization failures.
 * Includes an HTTP status code to indicate the type of error.
 */
export class ImageError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    if (statusCode >= 400) {
      this.statusCode = statusCode;
    } else {
      this.statusCode = 500;
    }
  }
}

export function getHash(items: (string | number | Buffer)[]) {
  const hash = createHash('sha256');
  for (let item of items) {
    if (typeof item === 'number') hash.update(String(item));
    else {
      hash.update(item);
    }
  }
  return hash.digest('base64url');
}

export function getImageEtag(image: Buffer) {
  return getHash([image]);
}

export function extractEtag(etag: string | null | undefined, imageBuffer: Buffer) {
  if (etag) {
    return Buffer.from(etag).toString('base64url');
  }
  return getImageEtag(imageBuffer);
}

function parseCacheControl(str: string | null | undefined): Map<string, string> {
  const map = new Map<string, string>();
  if (!str) {
    return map;
  }
  for (let directive of str.split(',')) {
    let [key, value] = directive.trim().split('=', 2);
    key = key.toLowerCase();
    if (value) {
      value = value.toLowerCase();
    }
    map.set(key, value);
  }
  return map;
}

export function getMaxAge(str: string | null | undefined): number {
  const map = parseCacheControl(str);
  if (map) {
    let age = map.get('s-maxage') || map.get('max-age') || '';
    if (age.startsWith('"') && age.endsWith('"')) {
      age = age.slice(1, -1);
    }
    const n = parseInt(age, 10);
    if (!isNaN(n)) {
      return n;
    }
  }
  return 0;
}

const AVIF = 'image/avif';
const WEBP = 'image/webp';
const PNG = 'image/png';
const JPEG = 'image/jpeg';
const GIF = 'image/gif';
const SVG = 'image/svg+xml';
const ICO = 'image/x-icon';

export async function detectContentType(buffer: Buffer): Promise<string | null> {
  if (buffer.byteLength === 0) {
    return null;
  }
  if ([0xff, 0xd8, 0xff].every((b, i) => buffer[i] === b)) {
    return JPEG;
  }
  if ([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((b, i) => buffer[i] === b)) {
    return PNG;
  }
  if ([0x47, 0x49, 0x46, 0x38].every((b, i) => buffer[i] === b)) {
    return GIF;
  }
  if (
    [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50].every(
      (b, i) => !b || buffer[i] === b,
    )
  ) {
    return WEBP;
  }
  if ([0x3c, 0x3f, 0x78, 0x6d, 0x6c].every((b, i) => buffer[i] === b)) {
    return SVG;
  }
  if ([0x3c, 0x73, 0x76, 0x67].every((b, i) => buffer[i] === b)) {
    return SVG;
  }
  if (
    [0, 0, 0, 0, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66].every(
      (b, i) => !b || buffer[i] === b,
    )
  ) {
    return AVIF;
  }
  if ([0x00, 0x00, 0x01, 0x00].every((b, i) => buffer[i] === b)) {
    return ICO;
  }
  return null;
}
