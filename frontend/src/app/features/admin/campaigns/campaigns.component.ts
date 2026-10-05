import { Component, inject, OnInit, signal, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketingCampaign, MarketingCampaignService } from '../../../core/services/marketing-campaign.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <a routerLink="/admin/dashboard" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Powrót do panelu
        </a>
        <h1 class="page-title">Kampanie Marketingowe</h1>
        <p class="page-subtitle">Zarządzaj kampaniami i śledź ich skuteczność w czasie.</p>
      </header>

      <div class="card form-card">
        <h3>Dodaj nową kampanię</h3>
        <form (ngSubmit)="add()" class="inline-form">
          <input type="text" [(ngModel)]="newItem.name" name="name" placeholder="Nazwa kampanii" required>
          <select [(ngModel)]="newItem.status" name="status">
            <option value="PLANNED">Planowana</option>
            <option value="ACTIVE">Trwająca</option>
            <option value="COMPLETED">Zakończona</option>
            <option value="CANCELLED">Anulowana</option>
          </select>
          <button type="submit" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Dodaj
          </button>
        </form>
      </div>

      <div class="card mt-4">
        <div class="table-wrap" *ngIf="!isLoading() && items().length > 0">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nazwa</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of items()">
                <td><span class="id-cell">#{{ item.id }}</span></td>
                <td><span class="name-cell">{{ item.name }}</span></td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-planned': item.status === 'PLANNED',
                    'badge-active': item.status === 'ACTIVE',
                    'badge-completed': item.status === 'COMPLETED',
                    'badge-cancelled': item.status === 'CANCELLED'
                  }">
                    {{ getStatusLabel(item.status) }}
                  </span>
                </td>
                <td>
                  <button class="btn-delete" (click)="delete(item.id!)" title="Usuń">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="loading-state" *ngIf="isLoading()">
          <div class="spinner"></div>
          <p>Ładowanie kampanii...</p>
        </div>

        <div class="empty-state" *ngIf="!isLoading() && items().length === 0">
          <div class="empty-icon">📊</div>
          <p>Brak kampanii. Dodaj pierwszą kampanię powyżej.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .back-link { display:inline-flex;align-items:center;gap:8px;color:var(--text-muted);text-decoration:none;font-size:14px;margin-bottom:16px;transition:color .2s ease; }
    .back-link:hover { color:var(--primary-light); }
    .back-link svg { width:18px;height:18px; }
    .form-card { padding: 24px; }
    .form-card h3 { font-size: 18px; font-weight: 600; color: var(--text); margin-bottom: 16px; }
    .inline-form { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .inline-form input, .inline-form select { 
      padding: 10px 14px; background: var(--surface-3); border: 1px solid var(--border); 
      color: var(--text); border-radius: var(--radius-sm); font-size: 14px; outline: none; transition: border-color .2s ease; 
    }
    .inline-form input:focus, .inline-form select:focus { border-color: var(--primary); }
    .inline-form input[type="text"] { flex: 1; min-width: 200px; }
    .inline-form select { min-width: 150px; cursor: pointer; }
    .inline-form select option { background: var(--surface-2); color: var(--text); }
    .mt-4 { margin-top: 24px; }
    .id-cell { color: var(--text-muted); font-size: 13px; }
    .name-cell { font-weight: 500; color: var(--text); }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-planned { background: rgba(255,212,59,0.12); color: var(--warning); }
    .badge-active { background: rgba(81,207,102,0.12); color: var(--success); }
    .badge-completed { background: rgba(139,92,246,0.12); color: var(--primary-light); }
    .badge-cancelled { background: rgba(255,107,107,0.12); color: var(--error); }
    .btn-delete {
      background: rgba(255,107,107,0.05); border: 1px solid rgba(255,107,107,0.2); color: var(--error);
      cursor: pointer; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all .2s ease;
    }
    .btn-delete:hover { background: rgba(255,107,107,0.15); border-color: var(--error); }
    .btn-delete svg { width: 16px; height: 16px; }
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; color: var(--text-muted); }
    .spinner { width: 32px; height: 32px; border: 2px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 12px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; color: var(--text-muted); }
    .empty-icon { font-size: 36px; margin-bottom: 12px; }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border: none; border-radius: var(--radius-sm); cursor: pointer; color: white; font-size: 14px; font-weight: 500; }
    .btn-primary { background: var(--primary); transition: background .2s ease; }
    .btn-primary:hover { background: var(--primary-light); }
  `]
})
export class CampaignsComponent implements OnInit {
  private service = inject(MarketingCampaignService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  items = signal<MarketingCampaign[]>([]);
  isLoading = signal(true);
  newItem: MarketingCampaign = { name: '', status: 'PLANNED' };

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.service.getAll().subscribe({
      next: (d) => {
        this.ngZone.run(() => {
          this.items.set(d);
          this.isLoading.set(false);
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.isLoading.set(false);
          this.cdr.detectChanges();
        });
      }
    });
  }

  add() {
    this.service.create(this.newItem).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.load();
          this.newItem = { name: '', status: 'PLANNED' };
          this.cdr.detectChanges();
        });
      }
    });
  }

  delete(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.items.update(list => list.filter(i => i.id !== id));
          this.cdr.detectChanges();
        });
      }
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'PLANNED': 'Planowana',
      'ACTIVE': 'Trwająca',
      'COMPLETED': 'Zakończona',
      'CANCELLED': 'Anulowana'
    };
    return map[status] || status;
  }
}
