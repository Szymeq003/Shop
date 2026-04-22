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
