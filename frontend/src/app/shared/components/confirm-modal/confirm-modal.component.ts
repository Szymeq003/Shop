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

})
export class ConfirmModalComponent {
  ui = inject(UiService);
}
