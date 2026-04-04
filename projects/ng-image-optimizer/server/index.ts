/**
 * Server-side entry point for ng-image-optimizer
 * Exports all server-side functionality for image optimization
 */

export { imageOptimizerHandler } from './handler';
export type { ImageConfig } from './config';
export { defaultConfig } from './config';
export { ImageError } from './utils';
