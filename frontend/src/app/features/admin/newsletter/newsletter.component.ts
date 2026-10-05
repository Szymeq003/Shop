import { Component, inject, OnInit, signal, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsletterMessage, NewsletterService } from '../../../core/services/newsletter.service';

@Component({
  selector: 'app-admin-newsletter',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

      <div class="card form-card">
        <h3>Utwórz nową wiadomość</h3>
        <form (ngSubmit)="add()" class="message-form">
          <input type="text" [(ngModel)]="newItem.subject" name="subject" placeholder="Temat wiadomości" required>
          <textarea [(ngModel)]="newItem.content" name="content" placeholder="Treść wiadomości..." required></textarea>
          <button type="submit" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Dodaj do kolejki
          </button>
        </form>
      </div>

      <div class="card mt-4">
        <div class="table-wrap" *ngIf="!isLoading() && items().length > 0">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Temat</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of items()">
                <td><span class="id-cell">#{{ item.id }}</span></td>
                <td><span class="name-cell">{{ item.subject }}</span></td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-draft': item.status === 'DRAFT',
                    'badge-sent': item.status === 'SENT'
                  }">
                    {{ item.status === 'DRAFT' ? 'Szkic' : 'Wysłano' }}
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
          <p>Ładowanie wiadomości...</p>
        </div>

        <div class="empty-state" *ngIf="!isLoading() && items().length === 0">
          <div class="empty-icon">📧</div>
          <p>Brak wiadomości. Utwórz pierwszą wiadomość powyżej.</p>
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
    .message-form { display: flex; flex-direction: column; gap: 12px; }
    .message-form input, .message-form textarea { 
      padding: 10px 14px; background: var(--surface-3); border: 1px solid var(--border); 
      color: var(--text); border-radius: var(--radius-sm); font-size: 14px; font-family: inherit; outline: none; transition: border-color .2s ease; width: 100%; box-sizing: border-box;
    }
    .message-form input:focus, .message-form textarea:focus { border-color: var(--primary); }
    .message-form textarea { height: 120px; resize: vertical; }
    .mt-4 { margin-top: 24px; }
    .id-cell { color: var(--text-muted); font-size: 13px; }
    .name-cell { font-weight: 500; color: var(--text); }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-draft { background: rgba(255,212,59,0.12); color: var(--warning); }
    .badge-sent { background: rgba(81,207,102,0.12); color: var(--success); }
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
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border: none; border-radius: var(--radius-sm); cursor: pointer; color: white; font-size: 14px; font-weight: 500; align-self: flex-start; }
    .btn-primary { background: var(--primary); transition: background .2s ease; }
    .btn-primary:hover { background: var(--primary-light); }
  `]
})
export class NewsletterComponent implements OnInit {
  private service = inject(NewsletterService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  items = signal<NewsletterMessage[]>([]);
  isLoading = signal(true);
  newItem: NewsletterMessage = { subject: '', content: '', status: 'DRAFT' };

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.service.getAllMessages().subscribe({
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
    this.service.createMessage(this.newItem).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.load();
          this.newItem = { subject: '', content: '', status: 'DRAFT' };
          this.cdr.detectChanges();
        });
      }
    });
  }

  delete(id: number) {
    this.service.deleteMessage(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.items.update(list => list.filter(i => i.id !== id));
          this.cdr.detectChanges();
        });
      }
    });
  }
}
