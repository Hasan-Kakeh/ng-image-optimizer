import { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { defaultConfig, ImageConfig } from './config';
import { ImageError, getHash, getMaxAge, detectContentType } from './utils';
import { validateParams } from './validator';
import { fetchExternalImage, fetchInternalImage } from './fetcher';
import { readFromCacheDir, writeToCacheDir } from './cache';
import { optimizeImage } from './optimizer';

/**
 * Express middleware handler for image optimization.
 * Intercepts image requests, processes them using sharp, and caches the results.
 *
 * @param browserDistFolder - The absolute path to the Angular application's browser distribution folder. Used to resolve local image requests.
 * @param options - Optional configuration object to customize image optimization behavior.
 * @returns An Express middleware function that handles image optimization requests.
 */
export const imageOptimizerHandler = (
  browserDistFolder: string,
  options?: Partial<ImageConfig>,
) => {
  const config = { ...defaultConfig, ...options };
  const isDev = process.env['NODE_ENV'] !== 'production';
  const publicFolder =
    isDev || !fs.existsSync(browserDistFolder)
      ? path.join(process.cwd(), 'public')
      : browserDistFolder;

  return async (req: Request, res: Response) => {
    try {
      // 1. Validate Request
      const paramsResult = validateParams(req, req.query, config);
      if ('errorMessage' in paramsResult) {
        throw new ImageError(400, paramsResult.errorMessage);
      }
      const { href, isAbsolute, width, quality, mimeType, minimumCacheTTL } = paramsResult;

      // 2. Cache Key Generation (High Entropy)
      const CACHE_VERSION = 4;
      const cacheKey = getHash([CACHE_VERSION, href, width, quality, mimeType]);

      // 3. Cache Read Check
      try {
        const { maxAge, expireAt, buffer, extension, etag } = await readFromCacheDir(cacheKey);

        // TTL validation
        if (Date.now() <= expireAt) {
          res.setHeader('Vary', 'Accept');
          res.setHeader('Cache-Control', `public, max-age=${maxAge}, must-revalidate`);
          res.setHeader('Content-Type', `image/${extension}`);
          res.setHeader('X-Nextjs-Cache', 'HIT');
          res.setHeader('Content-Disposition', `inline; filename="image.${extension}"`);
          res.setHeader('Content-Security-Policy', config.contentSecurityPolicy);
          res.setHeader('ETag', etag);
          res.status(200).send(buffer);
          return;
        }
      } catch (e) {
        // Cache miss
      }

      // 4. Fetch Image (External or Internal)
      const upstream = await (isAbsolute
        ? fetchExternalImage(href, false, 5 * 1024 * 1024) // 5MB limit
        : fetchInternalImage(href, publicFolder));

      const upstreamType = await detectContentType(upstream.buffer);
      if (upstreamType === 'image/svg+xml' && !config.dangerouslyAllowSVG) {
        throw new ImageError(400, '"url" parameter is valid but image type is not allowed (SVG)');
      }

      // 5. Optimize Image
      const optimized = await optimizeImage(upstream, paramsResult);

      const maxAge = Math.max(minimumCacheTTL, getMaxAge(upstream.cacheControl));
      const expireAt = maxAge * 1000 + Date.now();
      const extension = optimized.contentType.split('/')[1] || 'jpeg';

      // 6. Write to File Cache
      await writeToCacheDir(
        cacheKey,
        extension,
        maxAge,
        expireAt,
        optimized.buffer,
        optimized.etag,
        upstream.etag,
      );

      // 7. Send Response
      res.setHeader('Vary', 'Accept');
      res.setHeader('Cache-Control', `public, max-age=${maxAge}, must-revalidate`);
      res.setHeader('Content-Type', optimized.contentType);
      res.setHeader('X-Nextjs-Cache', 'MISS');
      res.setHeader('Content-Disposition', `inline; filename="image.${extension}"`);
      res.setHeader('Content-Security-Policy', config.contentSecurityPolicy);
      res.setHeader('ETag', optimized.etag);
      res.status(200).send(optimized.buffer);
      return;
    } catch (error) {
      if (error instanceof ImageError) {
        console.error('Image Error:', error.message);
        res.status(error.statusCode).send(error.message);
      } else {
        console.error('Unexpected Optimizer Error:', error);
        res.status(500).send('Internal Server Error optimizing image');
      }
      return;
    }
  };
};
