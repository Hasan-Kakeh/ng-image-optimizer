import { Component } from '@angular/core';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-breakpoint-matrix',
  standalone: true,
  template: `
    <h1>Breakpoint Matrix</h1>
    <p>
      Both engines register Angular's <code>IMAGE_CONFIG.breakpoints</code> so
      <code>NgOptimizedImage</code> only emits <code>srcset</code> widths the backend can satisfy.
    </p>

    <h2>SSR / Dynamic defaults</h2>
    <p>The SSR provider merges server <code>imageSizes</code> and <code>deviceSizes</code>:</p>

    <h3><code>imageSizes</code> — UI elements, icons, thumbnails</h3>
    <p class="width-list">16, 32, 48, 64, 96, 128, 256, 384</p>

    <h3><code>deviceSizes</code> — responsive layouts, heroes</h3>
    <p class="width-list">640, 750, 828, 1080, 1200, 1440, 1920, 2048</p>

    <h2>AOT / Build defaults</h2>
    <p>
      The AOT provider uses <code>aotImageSizes</code> for breakpoints unless you pass
      <code>widths</code> to <code>provideAotImageLoader</code>. The CLI
      <code>--widths</code> flag controls which files are generated — keep them aligned.
    </p>
    <p class="width-list">640, 828, 1080, 1200, 1920 (CLI default)</p>

    <h2>Overriding</h2>
    <ul>
      <li>
        <strong>SSR client:</strong> <code>provideImageOptimizerLoader(&#123; widths: […] &#125;)</code>
      </li>
      <li>
        <strong>SSR server:</strong> <code>imageOptimizerHandler(dist, &#123; imageSizes, deviceSizes &#125;)</code>
      </li>
      <li>
        <strong>AOT:</strong> match <code>provideAotImageLoader(&#123; widths &#125;)</code>, CLI
        <code>--widths</code>, and generated files
      </li>
    </ul>

    <div class="callout">
      <strong>Keep client and server in sync (SSR)</strong>
      If the loader requests a width the middleware rejects, the image will fail at runtime.
    </div>
  `,
  styles: [
    DOC_PAGE_STYLES,
    `
      .width-list {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        padding: 12px 16px;
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
      }
    `,
  ],
})
export class BreakpointMatrixComponent {}
