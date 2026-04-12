import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top-nav">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <img src="angular-logo.webp" alt="angular" width="42" height="42" />
          <span class="logo-text">Ng Image Optimizer</span>
        </a>
        <nav class="nav-links">
          <a
            href="https://www.npmjs.com/package/ng-image-optimizer"
            target="_blank"
            class="nav-link"
            title="npm"
            ><svg
              width="48"
              height="48"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 10V20H9V22H16V20H32V10H0Z" fill="#CB3837" />
              <path
                d="M5.46205 12H2V18H5.46205V13.6111H7.22344V18H8.98482V12H5.46205ZM10.7462 12V20H14.269V18H17.731V12H10.7462ZM15.9696 16.3889H14.269V13.6111H15.9696V16.3889ZM22.9545 12H19.4924V18H22.9545V13.6111H24.7158V18H26.4772V13.6111H28.2386V18H30V12H22.9545Z"
                fill="white"
              />
            </svg>
          </a>
          <a
            href="https://github.com/Hasan-Kakeh/ng-image-optimizer"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-link"
            title="github"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              class="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
              />
            </svg>
          </a>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .top-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--header-height);
        background-color: var(--bg-glass);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border-light);
        z-index: 50;
        display: flex;
        align-items: center;
      }
      .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 24px;
      }
      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .logo-text {
        font-weight: 600;
        font-size: 1.5rem;
        color: var(--accent-primary);
        @media (max-width: 768px) {
          font-size: 1rem;
        }
      }
      .nav-links {
        display: flex;
        gap: 24px;
        align-items: center;
      }
      .nav-link {
        font-size: 0.875rem;
        color: var(--text-secondary);
        font-weight: 500;
      }
      .nav-link:hover,
      .nav-link.active {
        color: var(--text-primary);
      }
    `,
  ],
})
export class HeaderComponent {}
