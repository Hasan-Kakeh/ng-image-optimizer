import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-cls-prevention',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>CLS Prevention</h1>
    <p>
      Cumulative Layout Shift (CLS) happens when the browser does not know an image's dimensions
      before it loads. <code>NgOptimizedImage</code> requires explicit sizing — and
      <code>ng-image-optimizer</code> preserves that contract through the loader chain.
    </p>

    <h2>Required: width and height</h2>
    <p>
      Always set <code>width</code> and <code>height</code> (or use <code>fill</code> inside a
      sized container). The directive uses them to set the intrinsic aspect ratio on the
      <code>&lt;img&gt;</code> before the optimized asset arrives.
    </p>
    <app-code-block language="html" [code]="sizedCode"></app-code-block>

    <h2>Fill mode</h2>
    <p>
      When aspect ratio is unknown, use <code>fill</code> and give the parent explicit dimensions
      plus <code>position: relative</code>.
    </p>
    <app-code-block language="html" [code]="fillCode"></app-code-block>

    <h2>How the loaders help</h2>
    <ul>
      <li>
        <strong>SSR:</strong> Sharp resizes to the requested width while preserving aspect ratio; the
        DOM dimensions you declare stay fixed.
      </li>
      <li>
        <strong>AOT:</strong> Each variant matches a width from the breakpoint matrix; Angular still
        uses your declared <code>width</code>/<code>height</code> for layout, not the file's pixel
        dimensions.
      </li>
    </ul>

    <h2>Placeholder mode</h2>
    <p>
      The <code>placeholder</code> attribute loads a tiny variant first. In SSR mode the server
      caps placeholder quality; in AOT mode the loader requests a small width (≤ 64px) for the
      placeholder URL.
    </p>
    <app-code-block language="html" [code]="placeholderCode"></app-code-block>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class ClsPreventionComponent {
  sizedCode = `<img ngSrc="/product.jpg" width="400" height="400" alt="Product" />`;

  fillCode = `<div style="width: 100%; height: 240px; position: relative;">
  <img ngSrc="/card.jpg" fill alt="Card" style="object-fit: cover;" />
</div>`;

  placeholderCode = `<img
  ngSrc="/hero.jpg"
  width="1200"
  height="630"
  placeholder
  alt="Hero"
/>`;
}
