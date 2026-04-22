import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container navbar-inner">
        <a [routerLink]="auth.currentUser()?.role === 'pracownik' ? '/employee' : '/'" class="brand" (click)="isMenuOpen.set(false)">
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
            @if (auth.currentUser()?.role !== 'pracownik') {
              <a routerLink="/products" routerLinkActive="active" (click)="isMenuOpen.set(false)">Produkty</a>
            }
            
            @if (auth.currentUser()?.role !== 'pracownik') {
              <a routerLink="/cart" class="cart-link" (click)="isMenuOpen.set(false)">
                <div class="cart-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-icon">
                    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  @if (cartService.cart().totalItems > 0) {
                    <span class="badge">
                      {{ cartService.cart().totalItems }}
                    </span>
                  }
                </div>
              </a>
            }

            @if (auth.isLoggedIn()) {
              @if (auth.currentUser()?.role === 'pracownik' || auth.currentUser()?.role === 'admin') {
                <a routerLink="/employee" routerLinkActive="active" (click)="isMenuOpen.set(false)">Panel Pracownika</a>
              }
              <a [routerLink]="auth.currentUser()?.role === 'pracownik' ? '/account/profile' : '/account/orders'" routerLinkActive="active" (click)="isMenuOpen.set(false)">
                {{ auth.currentUser()?.role === 'pracownik' ? 'Zmień hasło' : 'Moje konto' }}
              </a>
              <button class="btn btn-secondary btn-sm" (click)="auth.logout(); isMenuOpen.set(false)">Wyloguj</button>
            } @else {
              <a routerLink="/auth/login" routerLinkActive="active" (click)="isMenuOpen.set(false)">Logowanie</a>
              <a routerLink="/auth/register" class="btn btn-primary btn-sm btn-register" (click)="isMenuOpen.set(false)">Rejestracja</a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,

})
export class NavbarComponent {
  auth = inject(AuthService);
  cartService = inject(CartService);
  isMenuOpen = signal(false);
}
