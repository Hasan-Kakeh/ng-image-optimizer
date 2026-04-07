import type { IncomingMessage } from 'node:http';
import { ImageConfig } from './config';
import { hasRemoteMatch } from './match-remote-pattern';
import { hasLocalMatch } from './match-local-pattern';

export interface ImageParamsResult {
  href: string;
  isAbsolute: boolean;
  isStatic: boolean;
  width: number;
  quality: number;
  mimeType: string;
  minimumCacheTTL: number;
}

export function validateParams(
  req: IncomingMessage,
  query: Record<string, any>,
  config: ImageConfig,
): ImageParamsResult | { errorMessage: string } {
  const { url, w, q } = query;

  let href: string;

  if (!url) return { errorMessage: '"url" parameter is required' };
  if (Array.isArray(url)) return { errorMessage: '"url" parameter cannot be an array' };
  if (url.length > 3072) return { errorMessage: '"url" parameter is too long' };
  if (url.startsWith('//'))
    return { errorMessage: '"url" parameter cannot be a protocol-relative URL (//)' };

  let isAbsolute: boolean;

  if (url.startsWith('/')) {
    href = url;
    isAbsolute = false;
    if (url.includes('/_ng/image')) {
      return { errorMessage: '"url" parameter cannot be recursive' };
    }
    if (config.localPatterns) {
      if (!hasLocalMatch(config.localPatterns, url)) {
        return { errorMessage: '"url" parameter is not allowed' };
      }
    }
  } else {
    let hrefParsed: URL;
    try {
      hrefParsed = new URL(url);

      href = hrefParsed.toString();
      isAbsolute = true;
    } catch {
      return { errorMessage: '"url" parameter is invalid' };
    }

    if (!['http:', 'https:'].includes(hrefParsed.protocol)) {
      return { errorMessage: '"url" parameter is invalid' };
    }

    // remotePatterns check
    if (config.remotePatterns.length > 0 && !hasRemoteMatch(config.remotePatterns, hrefParsed)) {
      return { errorMessage: '"url" parameter is not allowed' };
    }
  }

  if (!w) return { errorMessage: '"w" parameter (width) is required' };
  if (Array.isArray(w)) return { errorMessage: '"w" parameter (width) cannot be an array' };
  if (!/^[0-9]+$/.test(w))
    return { errorMessage: '"w" parameter (width) must be an integer greater than 0' };

  if (!q) return { errorMessage: '"q" parameter (quality) is required' };
  if (Array.isArray(q)) return { errorMessage: '"q" parameter (quality) cannot be an array' };
  if (!/^[0-9]+$/.test(q))
    return { errorMessage: '"q" parameter (quality) must be an integer between 1 and 100' };

  const width = parseInt(w, 10);
  if (width <= 0 || isNaN(width))
    return { errorMessage: '"w" parameter (width) must be an integer greater than 0' };

  const sizes = [...config.deviceSizes, ...config.imageSizes];
  const isValidSize = sizes.includes(width);
  const closestSize = isValidSize
    ? width
    : sizes.reduce((prev, curr) => (Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev));

  const quality = parseInt(q, 10);
  if (isNaN(quality) || quality < 1 || quality > 100) {
    return { errorMessage: '"q" parameter (quality) must be an integer between 1 and 100' };
  }

  if (config.qualities && !config.qualities.includes(quality)) {
    return { errorMessage: `"q" parameter (quality) of ${q} is not allowed` };
  }

  const accept = req.headers['accept'] || '';
  let mimeType = 'image/jpeg';
  if (accept.includes('image/avif') && config.formats.includes('image/avif')) {
    mimeType = 'image/avif';
  } else if (accept.includes('image/webp') && config.formats.includes('image/webp')) {
    mimeType = 'image/webp';
  }

  return {
    href,
    isAbsolute,
    isStatic: false,
    width: closestSize,
    quality,
    mimeType,
    minimumCacheTTL: config.minimumCacheTTL,
  };
}
