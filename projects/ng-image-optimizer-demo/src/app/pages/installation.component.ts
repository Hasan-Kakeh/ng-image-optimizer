import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>Installation</h1>

    <h2>Prerequisites</h2>
    <ul>
      <li>Node.js (v18+)</li>
      <li>Angular CLI</li>
      <li>Angular SSR</li>
    </ul>

    <h2>Quick Start</h2>
    <p>The fastest way to get started is using our automated schematic:</p>
    <app-code-block language="bash" code="ng add ng-image-optimizer"></app-code-block>

    <h2>Manual Setup</h2>
    <p>
      If you prefer to configure things manually, first install the library and its peer
      dependencies:
    </p>
    <app-code-block language="bash" code="npm install ng-image-optimizer sharp"></app-code-block>

    <h2>2. Verify Configuration</h2>
    <p>
      The schematic automatically configures the Angular Application and your Express server.
      However, you can verify it manually:
    </p>

    <h3>Application Configuration (<code>app.config.ts</code>)</h3>
    <p>
      Ensure the provider function is added to your app config to register the custom optimized
      image loader:
    </p>
    <app-code-block language="typescript" [code]="appConfigCode"></app-code-block>

    <h3>Server Middleware (<code>server.ts</code>)</h3>
    <p>
      The optimizer works as an Express middleware intercepting paths (defaulting to
      <code>/_ng/image</code>).
    </p>
    <app-code-block language="typescript" [code]="serverCode"></app-code-block>
  `,
  styles: [
    `
      ul {
        margin-bottom: 24px;
        padding-left: 20px;
        color: var(--text-secondary);
      }
      li {
        margin-bottom: 8px;
      }
    `,
  ],
})
export class InstallationComponent {
  appConfigCode = `import { ApplicationConfig } from '@angular/core';
import { provideImageOptimizerLoader } from 'ng-image-optimizer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideImageOptimizerLoader({
      routePrefix: '/_ng/image' // Optional, matches server configuration
    })
  ]
};`;

  serverCode = `import express from 'express';
import { imageOptimizerHandler } from 'ng-image-optimizer/server';

const app = express();

// Set up the optimizer middleware BEFORE Angular SSR handlers
app.get('/_ng/image', imageOptimizerHandler(browserDistFolder, {
  // Optional custom configuration overrides
  minimumCacheTTL: 60 * 60 * 24 // 24 hours
}));`;
}
