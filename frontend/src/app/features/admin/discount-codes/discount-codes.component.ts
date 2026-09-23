import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DiscountCode, DiscountCodeService } from '../../../core/services/discount-code.service';

@Component({
  selector: 'app-discount-codes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <a routerLink="/admin/dashboard" class="back-link">Powrót do panelu</a>
        <h1 class="page-title">Kody Rabatowe</h1>
      </header>

      <div class="card">
        <h3>Dodaj nowy kod</h3>
        <form (ngSubmit)="add()">
          <input type="text" [(ngModel)]="newCode.code" name="code" placeholder="Kod" required>
          <select [(ngModel)]="newCode.type" name="type">
            <option value="PERCENTAGE">Procentowy</option>
            <option value="FIXED">Kwotowy</option>
          </select>
          <input type="number" [(ngModel)]="newCode.value" name="value" placeholder="Wartość" required>
          <button type="submit" class="btn btn-primary">Dodaj</button>
        </form>
      </div>

      <div class="card mt-4">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kod</th>
              <th>Typ</th>
              <th>Wartość</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items">
              <td>{{ item.id }}</td>
              <td>{{ item.code }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.value }}</td>
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
export class DiscountCodesComponent implements OnInit {
  private service = inject(DiscountCodeService);
  items: DiscountCode[] = [];
  newCode: DiscountCode = { code: '', type: 'PERCENTAGE', value: 0, active: true };

  ngOnInit() { this.load(); }
  load() { this.service.getAll().subscribe(d => this.items = d); }
  add() { this.service.create(this.newCode).subscribe(() => { this.load(); this.newCode = { code: '', type: 'PERCENTAGE', value: 0, active: true }; }); }
  delete(id: number) { this.service.delete(id).subscribe(() => this.load()); }
}
