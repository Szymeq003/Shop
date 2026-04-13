import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({ providedIn: 'root' })
export class UiService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  confirmState = signal<{ message: string, resolve: (val: boolean) => void } | null>(null);

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = this.nextId++;
    const toast: Toast = { id, message, type };
    this.toasts.update(t => [...t, toast]);

    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  removeToast(id: number) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }

  confirm(message: string): Promise<boolean> {
    return new Promise(resolve => {
      this.confirmState.set({ message, resolve });
    });
  }

  resolveConfirm(value: boolean) {
    const state = this.confirmState();
    if (state) {
      state.resolve(value);
      this.confirmState.set(null);
    }
  }
}
