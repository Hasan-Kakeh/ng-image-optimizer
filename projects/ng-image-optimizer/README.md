# NgImageOptimizer

An image optimization library for Angular SSR. It provides a customized `IMAGE_LOADER` for Angular's `NgOptimizedImage` and a back-end Express middleware for processing and caching images using `sharp`.

## 📦 Installation

Install the library and its peer dependencies:

```bash
npm install ng-image-optimizer sharp lru-cache
```

## 🚀 Setup

### 1. Automated (Recommended)

Run the schematic to automatically configure your application:

```bash
ng add ng-image-optimizer
```

---

### 2. Manual Setup

If you prefer to configure things manually, follow these steps:

#### Client-Side Configuration
Register the image loader in your `app.config.ts`:

```typescript
import { provideImageOptimizerLoader } from 'ng-image-optimizer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideImageOptimizerLoader({
      routePrefix: '/_ng/image' // Must match server-side route
    })
  ]
};
```

#### Server-Side Configuration
Add the middleware to your `server.ts` before other routes:

```typescript
import { imageOptimizerHandler } from 'ng-image-optimizer/server';

// ... early in your express app setup
const browserDistFolder = resolve(serverDistFolder, '../browser');

server.get('/_ng/image', imageOptimizerHandler(browserDistFolder, {
  remotePatterns: [
    { hostname: 'images.unsplash.com' } // Allow external domains
  ],
  formats: ['image/webp', 'image/avif'] // Targeted formats
}));
```

---

## 🛠️ Usage

Use standard Angular `NgOptimizedImage` in your templates. The library will automatically handle the resolution and optimization.

```html
<img ngSrc="assets/photo.jpg" width="800" height="600" priority>
```

---

## ⚙️ Configuration (`ImageConfig`)

When initializing `imageOptimizerHandler`, you can pass an optional configuration object:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `deviceSizes` | `number[]` | `[640, 750, 828, ...]` | Allowed widths for device breakpoints. |
| `imageSizes` | `number[]` | `[16, 32, 48, ...]` | Allowed widths for smaller UI elements. |
| `remotePatterns` | `RemotePattern[]` | `[]` | List of allowed external domains. |
| `minimumCacheTTL` | `number` | `14400` (4h) | Minimum time (seconds) to cache an image. |
| `formats` | `string[]` | `['image/webp']` | Favored output formats (supports webp/avif). |
| `dangerouslyAllowSVG` | `boolean` | `false` | Whether to allow processing SVG images. |
| `contentSecurityPolicy` | `string` | `...` | CSP headers for the served images. |

---

## 🔐 Security

- **Allowlist Driven**: Remote images are only fetched if they match `remotePatterns`.
- **Parameter Validation**: Requests are strictly validated for matching widths and valid URLs.
- **Sandboxed**: CSP headers are automatically applied to prevent script injection via images.

## 💾 Caching

The library uses a highly optimized file-based cache located in `.image-cache/`. 
- **High Entropy Keys**: Cache keys are generated based on the URL, width, quality, and format.
- **Vary Headers**: Correctly handles `Accept` headers to serve different formats to different browsers.
- **Etag Support**: Implements strong ETags for browser-level caching.

## 📄 License
MIT
