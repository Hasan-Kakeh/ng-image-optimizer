/**
 * Programmatic API for the ng-image-optimizer AOT pre-optimizer.
 *
 * Can be used directly in custom build scripts:
 *
 * @example
 * ```ts
 * import { runAotOptimizer } from 'ng-image-optimizer/aot';
 *
 * await runAotOptimizer({
 *   distDir: './dist/my-app/browser',
 *   paths: ['assets/images/**\/*.{jpg,jpeg,png}'],
 *   quality: 90,
 *   format: 'webp',
 *   widths: [640, 828, 1080, 1200, 1920],
 * });
 * ```
 */

export { runAotOptimizer, buildAotUrl, buildAotFilename } from './aot-optimizer';
export type { AotOptimizerOptions, AotResult, AotFormat } from './aot-optimizer';
