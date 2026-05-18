import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Introduction</h1>
    <p>
      <code>ng-image-optimizer</code> extends Angular's
      <code>NgOptimizedImage</code> with production-grade image compression, format
      conversion, and responsive sizing — without leaving the Angular ecosystem.
    </p>

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

    <h2>What both engines share</h2>
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
    </ul>

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
  styles: [DOC_PAGE_STYLES],
})
export class GettingStartedComponent {}
