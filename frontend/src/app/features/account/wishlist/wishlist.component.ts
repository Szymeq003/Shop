import { Component } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  template: `
    <div class="page-header">
      <h2 class="page-title">Obserwowane produkty</h2>
      <p class="page-subtitle">Lista produktów, które zapisałeś na później.</p>
    </div>
    <div class="empty-state">
      <div class="icon">❤️</div>
      <h3>Twoja lista jest pusta</h3>
      <p>Nie masz jeszcze żadnych zaobserwowanych produktów.</p>
    </div>
  `
})
export class WishlistComponent {}
