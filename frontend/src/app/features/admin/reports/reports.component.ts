import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container page">
      <header class="page-header"><a routerLink="/admin/dashboard" class="back-link">Powrót do panelu</a><h1 class="page-title">Raporty (Wersja Poglądowa)</h1></header>
      <div class="card" style="margin-bottom: 24px;">
        <h3>Sprzedaż z ostatnich 7 dni</h3>
        <div style="height: 200px; display: flex; align-items: flex-end; gap: 20px; padding-top: 20px;">
          <div style="background: var(--primary); width: 40px; height: 30%; border-radius: 4px 4px 0 0;"></div>
          <div style="background: var(--primary); width: 40px; height: 50%; border-radius: 4px 4px 0 0;"></div>
          <div style="background: var(--primary); width: 40px; height: 80%; border-radius: 4px 4px 0 0;"></div>
          <div style="background: var(--primary); width: 40px; height: 60%; border-radius: 4px 4px 0 0;"></div>
          <div style="background: var(--primary); width: 40px; height: 90%; border-radius: 4px 4px 0 0;"></div>
          <div style="background: var(--primary); width: 40px; height: 100%; border-radius: 4px 4px 0 0;"></div>
          <div style="background: var(--primary); width: 40px; height: 75%; border-radius: 4px 4px 0 0;"></div>
        </div>
      </div>
      <div class="card">
        <h3>Najlepiej sprzedające się produkty</h3>
        <table class="table">
          <thead><tr><th>Produkt</th><th>Sprzedano</th></tr></thead>
          <tbody>
            <tr><td>iPhone 15 Pro</td><td>45 szt.</td></tr>
            <tr><td>MacBook Air M2</td><td>23 szt.</td></tr>
            <tr><td>Logitech G Pro X</td><td>12 szt.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 14px; margin-bottom: 16px; text-decoration: none; }
    .card { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
    .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
  `]
})
export class ReportsComponent {}
