import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { NewsletterComponent } from './shared/components/newsletter/newsletter.component';
import { ScrollTopComponent } from './shared/components/scroll-top/scroll-top.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent, ConfirmModalComponent, NewsletterComponent, ScrollTopComponent],
  template: `
    <app-navbar />
    <div style="min-height: calc(100vh - 70px);">
      <router-outlet />
    </div>
    @if (auth.currentUser()?.role !== 'pracownik' && auth.currentUser()?.role !== 'admin') {
      <app-newsletter />
    }
    <app-toast />
    <app-confirm-modal />
    <app-scroll-top />

    <!-- Application Theme Toggle Button (bottom-left) -->
    <button 
      class="theme-toggle-btn" 
      [class.on-footer]="isNearBottom()"
      (click)="toggleTheme()"
      [attr.aria-label]="isLightTheme() ? 'Przełącz na ciemny motyw' : 'Przełącz na jasny motyw'"
    >
      @if (isLightTheme()) {
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      } @else {
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      }
    </button>
  `,
})
export class App implements OnInit {
  auth = inject(AuthService);
  isLightTheme = signal(false);
  isNearBottom = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
    // Detect if we're near the bottom (footer/newsletter area)
    this.isNearBottom.set(scrollPos + windowHeight > docHeight - 150);
  }

  ngOnInit() {
    // Check localStorage for theme choice
    const savedTheme = localStorage.getItem('theme');
    const isLight = savedTheme === 'light';
    this.isLightTheme.set(isLight);
    if (isLight) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }

  toggleTheme() {
    const newVal = !this.isLightTheme();
    this.isLightTheme.set(newVal);
    if (newVal) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }
}
