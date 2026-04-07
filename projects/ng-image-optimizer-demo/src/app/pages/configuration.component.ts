import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>Configuration</h1>

    <h2>Client Provider Options</h2>
    <p>When registering <code>provideImageOptimizerLoader</code>, you can pass an optional configuration object:</p>
    
    <h3><code>routePrefix</code></h3>
    <p>The path where the image optimizer middleware is mounted. Default is <code>/_ng/image</code>.</p>

    <h3><code>defaultWidth</code></h3>
    <p>The default width used if <code>NgOptimizedImage</code> doesn't provide one. Default is <code>1080</code>.</p>

    <h3><code>defaultQuality</code></h3>
    <p>The default image quality (1-100). Default is <code>90</code>.</p>

    <hr style="margin: 32px 0; border: 0; border-top: 1px solid var(--border-color); opacity: 0.5;">

    <h2>Server Middleware Options</h2>
    <p>The <code>imageOptimizerHandler</code> accepts an optional configuration object that implements the <code>ImageConfig</code> interface.</p>
    
    <h3><code>deviceSizes</code></h3>
    <p>Allowed widths for device breakpoints. Used to validate requested widths. Default is <code>[640, 750, 828, 1080, 1200, 1920, 2048]</code>.</p>
    
    <h3><code>imageSizes</code></h3>
    <p>Allowed widths for smaller UI elements. Used to validate requested widths. Default is <code>[16, 32, 48, 64, 96, 128, 256, 384]</code>.</p>
    
    <h3><code>remotePatterns</code></h3>
    <p>An array of objects to configure which external domains you allow the optimizer to fetch images from. This is crucial for security to prevent your server from acting as an open proxy.</p>
    <app-code-block language="typescript" [code]="remotePatternsCode"></app-code-block>

    <h3><code>localPatterns</code></h3>
    <p>An array of objects to configure which local paths you allow the optimizer to process. Leave empty to allow all local paths (default behavior inside browserDistFolder).</p>

    <h3><code>minimumCacheTTL</code></h3>
    <p>The minimum time in seconds that an image should be cached before re-optimizing. Default is <code>14400</code> (4 hours).</p>

    <h3><code>formats</code></h3>
    <p>An array of supported output formats. Currently supports <code>['image/webp']</code> and <code>['image/avif', 'image/webp']</code>. Default is <code>['image/webp']</code>.</p>

    <h3><code>dangerouslyAllowSVG</code></h3>
    <p>Whether to allow SVG images to be optimized. Default is <code>false</code>.</p>
    
    <h3><code>contentSecurityPolicy</code></h3>
    <p>The Content-Security-Policy header to set on image responses. Default restricts scripts and frames.</p>
    
    <h3><code>contentDispositionType</code></h3>
    <p>Whether the image should be rendered inline or downloaded as an attachment. Default is <code>'inline'</code>.</p>

    <h3><code>maxCacheSize</code></h3>
    <p>The maximum size in bytes for the LRU memory cache index. Default is <code>52428800</code> (50MB).</p>
  `,
  styles: [`
    h3 {
      font-family: var(--font-mono);
      font-size: 1.1rem;
    }
  `]
})
export class ConfigurationComponent {
  remotePatternsCode = `import { imageOptimizerHandler } from 'ng-image-optimizer/server';

app.get('/_ng/image', imageOptimizerHandler(browserDistFolder, {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example.com',
      pathname: '/images/**',
    },
  ],
}));`;
}
