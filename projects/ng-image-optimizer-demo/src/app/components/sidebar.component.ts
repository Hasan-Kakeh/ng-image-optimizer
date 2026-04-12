import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  PLATFORM_ID,
  REQUEST,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.collapsed]': 'isCollapsed()',
  },
  template: `
    <button class="sidebar-toggle" (click)="toggle()" aria-label="Toggle Sidebar">
      <span class="chevron"></span>
    </button>
    <nav class="sidebar">
      <div class="sidebar-group">
        <h4 class="sidebar-title">Getting Started</h4>
        <ul class="sidebar-links">
          <li>
            <a routerLink="/introduction" routerLinkActive="active" class="sidebar-link"
              >Introduction</a
            >
          </li>
          <li>
            <a routerLink="/installation" routerLinkActive="active" class="sidebar-link"
              >Installation</a
            >
          </li>
          <li>
            <a routerLink="/configuration" routerLinkActive="active" class="sidebar-link"
              >Configuration</a
            >
          </li>
        </ul>
      </div>

      <div class="sidebar-group">
        <h4 class="sidebar-title">Usage & Guides</h4>
        <ul class="sidebar-links">
          <li>
            <a routerLink="/examples" routerLinkActive="active" class="sidebar-link">Examples</a>
          </li>
        </ul>
      </div>
      <div class="sidebar-footer">
        Developed with <span class="heart">♥</span> by
        <a href="https://www.linkedin.com/in/hasan-kakeh/" target="_blank">Hasan Kakeh</a>
      </div>
    </nav>
  `,
  styles: [
    `
      .sidebar {
        padding: 0 24px;
        display: flex;
        flex-direction: column;
        gap: 32px;
        height: 100%;
        transition: padding var(--transition-normal);
        overflow-x: hidden;
      }

      .sidebar-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 12px;
        white-space: nowrap;
        transition: opacity var(--transition-fast);
      }

      .sidebar-links {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .sidebar-link {
        color: var(--text-secondary);
        font-size: 0.875rem;
        display: block;
        padding: 6px 12px;
        margin-left: -12px;
        border-radius: var(--radius-sm);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all var(--transition-fast);
      }
      @media (max-width: 768px) {
        :host.collapsed .sidebar-link {
          opacity: 0;
          pointer-events: none;
        }
        :host.collapsed .sidebar-title {
          opacity: 0;
          pointer-events: none;
        }
        :host.collapsed .sidebar {
          padding: 0 12px;
        }
        :host.collapsed .sidebar-footer {
          opacity: 0;
          pointer-events: none;
        }
        :host.collapsed .chevron {
          transform: rotate(-135deg);
          margin-left: -2px;
        }
      }
      .sidebar-link:hover {
        color: var(--text-primary);
        background-color: var(--bg-tertiary);
      }
      .sidebar-link.active {
        color: var(--accent-secondary);
        background-color: var(--accent-glow);
        font-weight: 500;
      }
      .sidebar-footer {
        margin-top: auto;
        font-size: 0.75rem;
        color: var(--text-secondary);
        text-align: left;
        padding-top: 16px;
        white-space: nowrap;
        transition: opacity var(--transition-fast);
      }

      .sidebar-footer .heart {
        color: #ff4b4b;
      }
      .sidebar-footer strong {
        color: var(--text-primary);
      }

      /* Toggle Button */
      .sidebar-toggle {
        position: absolute;
        right: 12px;
        top: 24px;
        width: 24px;
        height: 24px;
        background-color: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-primary);
        z-index: 10;
        transition: all var(--transition-normal);
        @media (min-width: 768px) {
          display: none;
        }
      }
      .sidebar-toggle:hover {
        background-color: var(--accent-secondary);
        border-color: var(--accent-secondary);
      }
      .chevron {
        width: 6px;
        height: 6px;
        border-left: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        transform: rotate(45deg);
        margin-left: 2px;
        transition: transform var(--transition-normal);
      }
    `,
  ],
})
export class SidebarComponent {
  private platformId = inject(PLATFORM_ID);
  private request = inject(REQUEST, { optional: true }); // Inject the SSR request
  // Detect mobile on both server (via User-Agent) and browser (via window width)
  private getInitialMobileState(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth < 768;
    }

    if (isPlatformServer(this.platformId) && this.request) {
      const userAgent = this.request.headers.get('user-agent') || '';
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    }

    return false;
  }
  isMobile = this.getInitialMobileState();
  readonly isCollapsed = signal(true);

  toggle() {
    this.isCollapsed.update((v) => !v);
  }
}
