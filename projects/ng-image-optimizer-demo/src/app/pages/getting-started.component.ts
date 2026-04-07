import { Component } from '@angular/core';

@Component({
  selector: 'app-getting-started',
  standalone: true,
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
  `,
  styles: [`
    ul { margin-bottom: 24px; padding-left: 20px; color: var(--text-secondary); }
    li { margin-bottom: 8px; }
    strong { color: var(--text-primary); font-weight: 600; }
  `]
})
export class GettingStartedComponent {}
