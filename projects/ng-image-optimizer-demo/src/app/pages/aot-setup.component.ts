import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-aot-setup',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>AOT / Build — Setup</h1>
    <p>
      AOT mode pre-generates optimized variants at build time. At runtime the loader resolves
      directly to static files — no Sharp, no middleware.
    </p>

    <h2>1. Application provider</h2>
    <app-code-block language="typescript" [code]="appConfigCode"></app-code-block>
    <p>
      In development (<code>isDevMode()</code>), the loader returns the original <code>src</code> so
      you can work without running the CLI on every save.
    </p>

    <h2>2. Postbuild CLI</h2>
    <p>Run after <code>ng build</code> so variants exist in the dist folder:</p>
    <app-code-block language="bash" [code]="cliCode"></app-code-block>

    <h2>3. Wire into package.json</h2>
    <p>The <code>ng add --mode=AOT</code> schematic adds an <code>optimize:image</code> script. A typical production pipeline:</p>
    <app-code-block language="json" [code]="scriptsCode"></app-code-block>

    <div class="callout">
      <strong>Match options</strong>
      <code>format</code> and <code>quality</code> in <code>provideAotImageLoader</code> must match
      the CLI <code>--format</code> and <code>--quality</code> flags, or URLs will 404.
    </div>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class AotSetupComponent {
  appConfigCode = `import { ApplicationConfig } from '@angular/core';
import { provideAotImageLoader } from 'ng-image-optimizer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAotImageLoader({
      format: 'webp',
      quality: 90,
    }),
  ],
};`;

  cliCode = `ng-image-optimizer-aot \\
  --dist ./dist/my-app/browser \\
  --paths "assets/**" \\
  --format webp \\
  --quality 90`;

  scriptsCode = `{
  "scripts": {
    "build": "ng build",
    "build:prod": "ng build && npm run optimize:image",
    "optimize:image": "ng-image-optimizer-aot --dist dist/my-app/browser"
  }
}`;
}
