import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container navbar-inner">
        <a routerLink="/" class="brand">🛍️ Sklep</a>
        @if (auth.isLoggedIn()) {
          <div class="nav-links">
            <a routerLink="/account/profile" routerLinkActive="active">Moje konto</a>
            <a routerLink="/account/addresses" routerLinkActive="active">Adresy</a>
            <a routerLink="/account/orders" routerLinkActive="active">Zamówienia</a>
            <button class="btn btn-secondary btn-sm" (click)="auth.logout()">Wyloguj</button>
          </div>
        } @else {
          <div class="nav-links">
            <a routerLink="/auth/login" routerLinkActive="active">Logowanie</a>
            <a routerLink="/auth/register" class="btn btn-primary btn-sm">Rejestracja</a>
          </div>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky; top: 0; z-index: 100;
      background: rgba(26,26,46,0.9);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(20px);
      height: 70px;
      display: flex; align-items: center;
    }
    .navbar-inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
    .brand { font-size: 20px; font-weight: 700; color: var(--text); margin-right: auto; }
    .nav-links { display: flex; align-items: center; gap: 12px; }
    .nav-links a { color: var(--text-muted); font-size: 14px; font-weight: 500; padding: 8px 16px; border-radius: 8px; transition: all 0.2s; }
    .nav-links a:hover, .nav-links a.active { color: var(--text); background: var(--card-hover); }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
}
