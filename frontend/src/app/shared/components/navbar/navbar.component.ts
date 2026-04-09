import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container navbar-inner">
        <a routerLink="/" class="brand" (click)="isMenuOpen.set(false)">
          <img src="favicon.ico" alt="TechPulse Logo" class="logo-img">
          TechPulse
        </a>

        <button class="burger" (click)="isMenuOpen.set(!isMenuOpen())" [class.open]="isMenuOpen()">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="nav-links-wrapper" [class.open]="isMenuOpen()">
          <div class="nav-links">
            @if (auth.isLoggedIn()) {
              <a routerLink="/account/orders" routerLinkActive="active" (click)="isMenuOpen.set(false)">Moje konto</a>
              <button class="btn btn-secondary btn-sm" (click)="auth.logout(); isMenuOpen.set(false)">Wyloguj</button>
            } @else {
              <a routerLink="/auth/login" routerLinkActive="active" (click)="isMenuOpen.set(false)">Logowanie</a>
              <a routerLink="/auth/register" class="btn btn-primary btn-sm" (click)="isMenuOpen.set(false)">Rejestracja</a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky; top: 0; z-index: 1000;
      background: rgba(26,26,46,0.9);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(20px);
      height: 70px;
      display: flex; align-items: center;
    }
    .navbar-inner { 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      width: 100%;
    }
    .brand { 
      font-size: 20px; 
      font-weight: 700; 
      color: var(--text); 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      text-decoration: none;
      z-index: 1001;
    }
    .logo-img { width: 32px; height: 32px; border-radius: 10px; object-fit: cover; }
    
    .nav-links { display: flex; align-items: center; gap: 12px; }
    .nav-links a { 
      color: var(--text-muted); 
      font-size: 14px; 
      font-weight: 500; 
      padding: 8px 16px; 
      border-radius: 8px; 
      transition: all 0.2s; 
      text-decoration: none;
    }
    .nav-links a:hover, .nav-links a.active { color: var(--text); background: var(--card-hover); }

    .burger {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 21px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 1001;
    }
    .burger span {
      width: 100%;
      height: 2px;
      background-color: var(--text);
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Burger Animation */
    .burger.open span:nth-child(1) { transform: translateY(9.5px) rotate(45deg); }
    .burger.open span:nth-child(2) { opacity: 0; }
    .burger.open span:nth-child(3) { transform: translateY(-9.5px) rotate(-45deg); }

    @media (max-width: 768px) {
      .burger { display: flex; }
      
      .nav-links-wrapper {
        position: fixed;
        top: 0;
        right: -100%;
        width: 80%;
        max-width: 300px;
        height: 100vh;
        background: var(--surface-2);
        box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        padding-top: 100px;
      }
      
      .nav-links-wrapper.open { right: 0; }
      
      .nav-links {
        flex-direction: column;
        align-items: stretch;
        padding: 20px;
        gap: 15px;
      }
      
      .nav-links a {
        font-size: 18px;
        padding: 12px 20px;
        width: 100%;
      }
      
      .btn { width: 100%; padding: 12px; font-size: 16px; }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  isMenuOpen = signal(false);
}
