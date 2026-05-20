import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <a routerLink="/admin/dashboard" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Powrót do panelu
        </a>
        <h1 class="page-title">Ustawienia Sklepu</h1>
        <p class="page-subtitle">Konfiguruj podstawowe parametry i działanie sklepu.</p>
      </header>
      <div class="coming-soon-card">
        <div class="coming-soon-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
        <h2>Moduł w przygotowaniu</h2>
        <p>Konfiguracja ustawień sklepu jest w trakcie tworzenia. Wkrótce będzie dostępna.</p>
      </div>
    </div>
  `,
  styles: [`
    .back-link { display:inline-flex;align-items:center;gap:8px;color:var(--text-muted);text-decoration:none;font-size:14px;margin-bottom:16px;transition:color .2s ease; }
    .back-link:hover { color:var(--primary-light); }
    .back-link svg { width:18px;height:18px; }
    .coming-soon-card { display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 40px;background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.08);border-radius:var(--radius);margin-top:20px; }
    .coming-soon-icon { width:72px;height:72px;border-radius:20px;display:flex;align-items:center;justify-content:center;background:rgba(139,92,246,.1);color:var(--primary-light);margin-bottom:24px; }
    .coming-soon-icon svg { width:36px;height:36px; }
    .coming-soon-card h2 { font-size:22px;font-weight:600;color:var(--text);margin-bottom:8px; }
    .coming-soon-card p { font-size:14px;color:var(--text-muted);max-width:400px;line-height:1.6; }
  `]
})
export class SettingsComponent {}
