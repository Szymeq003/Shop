import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of ui.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type" (click)="ui.removeToast(toast.id)">
          <div class="icon">
            @if (toast.type === 'success') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            } @else if (toast.type === 'error') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            }
          </div>
          <span class="message">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      min-width: 300px;
      padding: 16px;
      border-radius: 12px;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transition: transform 0.2s;
    }
    .toast:hover { transform: scale(1.02); }
    .toast.success { border-left: 4px solid var(--success); }
    .toast.error { border-left: 4px solid var(--error); }
    .toast.info { border-left: 4px solid var(--primary); }
    
    .icon { width: 20px; height: 20px; flex-shrink: 0; }
    .icon svg { width: 100%; height: 100%; }
    .success .icon { color: var(--success); }
    .error .icon { color: var(--error); }
    .info .icon { color: var(--primary); }

    .message { font-size: 14px; font-weight: 500; }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  ui = inject(UiService);
}
