import { Component, inject, OnInit, signal, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Tax, TaxService } from '../../../core/services/tax.service';

@Component({
  selector: 'app-taxes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container page">
      <header class="page-header"><a routerLink="/admin/dashboard" class="back-link">Powrót do panelu</a><h1 class="page-title">Podatki</h1></header>
      <div class="card">
        <form (ngSubmit)="add()">
          <input type="text" [(ngModel)]="newItem.name" name="name" placeholder="Nazwa np. VAT 23%" required>
          <input type="number" [(ngModel)]="newItem.rate" name="rate" placeholder="Stawka (np. 0.23)" required>
          <button type="submit" class="btn btn-primary">Dodaj</button>
        </form>
      </div>
      <div class="card mt-4">
        <table class="table">
          <thead><tr><th>ID</th><th>Nazwa</th><th>Stawka</th><th>Akcje</th></tr></thead>
          <tbody>
            <tr *ngFor="let item of items()"><td>{{item.id}}</td><td>{{item.name}}</td><td>{{item.rate}}</td><td><button class="btn btn-danger btn-sm" (click)="delete(item.id!)">Usuń</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 14px; margin-bottom: 16px; text-decoration: none; }
    .card { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
    .mt-4 { margin-top: 24px; }
    input { padding: 8px; margin-right: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 4px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; color: white; }
    .btn-primary { background: var(--primary); }
    .btn-danger { background: #ff4757; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
  `]
})
export class TaxesComponent implements OnInit {
  private service = inject(TaxService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  items = signal<Tax[]>([]);
  newItem: Tax = { name: '', rate: 0 };

  ngOnInit() { this.load(); }

  load() {
    this.service.getAll().subscribe({
      next: (d) => {
        this.ngZone.run(() => { this.items.set(d); this.cdr.detectChanges(); });
      }
    });
  }

  add() {
    this.service.create(this.newItem).subscribe({
      next: () => {
        this.ngZone.run(() => { this.load(); this.newItem = { name: '', rate: 0 }; this.cdr.detectChanges(); });
      }
    });
  }

  delete(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.ngZone.run(() => { this.items.update(list => list.filter(i => i.id !== id)); this.cdr.detectChanges(); });
      }
    });
  }
}
