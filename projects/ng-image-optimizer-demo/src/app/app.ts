import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <div class="app-main-wrapper">
        <app-sidebar class="sidebar-container"></app-sidebar>
        <main class="content-container">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class App {}
