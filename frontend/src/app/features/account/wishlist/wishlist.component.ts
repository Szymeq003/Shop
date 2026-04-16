import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../products/product-card/product-card.component';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink, RouterLinkActive],
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
            <h2 class="page-title">Obserwowane produkty</h2>
            <p class="page-subtitle">Produkty, które zapisałeś na później.</p>
          </div>

          <div class="wishlist-grid" *ngIf="!isLoading()">
            <div *ngFor="let product of wishlist()">
              <app-product-card 
                [product]="product" 
                [isInWishlist]="true"
                (wishlistChanged)="removeFromView($event)"
              ></app-product-card>
            </div>

            <div class="empty-state" *ngIf="wishlist().length === 0">
              <div class="icon">❤️</div>
              <h3>Twoja lista jest pusta</h3>
              <p>Nie masz jeszcze żadnych zaobserwowanych produktów. Dodaj produkty, które Cię interesują!</p>
            </div>
          </div>

          <div class="loading-state" *ngIf="isLoading()">
            <div class="spinner"></div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 32px;
    }

    .loading-state { display: flex; justify-content: center; padding: 40px; }
    .spinner {
      width: 40px; height: 40px; border: 3px solid rgba(var(--primary-rgb), 0.1);
      border-top-color: var(--primary); border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
    }
    
    .empty-state .icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    .empty-state h3 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .empty-state p {
      color: var(--text-muted);
      max-width: 400px;
      margin: 0 auto;
    }
  `]
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  
  wishlist = signal<Product[]>([]);
  isLoading = signal(true);
  profileData = signal({
    name: this.authService.currentUser()?.name || ''
  });

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.isLoading.set(true);
    this.wishlistService.getWishlist().subscribe({
      next: (data) => {
        this.wishlist.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  removeFromView(productId: number) {
    this.wishlist.update(list => list.filter(p => p.id !== productId));
  }
}
