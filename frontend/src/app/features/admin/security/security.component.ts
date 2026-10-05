import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container page">
      <header class="page-header"><a routerLink="/admin/dashboard" class="back-link">Powrót do panelu</a><h1 class="page-title">Bezpieczeństwo i Logi (Wersja Poglądowa)</h1></header>
      <div class="card">
        <h3>Ostatnie logowania do panelu admina</h3>
        <table class="table">
          <thead><tr><th>Użytkownik</th><th>IP</th><th>Data</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>admin@example.com</td><td>192.168.1.45</td><td>Dzisiaj, 14:30</td><td style="color: #4cd137;">Sukces</td></tr>
            <tr><td>pracownik@example.com</td><td>10.0.0.12</td><td>Dzisiaj, 09:15</td><td style="color: #4cd137;">Sukces</td></tr>
            <tr><td>nieznany</td><td>8.8.8.8</td><td>Wczoraj, 23:55</td><td style="color: #ff4757;">Nieudane</td></tr>
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
export class SecurityComponent {}
