import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { UiService } from '../../../core/services/ui.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="product-card"
      [class.list-mode]="viewMode === 'list'"
      [routerLink]="['/products', product.id]"
    >
      <div class="image-wrapper">
        <img
          [src]="product.mainImageUrl || 'assets/placeholder.png'"
          [alt]="product.name"
          loading="lazy"
        >
      </div>

      <div class="card-body">
        <div class="card-top">
          <span class="category-tag">{{ product.categoryName }}</span>
          <h3 class="product-name">{{ product.name }}</h3>

          <div class="rating-row">
            <div class="stars">
              <span
                *ngFor="let s of [1,2,3,4,5]"
                class="star"
                [class.filled]="s <= product.averageRating"
                [class.half]="s - 0.5 <= product.averageRating && s > product.averageRating"
              >★</span>
            </div>
            <span class="rating-num">{{ product.averageRating | number:'1.1-1' }}</span>
            <span class="review-count">({{ product.reviewCount }})</span>
          </div>
        </div>

        <div class="card-bottom">
          <div class="price-block">
            <span class="price">{{ product.price | currency:'PLN':'symbol':'1.2-2' }}</span>
          </div>

          <div class="action-group">
            <button
              class="btn-wishlist"
              [class.active]="isInWishlist"
              (click)="toggleWishlist($event)"
              [title]="isInWishlist ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            <button
              class="btn-cart"
              (click)="addToCart($event)"
              title="Dodaj do koszyka"
              type="button"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
              </svg>
              <span class="cart-label" *ngIf="viewMode === 'list'">Do koszyka</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  private cartService = inject(CartService);
  private ui = inject(UiService);
  private wishlistService = inject(WishlistService);
  private auth = inject(AuthService);

  @Input() product!: Product;
  @Input() isInWishlist: boolean = false;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Output() wishlistChanged = new EventEmitter<number>();

  addToCart(event: Event) {
    event.stopPropagation();
    if (!this.product.defaultVariantId) {
      this.ui.showToast('Ten produkt nie może zostać dodany do koszyka z poziomu listy.', 'error');
      return;
    }
    const cartItem: CartItem = {
      productId: this.product.id,
      variantId: this.product.defaultVariantId,
      productName: this.product.name,
      sku: '',
      mainImageUrl: this.product.mainImageUrl,
      price: this.product.price,
      quantity: 1,
      subtotal: this.product.price,
      attributes: {},
      stockQuantity: this.product.totalStock || 1
    };
    this.cartService.addToCart(cartItem).subscribe(() => {
      this.ui.showToast('Dodano do koszyka!');
    });
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    if (!this.auth.isLoggedIn()) {
      this.ui.showToast('Zaloguj się, aby dodać do ulubionych', 'error');
      return;
    }
    const originalState = this.isInWishlist;
    this.isInWishlist = !this.isInWishlist;
    if (originalState) {
      this.wishlistChanged.emit(this.product.id);
      this.wishlistService.removeFromWishlist(this.product.id).subscribe({
        next: () => { this.ui.showToast('Usunięto z ulubionych'); },
        error: () => {
          this.isInWishlist = originalState;
          this.ui.showToast('Wystąpił błąd podczas usuwania', 'error');
        }
      });
    } else {
      this.wishlistService.addToWishlist(this.product.id).subscribe({
        next: () => { this.ui.showToast('Dodano do ulubionych!'); },
        error: () => {
          this.isInWishlist = originalState;
          this.ui.showToast('Wystąpił błąd podczas dodawania', 'error');
        }
      });
    }
  }
}

