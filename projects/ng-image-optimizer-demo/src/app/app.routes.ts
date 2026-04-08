import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/getting-started.component').then((m) => m.GettingStartedComponent),
  },
  {
    path: 'introduction',
    loadComponent: () =>
      import('./pages/getting-started.component').then((m) => m.GettingStartedComponent),
  },
  {
    path: 'installation',
    loadComponent: () =>
      import('./pages/installation.component').then((m) => m.InstallationComponent),
  },
  {
    path: 'configuration',
    loadComponent: () =>
      import('./pages/configuration.component').then((m) => m.ConfigurationComponent),
  },
  {
    path: 'examples',
    loadComponent: () => import('./pages/examples.component').then((m) => m.ExamplesComponent),
  },
  { path: '**', redirectTo: 'introduction' },
];
