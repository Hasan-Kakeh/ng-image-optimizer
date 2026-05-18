import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-aot-examples',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>AOT / Build — Examples</h1>
    <p>
      Templates are identical to SSR — only the provider and build pipeline differ. Reference
      <code>ngSrc</code> paths that exist in <code>public/</code> (copied to dist root).
    </p>

    <h2>Hero image</h2>
    <app-code-block language="html" [code]="heroCode"></app-code-block>
    <p>
      After <code>ng-image-optimizer-aot</code>, production requests resolve to files such as
      <code>/hero.1080q90.webp</code>.
    </p>

    <h2>Responsive grid</h2>
    <app-code-block language="html" [code]="gridCode"></app-code-block>

    <h2>AVIF at quality 80</h2>
    <p>Align provider and CLI:</p>
    <app-code-block language="typescript" [code]="avifProvider"></app-code-block>
    <app-code-block language="bash" [code]="avifCli"></app-code-block>

    <h2>GitHub Pages / static deploy</h2>
    <ol>
      <li><code>ng build</code></li>
      <li><code>npm run optimize:image</code></li>
      <li>Deploy the <code>browser</code> folder — no Node image server required</li>
    </ol>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class AotExamplesComponent {
  heroCode = `<img ngSrc="/desert.jpg" width="1920" height="1080" priority alt="Desert" />`;

  gridCode = `<img
  ngSrc="/gallery/photo.jpg"
  fill
  sizes="(max-width: 640px) 100vw, 50vw"
  alt="Gallery item"
/>`;

  avifProvider = `provideAotImageLoader({ format: 'avif', quality: 80 })`;

  avifCli = `ng-image-optimizer-aot --dist ./dist/app/browser --format avif --quality 80`;
}
