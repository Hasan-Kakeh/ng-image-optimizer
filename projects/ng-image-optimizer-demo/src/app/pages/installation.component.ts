import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [CodeBlockComponent, RouterLink],
  template: `
    <h1>Installation</h1>

    <h2>Prerequisites</h2>
    <ul>
      <li>Node.js 18+</li>
      <li>Angular 18+ with <code>NgOptimizedImage</code></li>
      <li>
        <strong>SSR mode:</strong> Angular SSR with an Express server entry (<code>server.ts</code>)
      </li>
      <li>
        <strong>AOT mode:</strong> A production build pipeline (no runtime server required for images)
      </li>
    </ul>

    <h2>Quick start (schematic)</h2>
    <p>
      The fastest path is <code>ng add</code>, which installs dependencies and wires the correct
      provider for your chosen mode:
    </p>
    <app-code-block
      language="bash"
      code="ng add ng-image-optimizer --mode=SSR"
    ></app-code-block>
    <app-code-block
      language="bash"
      code="ng add ng-image-optimizer --mode=AOT"
    ></app-code-block>

    <h2>Manual install</h2>
    <app-code-block language="bash" code="npm install ng-image-optimizer sharp"></app-code-block>
    <p>
      <code>sharp</code> is required for SSR middleware and for the AOT CLI. It is listed as an
      optional dependency but should be installed explicitly in your app.
    </p>

    <h2>After install</h2>
    <p>Complete mode-specific setup — only one path applies to your app:</p>
    <ul>
      <li><strong>SSR:</strong> <code>provideImageOptimizerLoader</code> + <code>imageOptimizerHandler</code> — see <a routerLink="/ssr/setup" class="text-link">SSR Setup</a></li>
      <li><strong>AOT:</strong> <code>provideAotImageLoader</code> + <code>ng-image-optimizer-aot</code> postbuild — see <a routerLink="/aot/setup" class="text-link">AOT Setup</a></li>
    </ul>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class InstallationComponent {}
