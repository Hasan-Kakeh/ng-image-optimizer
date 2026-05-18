import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-aot-cli',
  standalone: true,
  imports: [CodeBlockComponent, RouterLink],
  template: `
    <h1>AOT / Build — CLI Reference</h1>
    <p>
      <code>ng-image-optimizer-aot</code> scans your browser dist, generates resized variants with
      Sharp, and writes them next to the originals using the
      <a routerLink="/aot/naming" class="text-link">naming convention</a>.
    </p>

    <app-code-block language="bash" code="ng-image-optimizer-aot --help"></app-code-block>

    <h2>Options</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>--dist</code></td>
            <td>Path to Angular <code>browser</code> output (required)</td>
            <td>—</td>
          </tr>
          <tr>
            <td><code>--paths</code></td>
            <td>Comma-separated globs relative to <code>--dist</code></td>
            <td><code>**</code></td>
          </tr>
          <tr>
            <td><code>--skip</code></td>
            <td>Globs to exclude (e.g. <code>icons/**</code>)</td>
            <td>—</td>
          </tr>
          <tr>
            <td><code>--quality</code></td>
            <td>Output quality 1–100</td>
            <td><code>90</code></td>
          </tr>
          <tr>
            <td><code>--format</code></td>
            <td><code>webp</code> | <code>avif</code> | <code>jpeg</code></td>
            <td><code>webp</code></td>
          </tr>
          <tr>
            <td><code>--widths</code></td>
            <td>Comma-separated pixel widths to generate</td>
            <td><code>640,828,1080,1200,1920</code></td>
          </tr>
          <tr>
            <td><code>--concurrency</code></td>
            <td>Parallel Sharp workers</td>
            <td><code>4</code></td>
          </tr>
          <tr>
            <td><code>--blur</code></td>
            <td>Generate a small blurred placeholder (64px)</td>
            <td>off</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Examples</h2>
    <app-code-block language="bash" [code]="example1"></app-code-block>
    <app-code-block language="bash" [code]="example2"></app-code-block>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class AotCliComponent {
  example1 = `ng-image-optimizer-aot --dist ./dist/my-app/browser --format webp`;

  example2 = `ng-image-optimizer-aot \\
  --dist ./dist/app/browser \\
  --paths "assets/**,images/**" \\
  --skip "icons/**" \\
  --quality 80 \\
  --format avif \\
  --widths 640,750,1080,1920`;
}
