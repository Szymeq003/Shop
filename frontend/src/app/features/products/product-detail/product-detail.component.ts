import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ProductDetail, ProductVariant } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { UiService } from '../../../core/services/ui.service';
import { ReviewService } from '../../../core/services/review.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule, StarRatingComponent],
  template: `
    <div class="product-detail-page container" *ngIf="product()">
      <nav class="breadcrumb">
        <a routerLink="/products">Produkty</a>
        <span class="separator">/</span>
        <span>{{ product()?.categoryName }}</span>
        <span class="separator">/</span>
        <span class="current">{{ product()?.name }}</span>
      </nav>

      <div class="main-layout">
        <div class="gallery-section">
          <div class="main-image">
            <button 
              class="nav-btn prev" 
              *ngIf="getAllImages().length > 1" 
              (click)="prevImage()"
              title="Poprzednie zdjęcie"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            <img *ngIf="selectedImage() || product()?.mainImageUrl || (product()?.imageUrls?.length ? product()!.imageUrls[0] : null)" 
                 [src]="selectedImage() || product()?.mainImageUrl || product()!.imageUrls[0]" 
                 [alt]="product()?.name">

            <button 
              class="nav-btn next" 
              *ngIf="getAllImages().length > 1" 
              (click)="nextImage()"
              title="Następne zdjęcie"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div class="thumbnails" *ngIf="product()?.imageUrls && product()!.imageUrls.length > 1">
            <div 
              class="thumb" 
              *ngFor="let img of product()?.imageUrls" 
              (click)="selectedImage.set(img)"
              [class.active]="selectedImage() === img"
            >
              <img [src]="img" alt="Thumbnail">
            </div>
          </div>
        </div>

        <div class="info-section">
          <h1 class="product-name">{{ product()?.name }}</h1>

          <div class="variants-section" *ngIf="product()?.variants?.length">
            <h3>Wybierz wariant</h3>
            <div class="variants-grid">
              <div 
                class="variant-card" 
                *ngFor="let variant of product()?.variants"
                [class.active]="selectedVariant()?.id === variant.id"
                (click)="selectedVariant.set(variant)"
              >
                <div class="variant-info">
                  <span class="variant-name">{{ getShortVariantName(variant) }}</span>
                </div>
                <div class="variant-price" *ngIf="variant.price">
                  {{ variant.price | currency:'PLN':'symbol':'1.2-2' }}
                </div>
              </div>
            </div>
          </div>

          <div class="price-box">
            <div class="price-row">
              <div class="price">
                {{ (selectedVariant()?.price || product()?.price) | currency:'PLN':'symbol':'1.2-2' }}
              </div>
            </div>
            <div class="availability" [ngClass]="getAvailabilityClass()">
              <span class="dot"></span> 
              {{ getAvailabilityText() }}
              <span class="stock-count" *ngIf="selectedVariant()">({{ selectedVariant()?.stockQuantity }} szt.)</span>
            </div>
          </div>

          <div class="actions">
            <div class="quantity-input">
              <button (click)="changeQuantity(-1)">-</button>
              <input type="number" [(ngModel)]="quantity" readonly>
              <button (click)="changeQuantity(1)">+</button>
            </div>
            <button 
              class="btn btn-primary btn-lg btn-add" 
              (click)="addToCart()"
              [disabled]="isOutOfStock()"
            >
              Dodaj do koszyka
            </button>
            <button 
              class="wishlist-btn" 
              [class.in-wishlist]="isInWishlist()" 
              (click)="toggleWishlist()"
              [title]="isInWishlist() ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="heart-icon">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <div class="short-description">
            <h3>Opis produktu</h3>
            <p>{{ product()?.description }}</p>
          </div>
        </div>
      </div>

      <div class="detailed-info">
        <div class="tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'specs'"
            (click)="activeTab.set('specs')"
          >Specyfikacja</button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab() === 'reviews'"
            (click)="activeTab.set('reviews')"
          >Opinie ({{ product()?.reviewCount }})</button>
        </div>

        <div class="tab-content">
          <table class="specs-table" *ngIf="activeTab() === 'specs'">
            <tr *ngFor="let attr of getAttributes()">
              <td class="label">{{ attr.key }}</td>
              <td class="value">{{ attr.values.join(', ') }}</td>
            </tr>
          </table>

          <div class="reviews-content" *ngIf="activeTab() === 'reviews'">
            <div class="add-review-section" *ngIf="auth.isLoggedIn()">
              <h3>Dodaj swoją opinię</h3>
              <div class="review-form">
                <div class="rating-picker">
                  <span>Twoja ocena:</span>
                  <app-star-rating [rating]="newReviewRating" (ratingChange)="newReviewRating = $event"></app-star-rating>
                </div>
                <div class="textarea-wrapper">
                  <textarea 
                    [(ngModel)]="newReviewComment" 
                    placeholder="Napisz co sądzisz o produkcie..."
                    rows="4"
                  ></textarea>
                </div>
                <button 
                  class="btn btn-primary" 
                  (click)="submitReview()"
                  [disabled]="isSubmittingReview() || !newReviewRating"
                >
                  Opublikuj opinię
                </button>
              </div>
            </div>

            <div class="reviews-list">
              <div class="review-item" *ngFor="let review of product()?.reviews">
                <div class="review-header">
                  <span class="user-name">{{ review.userName }}</span>
                  <app-star-rating [rating]="review.rating" [readonly]="true"></app-star-rating>
                  <span class="date">{{ review.createdAt | date:'dd.MM.yyyy' }}</span>
                </div>
                <p class="comment">{{ review.comment }}</p>
              </div>
              <div class="empty-reviews" *ngIf="!product()?.reviews?.length">
                <p>Ten produkt nie posiada jeszcze żadnych opinii. Bądź pierwszy!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="isLoading()" class="loading-state container">
      <div class="spinner"></div>
    </div>
  `,

})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);
  private wishlistService = inject(WishlistService);
  public auth = inject(AuthService);
  private ui = inject(UiService);

  product = signal<ProductDetail | null>(null);
  isLoading = signal(true);
  selectedImage = signal<string | null>(null);
  selectedVariant = signal<ProductVariant | null>(null);
  activeTab = signal<'specs' | 'reviews'>('specs');
  isInWishlist = signal(false);
  quantity = 1;

  // Review form state
  newReviewRating = 0;
  newReviewComment = '';
  isSubmittingReview = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
      this.checkWishlist(+id);
    }
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(p => {
      this.product.set(p);
      this.isLoading.set(false);

      if (p.imageUrls && p.imageUrls.length > 0) {
        this.selectedImage.set(p.imageUrls[0]);
      } else if (p.mainImageUrl) {
        this.selectedImage.set(p.mainImageUrl);
      }

      if (p.variants && p.variants.length > 0 && !this.selectedVariant()) {
        this.selectedVariant.set(p.variants[0]);
      }
    });
  }

  checkWishlist(id: number) {
    if (this.auth.isLoggedIn()) {
      this.wishlistService.getWishlist().subscribe(list => {
        this.isInWishlist.set(list.some(item => item.id === id));
      });
    }
  }

  toggleWishlist() {
    if (!this.auth.isLoggedIn()) {
      this.ui.showToast('Zaloguj się, aby dodać do ulubionych', 'error');
      return;
    }

    const productId = this.product()?.id;
    if (!productId) return;

    const originalState = this.isInWishlist();
    this.isInWishlist.set(!originalState);

    if (originalState) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.ui.showToast('Usunięto z ulubionych');
        },
        error: () => {
          this.isInWishlist.set(originalState); // Revert
          this.ui.showToast('Wystąpił błąd podczas usuwania', 'error');
        }
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.ui.showToast('Dodano do ulubionych!');
        },
        error: () => {
          this.isInWishlist.set(originalState); // Revert
          this.ui.showToast('Wystąpił błąd podczas dodawania', 'error');
        }
      });
    }
  }

  submitReview() {
    if (!this.newReviewRating) return;
    
    const productId = this.product()?.id;
    if (!productId) return;

    this.isSubmittingReview.set(true);
    this.reviewService.addReview(productId, {
      rating: this.newReviewRating,
      comment: this.newReviewComment
    }).subscribe({
      next: () => {
        this.ui.showToast('Opinia została dodana!');
        this.loadProduct(productId); // Reload to show new review
        this.newReviewRating = 0;
        this.newReviewComment = '';
        this.isSubmittingReview.set(false);
      },
      error: (err) => {
        this.ui.showToast(err.error?.message || 'Wystąpił błąd podczas dodawania opinii', 'error');
        this.isSubmittingReview.set(false);
      }
    });
  }

  getAttributes() {
    const attrs = this.product()?.attributes || {};
    return Object.keys(attrs).map(key => ({ key, values: attrs[key] }));
  }

  getShortVariantName(variant: ProductVariant): string {
    const attrs = variant.attributeValues || {};
    const priority = ['Pamięć RAM', 'Pojemność dysku', 'Procesor', 'Kolor', 'Ekran'];
    const parts: string[] = [];
    
    for (const key of priority) {
      if (attrs[key]) {
        let val = attrs[key];
        // Clean up common long strings
        val = val.replace('Unified Memory', 'RAM')
                 .replace('8rdzeniowe CPU', '8-core')
                 .replace('8-rdzeniowe CPU', '8-core');
        parts.push(val);
      }
    }
    
    if (parts.length === 0) {
      const values = Object.values(attrs);
      return values.slice(0, 2).join(' / ');
    }
    
    return parts.join(' / ');
  }

  getAllImages(): string[] {
    const p = this.product();
    if (!p) return [];
    
    const images = [...(p.imageUrls || [])];
    if (p.mainImageUrl && !images.includes(p.mainImageUrl)) {
      images.unshift(p.mainImageUrl);
    }
    return images;
  }

  nextImage() {
    const images = this.getAllImages();
    if (images.length <= 1) return;
    
    const current = this.selectedImage() || images[0];
    const index = images.indexOf(current);
    const nextIndex = (index + 1) % images.length;
    this.selectedImage.set(images[nextIndex]);
  }

  prevImage() {
    const images = this.getAllImages();
    if (images.length <= 1) return;
    
    const current = this.selectedImage() || images[0];
    const index = images.indexOf(current);
    const prevIndex = (index - 1 + images.length) % images.length;
    this.selectedImage.set(images[prevIndex]);
  }

  isOutOfStock() {
    if (this.product()?.variants?.length) {
      return this.selectedVariant() ? this.selectedVariant()!.stockQuantity <= 0 : false;
    }
    return false; // Assuming base product stock is handled by variants
  }

  getAvailabilityClass(): string {
    if (this.isOutOfStock()) return 'out-of-stock';
    const sq = this.selectedVariant()?.stockQuantity || 0;
    if (sq > 0 && sq <= 5) return 'low-stock';
    return 'in-stock';
  }

  getAvailabilityText(): string {
    if (this.isOutOfStock()) return 'Brak w magazynie';
    const sq = this.selectedVariant()?.stockQuantity || 0;
    if (sq > 0 && sq <= 5) return 'Ostatnie sztuki';
    return 'Dostępny w magazynie';
  }

  changeQuantity(delta: number) {
    this.quantity = Math.max(1, this.quantity + delta);
    if (this.selectedVariant() && this.quantity > this.selectedVariant()!.stockQuantity) {
      this.quantity = this.selectedVariant()!.stockQuantity;
    }
  }

  addToCart() {
    const p = this.product();
    if (!p) return;

    // Use selected variant or first variant if only one exist and none selected
    let variant = this.selectedVariant();
    if (!variant && p.variants.length === 1) {
      variant = p.variants[0];
    }

    if (!variant) {
      this.ui.showToast('Proszę wybrać wariant produktu', 'error');
      return;
    }

    const cartItem: CartItem = {
      productId: p.id,
      variantId: variant.id,
      productName: p.name,
      sku: variant.sku,
      mainImageUrl: p.mainImageUrl,
      price: variant.price || p.price,
      quantity: this.quantity,
      subtotal: (variant.price || p.price) * this.quantity,
      attributes: variant.attributeValues,
      stockQuantity: variant.stockQuantity
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        this.ui.showToast('Dodano do koszyka!');
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Nie można dodać produktu (brak wystarczającej ilości w magazynie?)';
        this.ui.showToast(errorMsg, 'error');
      }
    });
  }
}
