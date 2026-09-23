import { Component, inject, OnInit } from '@angular/core';
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
        <a routerLink="/admin/dashboard" class="back-link">Powrót do panelu</a>
        <h1 class="page-title">Kampanie Marketingowe</h1>
      </header>

      <div class="card">
        <h3>Dodaj nową kampanię</h3>
        <form (ngSubmit)="add()">
          <input type="text" [(ngModel)]="newItem.name" name="name" placeholder="Nazwa" required>
          <select [(ngModel)]="newItem.status" name="status">
            <option value="PLANNED">Planowana</option>
            <option value="ACTIVE">Trwająca</option>
            <option value="COMPLETED">Zakończona</option>
            <option value="CANCELLED">Anulowana</option>
          </select>
          <button type="submit" class="btn btn-primary">Dodaj</button>
        </form>
      </div>

      <div class="card mt-4">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa</th>
              <th>Status</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.status }}</td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="delete(item.id!)">Usuń</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 14px; margin-bottom: 16px; text-decoration: none; }
    .card { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
    .mt-4 { margin-top: 24px; }
    input, select { padding: 8px; margin-right: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 4px; }
    option { background-color: #1e1e2d; color: white; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; color: white; }
    .btn-primary { background: var(--primary); }
    .btn-danger { background: #ff4757; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
  `]
})
export class CampaignsComponent implements OnInit {
  private service = inject(MarketingCampaignService);
  items: MarketingCampaign[] = [];
  newItem: MarketingCampaign = { name: '', status: 'PLANNED' };

  ngOnInit() { this.load(); }
  load() { this.service.getAll().subscribe(d => this.items = d); }
  add() { this.service.create(this.newItem).subscribe(() => { this.load(); this.newItem = { name: '', status: 'PLANNED' }; }); }
  delete(id: number) { this.service.delete(id).subscribe(() => this.load()); }
}
