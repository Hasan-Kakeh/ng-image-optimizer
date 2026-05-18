# 🖼️ NgImageOptimizer

**NgImageOptimizer** is a high-performance image optimization library for Angular applications. It bridges the gap between Angular's `NgOptimizedImage` directive and actual image processing — bringing Next.js-level optimization natively to your Angular projects, without relying on third-party CDNs like Cloudinary or Imgix.

---

[**📖 View Documentation**](https://hasan-kakeh.github.io/ng-image-optimizer/) &nbsp;·&nbsp; [**npm**](https://www.npmjs.com/package/ng-image-optimizer) &nbsp;·&nbsp; [**GitHub**](https://github.com/Hasan-Kakeh/ng-image-optimizer)

---

## 🧐 Why NgImageOptimizer?

Angular's `NgOptimizedImage` directive handles lazy loading and `fetchpriority` correctly, but it does **not** resize or compress your images — that still requires an external loader. **NgImageOptimizer** brings that processing in-house, so you can:

- 🚀 **Self-host** your entire image optimization pipeline — no CDN subscriptions.
- 📉 **Reduce LCP** with automatic resizing and modern formats (WebP/AVIF).
- ⚡ **Zero runtime overhead** for static sites using the AOT build mode.
- 💾 **Optimize once, serve many** with advanced LRU file caching (SSR mode).
- 🛡️ **Stay secure** with domain allowlists, CSP headers, and SVG protection.
- 🛠️ **Automated Setup** via `ng add` schematic for zero-config integration.

---

## 🔀 Two Engines, One Library

Version 1.0.0 introduces a fully tree-shakable **dual-engine architecture**. Choose the mode that fits your deployment target:

|                      | SSR / Dynamic Mode                        | AOT / Build Mode                             |
| :------------------- | :---------------------------------------- | :------------------------------------------- |
| **Best for**         | SSR apps, dynamic platforms, user uploads | SSG, Jamstack, GitHub Pages, Vercel, Netlify |
| **Processing**       | At request time via Express middleware    | At build time via CLI script                 |
| **Runtime overhead** | Minimal (mitigated by caching)            | Zero                                         |
| **Output formats**   | WebP / AVIF                               | WebP / AVIF / JPEG                           |
| **Dynamic content**  | ✅                                        | ❌                                           |

---

## 🚦 Quick Start

The fastest way to get started is using the automated schematic:

```bash
ng add ng-image-optimizer
```

This will install dependencies, register the image loader in `app.config.ts`, and configure the middleware in `server.ts`.

---

## ⚙️ SSR / Dynamic Mode

Best for Angular Universal / SSR applications that need runtime image processing.

### Prerequisites

- Node.js v18+
- Angular CLI
- Angular SSR (`@angular/ssr`)

### Installation

```bash
npm install ng-image-optimizer sharp
```

### Client Configuration (`app.config.ts`)

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideImageOptimizerLoader } from 'ng-image-optimizer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideImageOptimizerLoader({
      routePrefix: '/_ng/image', // Must match server-side route
    }),
  ],
};
```

### Server Configuration (`server.ts`)

Add the middleware **before** your Angular SSR handler:

```typescript
import { imageOptimizerHandler } from 'ng-image-optimizer/server';

const browserDistFolder = resolve(serverDistFolder, '../browser');

server.get(
  '/_ng/image',
  imageOptimizerHandler(browserDistFolder, {
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  }),
);
```

### Client Provider Options (`ImageOptimizerLoaderOptions`)

| Property         | Type     | Default      | Description                                               |
| :--------------- | :------- | :----------- | :-------------------------------------------------------- |
| `routePrefix`    | `string` | `/_ng/image` | Path where the optimizer middleware is mounted.           |
| `defaultWidth`   | `number` | `1080`       | Fallback width if `NgOptimizedImage` doesn't provide one. |
| `defaultQuality` | `number` | `90`         | Default compression quality (1–100).                      |

### Server Middleware Options (`ImageConfig`)

| Property                 | Type                       | Default                                   | Description                                                       |
| :----------------------- | :------------------------- | :---------------------------------------- | :---------------------------------------------------------------- |
| `deviceSizes`            | `number[]`                 | `[640, 750, 828, 1080, 1200, 1920, 2048]` | Allowed widths for device breakpoints.                            |
| `imageSizes`             | `number[]`                 | `[16, 32, 48, 64, 96, 128, 256, 384]`     | Allowed widths for smaller UI elements.                           |
| `remotePatterns`         | `RemotePattern[]`          | `[]`                                      | Allowlist of external domains to fetch images from.               |
| `localPatterns`          | `LocalPattern[]`           | `[]`                                      | Allowlist of local path patterns to process.                      |
| `minimumCacheTTL`        | `number`                   | `14400`                                   | Minimum cache duration in seconds (default: 4 hours).             |
| `formats`                | `string[]`                 | `['image/webp']`                          | Preferred output formats. Supports `image/webp` and `image/avif`. |
| `dangerouslyAllowSVG`    | `boolean`                  | `false`                                   | Whether to allow SVG processing.                                  |
| `contentSecurityPolicy`  | `string`                   | `...`                                     | CSP header applied to image responses.                            |
| `contentDispositionType` | `'inline' \| 'attachment'` | `'inline'`                                | How the browser handles the image response.                       |
| `maxCacheSize`           | `number`                   | `52428800`                                | Maximum LRU memory cache size in bytes (default: 50MB).           |

---

## 🏗️ AOT / Build Mode

Best for static sites and Jamstack deployments where runtime processing is not available.

### How It Works

1. The **CLI script** (`ng-image-optimizer-aot`) runs as a `postbuild` step, scanning your `dist/browser/assets/` folder and pre-compiling every image into all required responsive breakpoint variants.
2. The **client loader** (`provideImageOptimizerLoader` with `aot` options) rewrites image paths at runtime to match the pre-compiled naming convention.

Output files follow a deterministic naming pattern:

```
assets/hero.jpg  →  assets/hero.750q90.webp   (at 750px width, quality 90)
                 →  assets/hero.1080q90.webp  (at 1080px width, quality 90)
                 →  assets/hero.750q90.blur.webp  (blur placeholder, if enabled)
```

### Installation

```bash
npm install ng-image-optimizer
```

> No `sharp` peer dependency needed at runtime — it is only used during the build step.

### Client Configuration (`app.config.ts`)

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideImageOptimizerLoader } from 'ng-image-optimizer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideImageOptimizerLoader({
      aot: {
        format: 'webp',
        quality: 90,
        blur: true, // Enable to use pre-generated .blur.webp placeholder files
      },
    }),
  ],
};
```

### Build Script (`package.json`)

```json
{
  "scripts": {
    "build": "ng build",
    "postbuild": "ng-image-optimizer-aot --dist ./dist/my-app/browser"
  }
}
```

### CLI Reference (`ng-image-optimizer-aot`)

```bash
npx ng-image-optimizer-aot --dist ./dist/browser [options]
```

| Flag        | Description                                    | Default                  |
| :---------- | :--------------------------------------------- | :----------------------- |
| `--dist`    | Path to your browser distribution folder.      | _(required)_             |
| `--paths`   | Glob pattern for images to process.            | `**`                     |
| `--skip`    | Glob patterns to exclude (e.g. `icons/**`).    | —                        |
| `--quality` | Output image quality (1–100).                  | `90`                     |
| `--format`  | Output format: `webp` \| `avif` \| `jpeg`.     | `webp`                   |
| `--widths`  | Comma-separated responsive widths to generate. | `640,828,1080,1200,1920` |

---

## 🛞 Usage

Both modes use Angular's standard `NgOptimizedImage` directive in your templates — no template changes required when switching between engines.

### Basic

```html
<img [ngSrc]="'/assets/hero.jpg'" width="1200" height="600" alt="Hero image" />
```

### Priority (LCP images)

```html
<img [ngSrc]="'/assets/logo.png'" width="200" height="50" priority alt="Logo" />
```

### Fill Mode

```html
<div style="position: relative; height: 400px;">
  <img [ngSrc]="'/assets/background.jpg'" fill style="object-fit: cover;" alt="Background" />
</div>
```

### Custom Quality (SSR mode)

```html
<img
  [ngSrc]="'/assets/photo.jpg'"
  width="800"
  height="400"
  [loaderParams]="{ quality: 75 }"
  alt="Custom quality"
/>
```

### Responsive Sizes

```html
<img
  [ngSrc]="'/assets/responsive.jpg'"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Responsive image"
/>
```

### Blur Placeholder

```html
<img [ngSrc]="'/assets/nature.jpg'" width="800" height="600" placeholder alt="Nature photo" />
```

---

## 📄 License

`ng-image-optimizer` is open source, released under the [MIT License](./LICENSE).
