export interface RemotePattern {
  protocol?: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname?: string;
}

export interface ImageConfig {
  deviceSizes: number[];
  imageSizes: number[];
  remotePatterns: RemotePattern[];
  localPatterns?: { pathname: string; search: string }[];
  minimumCacheTTL: number;
  formats: ('image/avif' | 'image/webp')[];
  dangerouslyAllowSVG: boolean;
  contentSecurityPolicy: string;
  contentDispositionType: 'inline' | 'attachment';
  qualities?: number[];
  maxCacheSize?: number;
}

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
