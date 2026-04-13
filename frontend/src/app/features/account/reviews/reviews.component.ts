import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewDTO } from '../../../core/models/product.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { UiService } from '../../../core/services/ui.service';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, RouterLink, RouterLinkActive],
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
            <h2 class="page-title">Moje opinie</h2>
            <p class="page-subtitle">Przeglądaj i zarządzaj swoimi opiniami o produktach.</p>
          </div>

          <div class="reviews-container" *ngIf="!isLoading()">
            <div class="review-card" *ngFor="let review of reviews()">
              <div class="card-header">
                <div class="rating-info">
                  <app-star-rating [rating]="review.rating" [readonly]="true"></app-star-rating>
                  <span class="date">{{ review.createdAt | date:'dd.MM.yyyy' }}</span>
                </div>
                <button class="delete-btn" (click)="deleteReview(review.id)" title="Usuń opinię">
                  🗑️
                </button>
              </div>
              <p class="comment">{{ review.comment }}</p>
            </div>

            <div class="empty-state" *ngIf="reviews().length === 0">
              <div class="icon">⭐</div>
              <h3>Brak opinii</h3>
              <p>Nie wystawiłeś jeszcze żadnej opinii o produktach.</p>
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
    .reviews-container { display: flex; flex-direction: column; gap: 20px; }
    .review-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.2s;
    }
    .review-card:hover { border-color: var(--primary); transform: translateY(-2px); }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .rating-info { display: flex; flex-direction: column; gap: 4px; }
    .date { font-size: 13px; color: var(--text-muted); }
    .delete-btn {
      background: none; border: none; font-size: 18px; cursor: pointer;
      opacity: 0.5; transition: opacity 0.2s; padding: 8px;
    }
    .delete-btn:hover { opacity: 1; color: var(--error); }
    .comment { line-height: 1.6; color: var(--text); }

    .loading-state { display: flex; justify-content: center; padding: 40px; }
    .spinner {
      width: 40px; height: 40px; border: 3px solid rgba(var(--primary-rgb), 0.1);
      border-top-color: var(--primary); border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  private ui = inject(UiService);

  reviews = signal<ReviewDTO[]>([]);
  isLoading = signal(true);
  profileData = signal({
    name: this.authService.currentUser()?.name || ''
  });

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.isLoading.set(true);
    this.reviewService.getMyReviews().subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  async deleteReview(id: number) {
    const confirmed = await this.ui.confirm('Czy na pewno chcesz usunąć tę opinię?');
    if (confirmed) {
      this.reviewService.deleteReview(id).subscribe(() => {
        this.ui.showToast('Opinia została usunięta');
        this.loadReviews();
      });
    }
  }
}
