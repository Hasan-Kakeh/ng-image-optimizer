import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>Examples</h1>
    <p>Here are some common use cases for using the <code>NgOptimizedImage</code> directive with <code>ng-image-optimizer</code>.</p>

    <h2>Basic Usage</h2>
    <p>Provide <code>width</code> and <code>height</code> to prevent cumulative layout shift (CLS). The optimizer will automatically scale the image to these dimensions while preserving aspect ratio.</p>
    <app-code-block language="html" [code]="basicCode"></app-code-block>

    <h2>Fill Mode</h2>
    <p>When you don't know the exact dimensions beforehand (e.g., responsive grids or hero sections), use the <code>fill</code> attribute. The parent container <strong>must</strong> have <code>position: relative</code>, <code>position: fixed</code>, or <code>position: absolute</code>.</p>
    <app-code-block language="html" [code]="fillCode"></app-code-block>

    <h2>Priority Loading</h2>
    <p>For Above the Fold (LCP) images, always add the <code>priority</code> attribute. This ensures the optimizer processes the image synchronously if necessary or queues it first, and Angular adds <code>fetchpriority="high"</code> to the DOM.</p>
    <app-code-block language="html" [code]="priorityCode"></app-code-block>

    <h2>Custom Quality</h2>
    <p>Adjust the compression quality (1-100) via <code>loaderParams</code> to override the server's default quality settings for a specific image.</p>
    <app-code-block language="html" [code]="qualityCode"></app-code-block>
    
    <h2>Responsive Sizes</h2>
    <p>Use the <code>sizes</code> attribute to generate responsive <code>srcset</code> values. The optimizer integrates with the server config's <code>deviceSizes</code> and <code>imageSizes</code>.</p>
    <app-code-block language="html" [code]="sizesCode"></app-code-block>
    
    <h2>Blur Placeholder</h2>
    <p>Use the <code>placeholder</code> attribute to display a small, heavily blurred version of the image while the full-resolution image is loading. The server will automatically generate a highly compressed base64 string for this inline placeholder.</p>
    <app-code-block language="html" [code]="placeholderCode"></app-code-block>
  `,
  styles: [`
    h2 {
      margin-top: 2rem;
    }
  `]
})
export class ExamplesComponent {
  basicCode = `<img [ngSrc]="'hero.webp'" width="1200" height="600" alt="Hero image" />`;
  
  fillCode = `<div style="height: 300px; position: relative;">
  <img [ngSrc]="'background.avif'" fill style="object-fit: cover;" alt="Background" />
</div>`;

  priorityCode = `<img [ngSrc]="'logo.png'" width="200" height="50" priority alt="Brand logo" />`;
  
  qualityCode = `<img 
  [ngSrc]="'photo.jpg'" 
  width="800" 
  height="400" 
  [loaderParams]="{ quality: 80 }" 
  alt="Custom quality" 
/>`;

  sizesCode = `<img 
  [ngSrc]="'responsive.jpg'" 
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Responsive grid image" 
/>`;

  placeholderCode = `<img 
  [ngSrc]="'nature.webp'"
  width="800"
  height="600"
  placeholder
  alt="Placeholder example"
/>`;
}
