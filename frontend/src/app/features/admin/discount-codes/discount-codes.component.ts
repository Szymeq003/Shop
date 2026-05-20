import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-discount-codes',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <a routerLink="/admin/dashboard" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Powrót do panelu
        </a>
        <h1 class="page-title">Kody Rabatowe</h1>
        <p class="page-subtitle">Twórz i zarządzaj kodami rabatowymi dla klientów.</p>
      </header>

      <div class="coming-soon-card">
        <div class="coming-soon-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </div>
        <h2>Moduł w przygotowaniu</h2>
        <p>Funkcjonalność kodów rabatowych jest w trakcie tworzenia. Wkrótce będzie dostępna.</p>
      </div>
    </div>
  `,
  styles: [`
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 14px;
      margin-bottom: 16px;
      transition: color 0.2s ease;
    }
    .back-link:hover { color: var(--primary-light); }
    .back-link svg { width: 18px; height: 18px; }

    .coming-soon-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 80px 40px;
      background: rgba(255,255,255,0.02);
      border: 1px dashed rgba(255,255,255,0.08);
      border-radius: var(--radius);
      margin-top: 20px;
    }
    .coming-soon-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 159, 67, 0.1);
      color: #ff9f43;
      margin-bottom: 24px;
    }
    .coming-soon-icon svg { width: 36px; height: 36px; }
    .coming-soon-card h2 {
      font-size: 22px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 8px;
    }
    .coming-soon-card p {
      font-size: 14px;
      color: var(--text-muted);
      max-width: 400px;
      line-height: 1.6;
    }
  `]
})
export class DiscountCodesComponent {}
