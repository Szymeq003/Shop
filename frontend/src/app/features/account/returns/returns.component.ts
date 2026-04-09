import { Component } from '@angular/core';

@Component({
  selector: 'app-returns',
  standalone: true,
  template: `
    <div class="page-header">
      <h2 class="page-title">Moje zwroty</h2>
      <p class="page-subtitle">Zarządzaj zwrotami i reklamacjami swoich zamówień.</p>
    </div>
    <div class="empty-state">
      <div class="icon">🔄</div>
      <h3>Brak aktywnych zwrotów</h3>
      <p>Nie masz żadnych rozpoczętych procesów zwrotu.</p>
    </div>
  `
})
export class ReturnsComponent {}
