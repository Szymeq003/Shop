import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container page">
      <header class="page-header"><a routerLink="/admin/dashboard" class="back-link">Powrót do panelu</a><h1 class="page-title">Status Systemu (Wersja Poglądowa)</h1></header>
      <div class="card">
        <h3>Moduły aplikacji</h3>
        <ul style="list-style: none; padding: 0; margin-top: 16px;">
          <li style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between;">
            <span>Baza danych (MySQL)</span> <span style="color: #4cd137; font-weight: bold;">ONLINE</span>
          </li>
          <li style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between;">
            <span>Serwer API (Spring Boot)</span> <span style="color: #4cd137; font-weight: bold;">ONLINE</span>
          </li>
          <li style="padding: 12px 0; display: flex; justify-content: space-between;">
            <span>Serwer plików (Uploads)</span> <span style="color: #4cd137; font-weight: bold;">ONLINE</span>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 14px; margin-bottom: 16px; text-decoration: none; }
    .card { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
  `]
})
export class SystemComponent {}
