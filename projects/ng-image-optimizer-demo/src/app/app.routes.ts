import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent: () =>
      import('./pages/getting-started.component').then((m) => m.GettingStartedComponent),
  },
  {
    path: 'introduction',
    loadComponent: () =>
      import('./pages/getting-started.component').then((m) => m.GettingStartedComponent),
  },
  {
    path: 'which-mode',
    loadComponent: () =>
      import('./pages/which-mode.component').then((m) => m.WhichModeComponent),
  },
  {
    path: 'installation',
    loadComponent: () =>
      import('./pages/installation.component').then((m) => m.InstallationComponent),
  },
  {
    path: 'ssr/setup',
    loadComponent: () =>
      import('./pages/ssr-setup.component').then((m) => m.SsrSetupComponent),
  },
  {
    path: 'ssr/configuration',
    loadComponent: () =>
      import('./pages/ssr-configuration.component').then((m) => m.SsrConfigurationComponent),
  },
  {
    path: 'ssr/remote-images',
    loadComponent: () =>
      import('./pages/ssr-remote-images.component').then((m) => m.SsrRemoteImagesComponent),
  },
  {
    path: 'ssr/examples',
    loadComponent: () =>
      import('./pages/ssr-examples.component').then((m) => m.SsrExamplesComponent),
  },
  {
    path: 'aot/setup',
    loadComponent: () => import('./pages/aot-setup.component').then((m) => m.AotSetupComponent),
  },
  {
    path: 'aot/cli',
    loadComponent: () => import('./pages/aot-cli.component').then((m) => m.AotCliComponent),
  },
  {
    path: 'aot/naming',
    loadComponent: () => import('./pages/aot-naming.component').then((m) => m.AotNamingComponent),
  },
  {
    path: 'aot/examples',
    loadComponent: () =>
      import('./pages/aot-examples.component').then((m) => m.AotExamplesComponent),
  },
  {
    path: 'reference/breakpoints',
    loadComponent: () =>
      import('./pages/breakpoint-matrix.component').then((m) => m.BreakpointMatrixComponent),
  },
  {
    path: 'reference/cls',
    loadComponent: () =>
      import('./pages/cls-prevention.component').then((m) => m.ClsPreventionComponent),
  },
  // Legacy v0 routes
  { path: 'configuration', redirectTo: 'ssr/configuration' },
  { path: 'examples', redirectTo: 'ssr/examples' },
  { path: '**', redirectTo: 'introduction' },
];
