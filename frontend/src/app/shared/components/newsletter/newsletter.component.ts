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
  styles: [`
    .newsletter-section {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      padding: 40px 0;
      margin-top: 60px;
      color: white;
      box-shadow: 0 -4px 20px rgba(108, 99, 255, 0.15);
    }
    .newsletter-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 30px;
    }
    .newsletter-content {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 1;
      min-width: 300px;
    }
    .newsletter-icon {
      font-size: 48px;
      line-height: 1;
    }
    .newsletter-text h3 {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .newsletter-text p {
      font-size: 15px;
      opacity: 0.9;
      line-height: 1.5;
    }
    .newsletter-form {
      flex: 1;
      min-width: 300px;
      display: flex;
      justify-content: flex-end;
    }
    .newsletter-form form {
      display: flex;
      gap: 10px;
      width: 100%;
      max-width: 450px;
      background: rgba(255, 255, 255, 0.1);
      padding: 6px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .newsletter-input {
      flex: 1;
      background: transparent;
      border: none;
      padding: 12px 16px;
      color: white;
      font-size: 15px;
      outline: none;
      font-family: inherit;
    }
    .newsletter-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    .btn-subscribe {
      background: white;
      color: var(--primary-dark);
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.25s;
    }
    .btn-subscribe:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .btn-subscribe:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .newsletter-container {
        flex-direction: column;
        text-align: center;
      }
      .newsletter-content {
        flex-direction: column;
      }
      .newsletter-form {
        justify-content: center;
        width: 100%;
      }
    }
  `]
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
