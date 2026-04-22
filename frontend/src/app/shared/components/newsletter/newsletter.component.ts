import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../../core/services/newsletter.service';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="newsletter-section">
      <div class="newsletter-container">
        <div class="newsletter-content">
          <div class="newsletter-icon">💌</div>
          <div class="newsletter-text">
            <h3>Dołącz do naszego Newslettera!</h3>
            <p>Zapisz się, a otrzymasz <strong>50 zł rabatu</strong> na pierwsze zakupy. Kod prześlemy wprost na Twoją skrzynkę.</p>
          </div>
        </div>
        <div class="newsletter-form">
          <form (ngSubmit)="subscribe()" #form="ngForm">
            <input 
              type="email" 
              placeholder="Twój adres e-mail" 
              [(ngModel)]="email" 
              name="email" 
              required 
              email
              [disabled]="isSubmitting()"
              class="newsletter-input"
            >
            <button 
              type="submit" 
              class="btn-subscribe" 
              [disabled]="form.invalid || isSubmitting()"
            >
              {{ isSubmitting() ? 'Wysyłanie...' : 'Odbierz 50 zł' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  `,

})
export class NewsletterComponent {
  private newsletterService = inject(NewsletterService);
  private ui = inject(UiService);

  email = '';
  isSubmitting = signal(false);

  subscribe() {
    if (!this.email) return;

    this.isSubmitting.set(true);
    this.newsletterService.subscribe(this.email).subscribe({
      next: (res: { message: string }) => {
        this.isSubmitting.set(false);
        this.ui.showToast(res.message);
        this.email = ''; // Reset form
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        this.ui.showToast(err.error?.message || 'Błąd podczas zapisu do newslettera', 'error');
      }
    });
  }
}
