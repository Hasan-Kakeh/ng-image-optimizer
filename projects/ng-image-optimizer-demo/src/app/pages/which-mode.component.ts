import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-which-mode',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Which Mode Should I Use?</h1>
    <p>
      Both modes plug into <code>NgOptimizedImage</code> via Angular's
      <code>IMAGE_LOADER</code> token. The difference is <em>when</em> and <em>where</em> images
      are processed.
    </p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>SSR / Dynamic</th>
            <th>AOT / Build</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Deployment</td>
            <td>Node server (Express, custom SSR)</td>
            <td>Static hosting (GitHub Pages, Netlify, Vercel static)</td>
          </tr>
          <tr>
            <td>Processing</td>
            <td>On first request via Sharp middleware</td>
            <td>Once at build time via CLI</td>
          </tr>
          <tr>
            <td>Runtime overhead</td>
            <td>CPU per unique image × width</td>
            <td>None — files are pre-generated</td>
          </tr>
          <tr>
            <td>User uploads</td>
            <td>Yes — new URLs optimized on demand</td>
            <td>No — only assets present at build time</td>
          </tr>
          <tr>
            <td>Peer dependency</td>
            <td><code>sharp</code> on the server</td>
            <td><code>sharp</code> only for the build step</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Choose SSR / Dynamic when…</h2>
    <ul>
      <li>Your app runs Angular SSR with an Express (or compatible) server.</li>
      <li>Image sources change at runtime (CMS content, avatars, user uploads).</li>
      <li>You want format negotiation (WebP/AVIF) without rebuilding the site.</li>
    </ul>
    <p><a routerLink="/ssr/setup" class="text-link">Continue to SSR setup →</a></p>

    <h2>Choose AOT / Build when…</h2>
    <ul>
      <li>You deploy a static <code>browser</code> bundle with no image-processing server.</li>
      <li>All images live in <code>public/</code> or are copied into the dist at build time.</li>
      <li>You want predictable asset URLs and zero cold-start latency on first view.</li>
    </ul>
    <p><a routerLink="/aot/setup" class="text-link">Continue to AOT setup →</a></p>

    <div class="callout">
      <strong>Can I switch later?</strong>
      Yes — swap the provider in <code>app.config.ts</code> and add or remove the server
      middleware / postbuild script. The <code>ng add</code> schematic accepts
      <code>--mode=SSR</code> or <code>--mode=AOT</code> for a guided setup.
    </div>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class WhichModeComponent {}
