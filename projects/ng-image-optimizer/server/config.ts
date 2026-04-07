/**
 * Configuration for allowing specific external domains for image optimization.
 * Used to restrict which remote URLs the optimizer will fetch and process.
 */
export interface RemotePattern {
  /** The protocol of the remote image URL. */
  protocol?: 'http' | 'https';
  /** The hostname (or domain) of the remote image URL. Can include wildcards. */
  hostname: string;
  /** The port of the remote image URL. */
  port?: string;
  /** The path pattern of the remote image URL. Can include wildcards. */
  pathname?: string;
  /** The search query string pattern. */
  search?: string;
}

/**
 * Configuration for allowing specific local paths for image optimization.
 * Used to restrict which local URIs the optimizer will process.
 */
export interface LocalPattern {
  /** The path pattern of the local image. Can include wildcards. */
  pathname: string;
  /** The search query string pattern. */
  search?: string;
}

/**
 * Comprehensive configuration options for the image optimizer middleware.
 * Controls source validation, caching behavior, and optimization limits.
 */
export interface ImageConfig {
  /** List of device widths in pixels. Used to validate requested widths. */
  deviceSizes: number[];
  /** List of image widths in pixels. Used to validate requested widths. */
  imageSizes: number[];
  /** List of permitted remote image sources. */
  remotePatterns: RemotePattern[];
  /** List of permitted local image sources (optional). */
  localPatterns?: LocalPattern[];
  /** Minimum time (in seconds) to cache optimized images. */
  minimumCacheTTL: number;
  /** Allowed output formats for optimization. */
  formats: ('image/avif' | 'image/webp')[];
  /** Whether to allow processing of SVG images (can pose an XSS risk if rendered inline). */
  dangerouslyAllowSVG: boolean;
  /** The Content-Security-Policy header to set on image responses. */
  contentSecurityPolicy: string;
  /** Whether the image should be rendered inline or downloaded as an attachment. */
  contentDispositionType: 'inline' | 'attachment';
  /** Allowed quality values (1-100). */
  qualities?: number[];
  /** Maximum size in bytes for the LRU cache layer. */
  maxCacheSize?: number;
}

/**
 * Default configuration values applied to the image optimizer middleware.
 * Can be overridden by passing custom options to the handler.
 */
export const defaultConfig: ImageConfig = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  remotePatterns: [],
  minimumCacheTTL: 14400,
  formats: ['image/webp'],
  dangerouslyAllowSVG: false,
  contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
  contentDispositionType: 'inline',
  maxCacheSize: 50 * 1024 * 1024, // 50MB
};
