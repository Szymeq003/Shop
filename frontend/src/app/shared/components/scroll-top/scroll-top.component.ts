import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  template: `
    <button 
      class="scroll-top-btn" 
      [class.visible]="isVisible()" 
      [class.on-footer]="isNearBottom()"
      (click)="scrollToTop()"
      aria-label="Wróć na górę"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </button>
  `,
  styles: []
})
export class ScrollTopComponent {
  isVisible = signal(false);
  isNearBottom = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    this.isVisible.set(scrollPos > 300);
    
    // Detect if we're near the bottom (footer area)
    this.isNearBottom.set(scrollPos + windowHeight > docHeight - 150);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

