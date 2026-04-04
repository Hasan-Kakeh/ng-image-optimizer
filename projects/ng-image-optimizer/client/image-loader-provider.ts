import type { ImageLoader, ImageLoaderConfig } from '@angular/common';
import { IMAGE_LOADER } from '@angular/common';
import type { Provider } from '@angular/core';
/**
 * Matches the server optimizer query shape (`validateParams`):
 * `GET <routePrefix>?url=<href>&w=<px>&q=<1-100>`.
 *
 * **`w`** is snapped to the configured allowlist (defaults match `defaultConfig` / server defaults).
 */
export interface ImageOptimizerLoaderOptions {
  /** Mount path of `imageOptimizerMiddleware`. Default `/_ng/image`. */
  routePrefix?: string;
  /**
   * Width when Angular calls the loader with only `src` (primary `img` `src`).
   * Snapped with `allowedWidths`. Default `1080`.
   */
  defaultWidth?: number;
  /** Used when `loaderParams` has no `q` / `quality`. Default `90`. */
  defaultQuality?: number;
}

function buildOptimizerUrl(
  routePrefix: string,
  config: ImageLoaderConfig,
  defaultWidth: number,
  defaultQuality: number,
): string {
  const rawW = config.width ?? defaultWidth;
  const w = rawW;

  const params = config.loaderParams ?? {};
  const rawQ = params['q'] ?? params['quality'];
  const q =
    rawQ === undefined || rawQ === null
      ? defaultQuality
      : typeof rawQ === 'number'
        ? rawQ
        : Number(rawQ);
  const qualityBase = Number.isFinite(q) ? Math.round(q) : defaultQuality;
  const quality = config.isPlaceholder ? Math.min(qualityBase, 40) : qualityBase;
  const qClamped = Math.min(100, Math.max(1, quality));

  const urlParam = encodeURIComponent(config.src);
  const prefix = routePrefix.startsWith('/') ? routePrefix : `/${routePrefix}`;
  return `${prefix}?url=${urlParam}&w=${w}&q=${qClamped}`;
}

/**
 * `ImageLoader` for `NgOptimizedImage` that matches the server's query contract (`url`, `w`, `q`).
 */
export function imageOptimizerLoader(
  options: ImageOptimizerLoaderOptions | string = {},
): ImageLoader {
  const opts: ImageOptimizerLoaderOptions =
    typeof options === 'string' ? { routePrefix: options } : options;
  const routePrefix = opts.routePrefix ?? '/_ng/image';
  const defaultWidth = opts.defaultWidth ?? 1080;
  const defaultQuality = opts.defaultQuality ?? 90;

  return (config) => buildOptimizerUrl(routePrefix, config, defaultWidth, defaultQuality);
}

/**
 * Registers {@link imageOptimizerLoader} as `IMAGE_LOADER`.
 */
export function provideImageOptimizerLoader(options: ImageOptimizerLoaderOptions = {}): Provider {
  return {
    provide: IMAGE_LOADER,
    useValue: imageOptimizerLoader(options),
  };
}
