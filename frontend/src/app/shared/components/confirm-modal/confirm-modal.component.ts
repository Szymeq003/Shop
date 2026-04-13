import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (ui.confirmState(); as state) {
      <div class="modal-overlay" (click)="ui.resolveConfirm(false)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 class="modal-title">Potwierdź akcję</h3>
          <p class="modal-message">{{ state.message }}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="ui.resolveConfirm(false)">Anuluj</button>
            <button class="btn btn-danger" (click)="ui.resolveConfirm(true)">Tak, usuń</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease-out;
    }
    .modal-card {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px;
      width: 100%;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .modal-icon {
      width: 64px; height: 64px;
      background: rgba(var(--error-rgb), 0.1);
      color: var(--error);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }
    .modal-icon svg { width: 32px; height: 32px; }
    .modal-title { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: var(--text); }
    .modal-message { color: var(--text-muted); line-height: 1.6; margin-bottom: 32px; }
    .modal-actions { display: flex; gap: 12px; }
    .modal-actions button { flex: 1; height: 48px; border-radius: 12px; font-weight: 600; font-size: 15px; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class ConfirmModalComponent {
  ui = inject(UiService);
}
