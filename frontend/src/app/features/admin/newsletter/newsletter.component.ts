import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsletterMessage, NewsletterService } from '../../../core/services/newsletter.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <a routerLink="/admin/dashboard" class="back-link">Powrót do panelu</a>
        <h1 class="page-title">Newsletter</h1>
      </header>

      <div class="card">
        <h3>Utwórz nową wiadomość</h3>
        <form (ngSubmit)="add()">
          <input type="text" [(ngModel)]="newItem.subject" name="subject" placeholder="Temat" required style="width: 100%; margin-bottom: 8px;">
          <textarea [(ngModel)]="newItem.content" name="content" placeholder="Treść wiadomości..." required style="width: 100%; height: 100px; margin-bottom: 8px; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 8px;"></textarea>
          <button type="submit" class="btn btn-primary">Dodaj do kolejki</button>
        </form>
      </div>

      <div class="card mt-4">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Temat</th>
              <th>Status</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items">
              <td>{{ item.id }}</td>
              <td>{{ item.subject }}</td>
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
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; color: white; }
    .btn-primary { background: var(--primary); }
    .btn-danger { background: #ff4757; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
  `]
})
export class NewsletterComponent implements OnInit {
  private service = inject(NewsletterService);
  items: NewsletterMessage[] = [];
  newItem: NewsletterMessage = { subject: '', content: '', status: 'DRAFT' };

  ngOnInit() { this.load(); }
  load() { this.service.getAllMessages().subscribe(d => this.items = d); }
  add() { this.service.createMessage(this.newItem).subscribe(() => { this.load(); this.newItem = { subject: '', content: '', status: 'DRAFT' }; }); }
  delete(id: number) { this.service.deleteMessage(id).subscribe(() => this.load()); }
}
