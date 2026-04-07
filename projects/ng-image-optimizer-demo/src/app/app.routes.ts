import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'docs/introduction', pathMatch: 'full' },
  { path: 'docs/introduction', loadComponent: () => import('./pages/getting-started.component').then(m => m.GettingStartedComponent) },
  { path: 'docs/installation', loadComponent: () => import('./pages/installation.component').then(m => m.InstallationComponent) },
  { path: 'docs/configuration', loadComponent: () => import('./pages/configuration.component').then(m => m.ConfigurationComponent) },
  { path: 'docs/examples', loadComponent: () => import('./pages/examples.component').then(m => m.ExamplesComponent) },
  { path: '**', redirectTo: 'docs/introduction' }
];
