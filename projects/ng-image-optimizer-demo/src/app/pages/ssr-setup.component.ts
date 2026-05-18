import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-ssr-setup',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>SSR / Dynamic — Setup</h1>
    <p>
      SSR mode routes every optimized image through Express middleware. The client loader builds
      query URLs; Sharp processes them on demand and caches the result.
    </p>

    <h2>1. Application provider</h2>
    <p>Register the dynamic loader in <code>app.config.ts</code>:</p>
    <app-code-block language="typescript" [code]="appConfigCode"></app-code-block>

    <h2>2. Server middleware</h2>
    <p>
      Mount <code>imageOptimizerHandler</code> on your Express app
      <strong>before</strong> the Angular SSR handler and static file middleware:
    </p>
    <app-code-block language="typescript" [code]="serverCode"></app-code-block>

    <h2>Request flow</h2>
    <ol>
      <li><code>NgOptimizedImage</code> calls the loader with <code>src</code>, <code>width</code>, and quality.</li>
      <li>The loader returns <code>/_ng/image?url=…&amp;w=…&amp;q=…</code>.</li>
      <li>Middleware fetches the source, resizes with Sharp, converts format, and caches to disk.</li>
    </ol>

    <div class="callout">
      <strong>Route prefix</strong>
      The default prefix is <code>/_ng/image</code>. If you change it in
      <code>provideImageOptimizerLoader(&#123; routePrefix: '…' &#125;)</code>, use the same path in
      <code>app.use(…)</code> on the server.
    </div>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class SsrSetupComponent {
  appConfigCode = `import { ApplicationConfig } from '@angular/core';
import { provideImageOptimizerLoader } from 'ng-image-optimizer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideImageOptimizerLoader({
      routePrefix: '/_ng/image',
    }),
  ],
};`;

  serverCode = `import express from 'express';
import { join } from 'node:path';
import { imageOptimizerHandler } from 'ng-image-optimizer/server';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();

// Must be registered before static + SSR handlers
app.use('/_ng/image', imageOptimizerHandler(browserDistFolder, {}));`;
}
