/**
 * Client-side entry point for ng-image-optimizer
 * Exports all client-side functionality for image optimization
 */

export { imageOptimizerLoader, provideImageOptimizerLoader } from './image-loader-provider';
export type { ImageOptimizerLoaderOptions } from './image-loader-provider';

export { aotImageLoader, provideAotImageLoader } from './aot-image-loader';
export type { AotImageLoaderOptions } from './aot-image-loader';
