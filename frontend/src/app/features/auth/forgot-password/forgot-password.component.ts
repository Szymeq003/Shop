import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>Reset hasła</h1>
          <p>Wprowadź swój email, aby otrzymać link do resetowania hasła.</p>
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

        <form (ngSubmit)="onSubmit()" #forgotForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              placeholder="twoj@email.pl"
              #emailInput="ngModel"
              [class.error]="emailInput.invalid && emailInput.touched"
            >
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="forgotForm.invalid || isLoading()"
            style="margin-top: 12px;"
          >
            @if (isLoading()) {
              Wysyłanie...
            } @else {
              Wyślij link do resetu
            }
          </button>
        </form>

        <div class="auth-footer">
          Przypomniałeś sobie hasło? <a routerLink="/auth/login">Wróć do logowania</a>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  email = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.successMessage.set(res.message);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Błąd podczas wysyłania linku.');
      }
    });
  }
}
