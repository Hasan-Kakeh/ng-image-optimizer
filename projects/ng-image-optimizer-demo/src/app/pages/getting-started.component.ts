import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { DOC_PAGE_STYLES } from './doc-page.styles';

interface ImageSizeRow {
  variant: string;
  format: string;
  dimensions: string;
  size: string;
  highlight?: 'original' | 'optimized' | 'savings';
}

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <h1>Introduction</h1>
    <p>Optimize Images in your Angular Application using the built-in <code>NgOptimizedImage</code> directive powered by incredible sharp backend.</p>

    <h2>What is ng-image-optimizer?</h2>
    <p>The <code>ng-image-optimizer</code> library extends Angular's native image capabilities by providing a high-performance Express middleware that intercepts image requests, processes them using the <a href="https://sharp.pixelplumbing.com/" target="_blank" class="text-link">sharp</a> library, and caches the results on disk.</p>

    <h3>Key Features</h3>
    <ul>
      <li><strong>🚀 Performance:</strong> Automatic resizing, format conversion (WebP/AVIF), and quality adjustment.</li>
      <li><strong>⚡ Seamless Integration:</strong> Works directly with Angular's built-in <code>NgOptimizedImage</code> directive.</li>
      <li><strong>💾 Advanced Caching:</strong> Persistent file-based caching with LRU (Least Recently Used) logic to minimize server load.</li>
      <li><strong>🛡️ Secure by Default:</strong> Built-in Content Security Policy (CSP) headers and SVG protection.</li>
      <li><strong>🛠️ Automated Setup:</strong> Includes an <code>ng add</code> schematic for zero-config integration.</li>
      <li><strong>🌍 Remote Image Support:</strong> Securely fetch and optimize images from external domains via allowlists.</li>
    </ul>

    <h2>Why do I need it?</h2>
    <p>While Angular provides the <code>NgOptimizedImage</code> directive to ensure images are loaded correctly with performance best-practices (lazy-loading, <code>fetchpriority</code>), <strong>it does not actually resize or compress image files on your server.</strong> You still need a backend image loader to handle the processing. That's where <code>ng-image-optimizer</code> steps in, bringing Next.js-level image optimization natively to Angular projects.</p>

    <h2>Example <span class="text-muted">(AOT / Build Mode)</span></h2>
    <p>
      Same source file (<code>/cairo.jpg</code>), two delivery paths — a standard
      <code>&lt;img&gt;</code> pulls the full JPEG from disk, while
      <code>NgOptimizedImage</code> routes through the optimizer.
    </p>

    <p class="example-savings">{{ savingsSummary }}</p>

    <div class="example-compare">
      <div class="example-panel">
        <div class="example-panel-header">
          <span class="example-label">Standard <code>&lt;img&gt;</code></span>
          <span class="size-tag size-tag--original">{{ standardImgSize }}</span>
        </div>
        <img
          src="./cairo.jpg"
          width="900"
          height="600"
          alt="Cairo — original JPEG"
          class="example-image"
          loading="lazy"
        />
      </div>

      <div class="example-panel">
        <div class="example-panel-header">
          <span class="example-label"><code>NgOptimizedImage</code></span>
          <span class="size-tag size-tag--optimized">{{ optimizedImgSize }}</span>
        </div>
        <img
          ngSrc="./cairo.jpg"
          width="900"
          height="600"
          sizes="100vw"
          alt="Cairo — optimized via ng-image-optimizer"
          class="example-image"
          loading="lazy"
        />
      </div>
    </div>

    <h3 class="size-list-title">File sizes</h3>
    <div class="table-wrapper">
      <table class="size-table">
        <thead>
          <tr>
            <th>Variant</th>
            <th>Format</th>
            <th>Dimensions</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          @for (row of imageSizes; track row.variant) {
            <tr [class]="row.highlight ? 'row--' + row.highlight : ''">
              <td>{{ row.variant }}</td>
              <td><code>{{ row.format }}</code></td>
              <td>{{ row.dimensions }}</td>
              <td class="size-cell">{{ row.size }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <h2>Dual-engine architecture</h2>
    <p>
      Version 1.0 introduces two isolated, fully tree-shakable operational modes. Pick one
      per application — they are not meant to run together.
    </p>

    <div class="mode-grid">
      <div class="mode-card">
        <h3>SSR / Dynamic Mode</h3>
        <p>
          Sharp-powered Express middleware optimizes images on demand at request time — resize,
          reformat (WebP/AVIF), and cache to disk.
        </p>
        <p>
          Best for SSR apps, dynamic platforms, and user-uploaded media.
          <a routerLink="/ssr/setup">Set up SSR mode →</a>
        </p>
      </div>
      <div class="mode-card">
        <h3>AOT / Build Mode</h3>
        <p>
          A post-build CLI pre-generates every responsive variant at compile time. The client
          loader points directly at static files — zero runtime image processing.
        </p>
        <p>
          Best for SSG, Jamstack, GitHub Pages, Vercel, and Netlify.
          <a routerLink="/aot/setup">Set up AOT mode →</a>
        </p>
      </div>
    </div>

    <!-- <h2>What both engines share</h2>
    <ul>
      <li>
        <strong>Breakpoint matrix:</strong> Both register Angular's
        <code>IMAGE_CONFIG</code> with a curated width allowlist so
        <code>srcset</code> values stay in sync with what the engine can serve.
      </li>
      <li>
        <strong>CLS prevention:</strong> Width and height flow through the loader resolution
        chain so layout stays stable while variants load.
      </li>
      <li>
        <strong>NgOptimizedImage native:</strong> Drop-in <code>IMAGE_LOADER</code> providers —
        no custom directives required.
      </li>
    </ul> -->

    <h2>Why not just NgOptimizedImage alone?</h2>
    <p>
      Angular's directive enforces loading best practices — lazy loading, priority hints, and
      correct <code>srcset</code> syntax — but it does <strong>not</strong> compress or resize
      files on disk or at the CDN edge. You still need an engine behind the loader.
      <code>ng-image-optimizer</code> fills that gap with a Next.js-style pipeline, purpose-built
      for Angular SSR and static deployments.
    </p>

    <div class="callout">
      <strong>Not sure which mode?</strong>
      Read <a routerLink="/which-mode" class="text-link">Which Mode Should I Use?</a> for a
      decision guide, then follow <a routerLink="/installation" class="text-link">Installation</a>.
    </div>
  `,
  styles: [
    DOC_PAGE_STYLES,
    `
      .example-savings {
        margin: 0 0 16px;
        padding: 10px 14px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #34d399;
        background: rgba(52, 211, 153, 0.1);
        border: 1px solid rgba(52, 211, 153, 0.25);
        border-radius: var(--radius-md);
      }

      .example-compare {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }

      @media (max-width: 768px) {
        .example-compare {
          grid-template-columns: 1fr;
        }
      }

      .example-panel {
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        overflow: hidden;
        background: var(--bg-secondary);
      }

      .example-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 14px;
        border-bottom: 1px solid var(--border-light);
      }

      .example-label {
        font-size: 0.8rem;
        color: var(--text-secondary);
      }

      .example-label code {
        font-size: 0.75rem;
      }

      .text-muted {
        color: var(--text-secondary);
        font-size: 0.8rem;
      }

      .size-tag {
        flex-shrink: 0;
        padding: 2px 8px;
        font-size: 0.75rem;
        font-weight: 600;
        font-family: var(--font-mono);
        border-radius: var(--radius-full);
        white-space: nowrap;
      }

      .size-tag--original {
        color: #f87171;
        background: rgba(248, 113, 113, 0.12);
        border: 1px solid rgba(248, 113, 113, 0.3);
      }

      .size-tag--optimized {
        color: #34d399;
        background: rgba(52, 211, 153, 0.12);
        border: 1px solid rgba(52, 211, 153, 0.3);
      }

      .example-image {
        display: block;
        width: 100%;
        height: auto;
      }

      .size-list-title {
        font-size: 1rem;
        margin-top: 0;
        margin-bottom: 12px;
      }

      .size-table .size-cell {
        font-family: var(--font-mono);
        font-weight: 600;
      }

      .size-table .row--original .size-cell {
        color: #f87171;
      }

      .size-table .row--optimized .size-cell {
        color: #34d399;
      }

      .size-table .row--savings .size-cell {
        color: #34d399;
      }

      .size-table .row--savings td:first-child {
        font-weight: 600;
        color: var(--text-primary);
      }
    `,
  ],
})
export class GettingStartedComponent {
  /** Measured from public/cairo.jpg — 5379×3585 JPEG on disk. */
  readonly standardImgSize = '2.5 MB';

  /** Sharp output: 900px width, WebP, quality 90. */
  readonly optimizedImgSize = '134 KB';

  readonly savingsSummary = '~80% smaller (2.2 MB saved) with ng-image-optimizer';

  readonly imageSizes: readonly ImageSizeRow[] = [
    {
      variant: 'Source on disk',
      format: 'JPEG',
      dimensions: '5379 × 3585',
      size: '2.5 MB',
      highlight: 'original',
    },
    {
      variant: 'NgOptimizedImage',
      format: 'WebP',
      dimensions: '640 × 400',
      size: '43 KB',
      highlight: 'optimized',
    },
    {
      variant: 'NgOptimizedImage',
      format: 'WebP',
      dimensions: '828 × 600',
      size: '70 KB',
      highlight: 'optimized',
    },
    {
      variant: 'NgOptimizedImage',
      format: 'WebP',
      dimensions: '1080 × 600',
      size: '134 KB',
      highlight: 'optimized',
    },
    {
      variant: 'NgOptimizedImage',
      format: 'WebP',
      dimensions: '1920 × 1200',
      size: '387 KB',
      highlight: 'optimized',
    },
    {
      variant: 'Savings',
      format: '—',
      dimensions: '_',
      size: '~80%',
      highlight: 'savings',
    },
  ];
}
