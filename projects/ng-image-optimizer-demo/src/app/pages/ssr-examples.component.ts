import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-ssr-examples',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>SSR / Dynamic — Examples</h1>
    <p>Common <code>NgOptimizedImage</code> patterns with the dynamic loader.</p>

    <h2>Basic local image</h2>
    <app-code-block language="html" [code]="basicCode"></app-code-block>

    <h2>Fill layout</h2>
    <p>The parent must have <code>position: relative</code> (or fixed/absolute).</p>
    <app-code-block language="html" [code]="fillCode"></app-code-block>

    <h2>Priority (LCP)</h2>
    <app-code-block language="html" [code]="priorityCode"></app-code-block>

    <h2>Custom quality</h2>
    <app-code-block language="html" [code]="qualityCode"></app-code-block>

    <h2>Responsive <code>sizes</code></h2>
    <app-code-block language="html" [code]="sizesCode"></app-code-block>

    <h2>Blur placeholder</h2>
    <app-code-block language="html" [code]="placeholderCode"></app-code-block>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class SsrExamplesComponent {
  basicCode = `<img ngSrc="/hero.jpg" width="1200" height="600" alt="Hero" />`;

  fillCode = `<div style="height: 300px; position: relative;">
  <img ngSrc="/background.jpg" fill style="object-fit: cover;" alt="Background" />
</div>`;

  priorityCode = `<img ngSrc="/logo.png" width="200" height="50" priority alt="Logo" />`;

  qualityCode = `<img
  ngSrc="/photo.jpg"
  width="800"
  height="400"
  [loaderParams]="{ quality: 80 }"
  alt="Custom quality"
/>`;

  sizesCode = `<img
  ngSrc="/responsive.jpg"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Responsive"
/>`;

  placeholderCode = `<img
  ngSrc="/nature.jpg"
  width="800"
  height="600"
  placeholder
  alt="With placeholder"
/>`;
}
