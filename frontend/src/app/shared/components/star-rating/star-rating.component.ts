import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating" [class.readonly]="readonly">
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <span 
          class="star" 
          [class.filled]="star <= (hoverRating || rating)" 
          (click)="onStarClick(star)"
          (mouseenter)="onMouseEnter(star)"
          (mouseleave)="onMouseLeave()">
          ★
        </span>
      }
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      gap: 2px;
      font-size: 1.5rem;
      color: #ccc;
    }
    .star {
      cursor: pointer;
      transition: color 0.2s, transform 0.2s;
    }
    .star.filled {
      color: #ffc107;
    }
    .readonly .star {
      cursor: default;
    }
    .star:not(.readonly):hover {
      transform: scale(1.2);
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating: number = 0;

  onStarClick(rating: number): void {
    if (!this.readonly) {
      this.rating = rating;
      this.ratingChange.emit(this.rating);
    }
  }

  onMouseEnter(rating: number): void {
    if (!this.readonly) {
      this.hoverRating = rating;
    }
  }

  onMouseLeave(): void {
    if (!this.readonly) {
      this.hoverRating = 0;
    }
  }
}
