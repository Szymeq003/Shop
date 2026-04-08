import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card" style="text-align: center;">
        <div class="auth-logo">
          <h1>🛍️ Sklep</h1>
          <p>Weryfikacja konta</p>
        </div>

        @if (status() === 'loading') {
          <div class="spinner"></div>
          <p>Trwa weryfikacja Twojego konta...</p>
        }

        @if (status() === 'success') {
          <div class="alert alert-success">
            🎉 Konto zostało aktywowane pomyślnie!
          </div>
          <p style="margin-bottom: 24px;">Możesz się teraz zalogować i korzystać ze wszystkich funkcji sklepu.</p>
          <a routerLink="/auth/login" class="btn btn-primary btn-full">Przejdź do logowania</a>
        }

        @if (status() === 'error') {
          <div class="alert alert-error">
            ❌ Błąd aktywacji konta
          </div>
          <p style="margin-bottom: 24px;">{{ errorMessage() }}</p>
          <a routerLink="/auth/register" class="btn btn-secondary btn-full">Zarejestruj się ponownie</a>
        }
      </div>
    </div>
  `
})
export class VerifyAccountComponent implements OnInit {
  status = signal<'loading' | 'success' | 'error'>('loading');
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status.set('error');
      this.errorMessage.set('Brak tokenu weryfikacyjnego w linku.');
      return;
    }

    this.authService.verifyAccount(token).subscribe({
      next: () => {
        this.status.set('success');
      },
      error: (err) => {
        this.status.set('error');
        this.errorMessage.set(err.error?.message || 'Wystąpił nieoczekiwany błąd podczas weryfikacji.');
      }
    });
  }
}
