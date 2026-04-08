import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>Nowe hasło</h1>
          <p>Wprowadź swoje nowe hasło poniżej.</p>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-error">
            {{ errorMessage() }}
          </div>
        }

        @if (successMessage()) {
          <div class="alert alert-success">
            {{ successMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #resetForm="ngForm">
          <div class="form-group">
            <label for="password">Nowe hasło</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="newPassword"
              required
              minlength="8"
              placeholder="Min. 8 znaków"
              #passwordInput="ngModel"
              [class.error]="passwordInput.invalid && passwordInput.touched"
            >
          </div>

          <div class="form-group">
            <label for="confirmPassword">Powtórz nowe hasło</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              placeholder="Powtórz hasło"
              #confirmPasswordInput="ngModel"
              [class.error]="(confirmPasswordInput.touched && confirmPassword !== newPassword)"
            >
            @if (confirmPasswordInput.touched && confirmPassword !== newPassword) {
              <span style="color: var(--error); font-size: 12px; margin-top: 4px;">Hasła nie są identyczne</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="resetForm.invalid || newPassword !== confirmPassword || isLoading()"
            style="margin-top: 12px;"
          >
            @if (isLoading()) {
              Zmienianie hasła...
            } @else {
              Zmień hasło
            }
          </button>
        </form>

        <div class="auth-footer">
          Wróć do <a routerLink="/auth/login">logowania</a>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token: string | null = null;
  newPassword = '';
  confirmPassword = '';

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage.set('Nieprawidłowy lub brakujący token resetowania hasła.');
    }
  }

  onSubmit() {
    if (!this.token) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.successMessage.set(res.message);
        this.isLoading.set(false);
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Błąd podczas zmiany hasła.');
      }
    });
  }
}
