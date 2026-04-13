import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="page container">
      <div class="account-layout">
        <aside class="account-nav">
          <h3 style="margin-bottom: 20px; font-size: 16px; padding: 0 14px;">Cześć {{ profileData().name.split(' ')[0] }}</h3>
          <a routerLink="/account/orders" routerLinkActive="active">Zamówienia</a>
          <a routerLink="/account/returns" routerLinkActive="active">Zwroty</a>
          <a routerLink="/account/wishlist" routerLinkActive="active">Obserwowane</a>
          <a routerLink="/account/reviews" routerLinkActive="active">Opinie</a>
          <a routerLink="/account/addresses" routerLinkActive="active">Dane dostawy</a>
          <a routerLink="/account/profile" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Ustawienia konta</a>
        </aside>

        <main>
          <div class="page-header">
            <h2 class="page-title">Moje zwroty</h2>
            <p class="page-subtitle">Zarządzaj zwrotami i reklamacjami swoich zamówień.</p>
          </div>
          <div class="empty-state">
            <div class="icon">🔄</div>
            <h3>Brak aktywnych zwrotów</h3>
            <p>Nie masz żadnych rozpoczętych procesów zwrotu.</p>
          </div>
        </main>
      </div>
    </div>
  `
})
export class ReturnsComponent {
  private authService = inject(AuthService);
  profileData = signal({
    name: this.authService.currentUser()?.name || ''
  });
}
