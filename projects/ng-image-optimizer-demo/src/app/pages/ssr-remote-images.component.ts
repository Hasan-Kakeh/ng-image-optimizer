import { Component } from '@angular/core';
import { CodeBlockComponent } from '../components/code-block.component';
import { DOC_PAGE_STYLES } from './doc-page.styles';

@Component({
  selector: 'app-ssr-remote-images',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <h1>SSR / Dynamic — Remote Images</h1>
    <p>
      By default the middleware only serves images found under your
      <code>browserDistFolder</code>. To optimize external URLs, declare an explicit allowlist via
      <code>remotePatterns</code> — this prevents your server from becoming an open proxy.
    </p>

    <h2>Server configuration</h2>
    <app-code-block language="typescript" [code]="serverCode"></app-code-block>

    <h2>Template usage</h2>
    <p>
      Pass the full HTTPS URL as <code>ngSrc</code>. The loader encodes it into the optimizer query
      string; the server fetches and processes it if the host matches a pattern.
    </p>
    <app-code-block language="html" [code]="templateCode"></app-code-block>

    <div class="callout">
      <strong>Security</strong>
      Restrict <code>hostname</code> and <code>pathname</code> as narrowly as possible. Wildcards
      on hostname are supported but increase risk — prefer exact hostnames in production.
    </div>
  `,
  styles: [DOC_PAGE_STYLES],
})
export class SsrRemoteImagesComponent {
  serverCode = `app.use('/_ng/image', imageOptimizerHandler(browserDistFolder, {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.example.com',
      pathname: '/assets/**',
    },
  ],
}));`;

  templateCode = `<img
  ngSrc="https://cdn.example.com/assets/photo.jpg"
  width="1200"
  height="800"
  alt="CDN photo"
/>`;
}
