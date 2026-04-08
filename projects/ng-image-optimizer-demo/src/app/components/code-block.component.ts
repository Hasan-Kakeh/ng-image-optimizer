import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-code-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="language">{{ language() }}</span>
        <button
          aria-label="copy"
          title="copy"
          class="copy-button"
          (click)="copyToClipboard()"
          [class.copied]="copied()"
        >
          @if (copied()) {
            <span>Copied!</span>
          } @else {
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          }
        </button>
      </div>
      <div class="code-block-content">
        <pre><code>{{ code() }}</code></pre>
      </div>
    </div>
  `,
  styles: [
    `
      .language {
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.05em;
      }
      .copy-button {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: inherit;
        font-size: 0.75rem;
        transition: color var(--transition-fast);
        padding: 4px 8px;
        border-radius: var(--radius-sm);
      }
      .copy-button:hover {
        color: var(--text-primary);
        background-color: var(--bg-tertiary);
      }
      .copy-button.copied {
        color: #10b981; /* Success green */
      }
      pre {
        color: #c9d1d9; /* Default code color */
      }
    `,
  ],
})
export class CodeBlockComponent {
  code = input.required<string>();
  language = input<string>('typescript');

  copied = signal(false);

  copyToClipboard() {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
