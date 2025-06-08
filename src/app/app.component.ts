import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminComponent],
  template: `
    <div class="app-container">
      <nav class="nav-menu">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Appointment Form</a>
        <a routerLink="/admin" routerLinkActive="active">Admin Dashboard</a> 
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .nav-menu {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      display: flex;
      gap: 1rem;
    }

    .nav-menu a {
      text-decoration: none;
      color: #333;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .nav-menu a:hover {
      background-color: #e9ecef;
    }

    .nav-menu a.active {
      background-color: #007bff;
      color: white;
    }
  `]
})
export class AppComponent {
  title = 'Appointment Manager';
}

