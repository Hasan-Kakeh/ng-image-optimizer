/**
 * Client-side entry point for ng-image-optimizer
 * Exports all client-side functionality for image optimization
 */

export { imageOptimizerLoader, provideImageOptimizerLoader } from './ssr-image-provider';
export type { ImageOptimizerLoaderOptions } from './ssr-image-provider';

export { aotImageLoader, provideAotImageLoader } from './aot-image-provider';
export type { AotImageLoaderOptions } from './aot-image-provider';
