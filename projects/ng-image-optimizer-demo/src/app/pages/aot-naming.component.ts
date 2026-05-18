import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-aot-naming',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>AOT / Build — Naming Convention</h1>
    <p>
      Every pre-generated file follows a deterministic pattern so the AOT loader can resolve URLs
      without a manifest:
    </p>

    <app-code-block
      language="text"
      code="<base>.<width>q<quality>.<format>"
    ></app-code-block>

    <h2>Examples</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Original <code>ngSrc</code></th>
            <th>Width</th>
            <th>Generated file</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>/assets/hero.jpg</code></td>
            <td>750</td>
            <td><code>/assets/hero.750q90.webp</code></td>
          </tr>
          <tr>
            <td><code>/assets/hero.jpg</code></td>
            <td>1080</td>
            <td><code>/assets/hero.1080q90.webp</code></td>
          </tr>
          <tr>
            <td><code>/images/banner.png</code></td>
            <td>640</td>
            <td><code>/images/banner.640q80.avif</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Loader resolution</h2>
    <p>
      <code>provideAotImageLoader(&#123; format: 'webp', quality: 90 &#125;)</code> strips the original
      extension from <code>ngSrc</code> and appends <code>.&lt;width&gt;q&lt;quality&gt;.&lt;format&gt;</code>
      for each <code>srcset</code> entry Angular requests.
    </p>
    <app-code-block language="typescript" [code]="buildUrlCode"></app-code-block>

    <div class="callout">
      <strong>Originals are kept</strong>
      The CLI writes new files alongside sources. In production the loader never requests the raw
      JPEG/PNG when <code>isDevMode</code> is false.
    </div>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class AotNamingComponent {
  buildUrlCode = `// assets/hero.jpg @ 1080px, quality 90, webp
// → /assets/hero.1080q90.webp

buildAotImageUrl('/assets/hero.jpg', 1080, 90, 'webp');`;
}
