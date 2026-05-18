import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-ssr-configuration',
  standalone: true,
  imports: [CodeBlockComponent, RouterLink],
  template: `
    <h1>SSR / Dynamic — Configuration Reference</h1>

    <h2>Client: <code>provideImageOptimizerLoader</code></h2>

    <h3 class="option-title"><code>routePrefix</code></h3>
    <p>Mount path for the middleware. Default: <code>/_ng/image</code>.</p>

    <h3 class="option-title"><code>defaultWidth</code></h3>
    <p>Width used when Angular requests the primary <code>src</code> without a width. Default: <code>1080</code>.</p>

    <h3 class="option-title"><code>defaultQuality</code></h3>
    <p>Default quality (1–100) when <code>loaderParams</code> omits <code>q</code> / <code>quality</code>. Default: <code>90</code>.</p>

    <h3 class="option-title"><code>widths</code></h3>
    <p>
      Override the <code>IMAGE_CONFIG.breakpoints</code> allowlist. By default the provider merges
      <code>imageSizes</code> and <code>deviceSizes</code> from the server config.
    </p>

    <h3 class="option-title"><code>placeholderResolution</code></h3>
    <p>Resolution hint for blur placeholders. Default: <code>30</code>.</p>

    <hr />

    <h2>Server: <code>imageOptimizerHandler</code></h2>
    <p>
      Second argument is a partial <code>ImageConfig</code>. Unset fields fall back to library
      defaults.
    </p>

    <h3 class="option-title"><code>deviceSizes</code> / <code>imageSizes</code></h3>
    <p>Allowed widths for validation. Defaults:</p>
    <ul>
      <li><code>imageSizes</code>: 16, 32, 48, 64, 96, 128, 256, 384</li>
      <li><code>deviceSizes</code>: 640, 750, 828, 1080, 1200, 1440, 1920, 2048</li>
    </ul>

    <h3 class="option-title"><code>remotePatterns</code></h3>
    <p>Allowlist of external hosts the server may fetch. Required for remote images — see <a routerLink="/ssr/remote-images" class="text-link">Remote Images</a>.</p>

    <h3 class="option-title"><code>localPatterns</code></h3>
    <p>Optional path allowlist inside <code>browserDistFolder</code>. Empty means all local paths are allowed.</p>

    <h3 class="option-title"><code>formats</code></h3>
    <p>Output formats, e.g. <code>['image/webp']</code> or <code>['image/avif', 'image/webp']</code>. Default: WebP only.</p>

    <h3 class="option-title"><code>minimumCacheTTL</code></h3>
    <p>Minimum cache lifetime in seconds before re-optimizing. Default: <code>14400</code> (4 hours).</p>

    <h3 class="option-title"><code>dangerouslyAllowSVG</code></h3>
    <p>Allow SVG optimization. Default: <code>false</code> (XSS risk when inlined).</p>

    <h3 class="option-title"><code>maxCacheSize</code></h3>
    <p>LRU index size in bytes. Default: 50 MB.</p>

    <app-code-block language="typescript" [code]="exampleCode"></app-code-block>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class SsrConfigurationComponent {
  exampleCode = `app.use('/_ng/image', imageOptimizerHandler(browserDistFolder, {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60 * 60 * 24,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.example.com',
      pathname: '/**',
    },
  ],
}));`;
}
