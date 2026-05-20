import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <a routerLink="/admin/dashboard" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Powrót do panelu
        </a>
        <h1 class="page-title">Newsletter</h1>
        <p class="page-subtitle">Zarządzaj subskrybentami i wysyłaj kampanie e-mailowe.</p>
      </header>

      <div class="coming-soon-card">
        <div class="coming-soon-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h2>Moduł w przygotowaniu</h2>
        <p>Funkcjonalność newslettera jest w trakcie tworzenia. Wkrótce będzie dostępna.</p>
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
      background: rgba(81, 207, 102, 0.1);
      color: #51cf66;
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
export class NewsletterComponent {}
