import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  standalone: true,
  template: `
    <div class="page-header">
      <h2 class="page-title">Moje opinie</h2>
      <p class="page-subtitle">Przeglądaj i edytuj swoje opinie o produktach.</p>
    </div>
    <div class="empty-state">
      <div class="icon">⭐</div>
      <h3>Brak opinii</h3>
      <p>Nie wystawiłeś jeszcze żadnej opinii o zakupionych produktach.</p>
    </div>
  `
})
export class ReviewsComponent {}
