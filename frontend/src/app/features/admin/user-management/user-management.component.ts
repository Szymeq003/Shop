import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, UserResponse } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container page">
      <header class="page-header">
        <div class="header-flex">
          <div>
            <h1 class="page-title">Zarządzanie Użytkownikami</h1>
            <p class="page-subtitle">Zarządzaj kontami klientów, pracowników oraz innych administratorów sklepu.</p>
          </div>
          <button class="btn btn-primary" (click)="openAddModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Dodaj Użytkownika
          </button>
        </div>
      </header>

      <!-- Search & Filters -->
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Szukaj użytkownika (imię lub email)..." class="filter-search">
        </div>
        <select [(ngModel)]="selectedRoleFilter" class="filter-select">
          <option value="ALL">Wszystkie role</option>
          <option value="admin">Administrator</option>
          <option value="pracownik">Pracownik</option>
          <option value="klient">Klient</option>
        </select>
      </div>

      <!-- Users Table Card -->
      <div class="card table-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nazwa użytkownika</th>
                <th>E-mail</th>
                <th>Data rejestracji</th>
                <th>Rola</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of filteredUsers()">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar" [class]="'avatar-' + u.role">
                      {{ u.name.substring(0, 2).toUpperCase() }}
                    </div>
                    <span class="user-name">{{ u.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="user-email">{{ u.email }}</span>
                  <span class="self-tag" *ngIf="isSelf(u)"> (Ty)</span>
                </td>
                <td>
                  <span class="user-date">{{ u.createdAt | date:'dd.MM.yyyy HH:mm' }}</span>
                </td>
                <td>
                  <select [ngModel]="u.role" 
                          (ngModelChange)="changeRole(u, $event)" 
                          [disabled]="isSelf(u)"
                          class="role-select"
                          [class.role-admin]="u.role === 'admin'"
                          [class.role-pracownik]="u.role === 'pracownik'"
                          [class.role-klient]="u.role === 'klient'">
                    <option value="klient">Klient</option>
                    <option value="pracownik">Pracownik</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button (click)="deleteUser(u)" 
                          [disabled]="isSelf(u)"
                          class="btn-delete" 
                          title="Usuń użytkownika">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </td>
              </tr>

              <!-- Loading State -->
              <tr *ngIf="isLoading()">
                <td colspan="5">
                  <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Ładowanie użytkowników...</p>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr *ngIf="!isLoading() && filteredUsers().length === 0">
                <td colspan="5" class="empty-row">
                  <div class="empty-state">
                    <div class="icon">👥</div>
                    <p>Brak użytkowników spełniających kryteria wyszukiwania.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <div class="modal-overlay" *ngIf="showAddModal()">
      <div class="modal">
        <div class="modal-header">
          <h2>Dodaj Nowego Użytkownika</h2>
          <button class="modal-close" (click)="closeAddModal()">&times;</button>
        </div>
        <form (submit)="createUser()">
          <div class="form-group">
            <label>Imię i Nazwisko</label>
            <input type="text" [(ngModel)]="newUser.name" name="name" required placeholder="np. Jan Kowalski">
          </div>
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" [(ngModel)]="newUser.email" name="email" required placeholder="np. jan@example.com">
          </div>
          <div class="form-group">
            <label>Hasło</label>
            <input type="password" [(ngModel)]="newUser.password" name="password" required placeholder="Maks. 8 znaków">
          </div>
          <div class="form-group">
            <label>Rola</label>
            <select [(ngModel)]="newUser.role" name="role" required class="modal-role-select">
              <option value="klient">Klient</option>
              <option value="pracownik">Pracownik (Sklep)</option>
              <option value="admin">Administrator (System)</option>
            </select>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeAddModal()">Anuluj</button>
            <button type="submit" class="btn btn-primary">Stwórz konto</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .filter-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-input-wrapper {
      position: relative;
      flex-grow: 1;
      min-width: 250px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
    }

    .filter-search {
      width: 100%;
      background: var(--surface-3);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      padding: 10px 16px 10px 40px;
      font-size: 14px;
      outline: none;
      transition: border-color var(--transition);
    }

    .filter-search:focus {
      border-color: var(--primary);
    }

    .filter-select {
      background: var(--surface-3);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      padding: 10px 36px 10px 16px;
      font-size: 14px;
      outline: none;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      transition: border-color var(--transition);
    }

    .filter-select:focus {
      border-color: var(--primary);
    }

    .filter-select option {
      background: var(--surface-2);
      color: var(--text);
    }

    .table-card {
      padding: 16px;
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: white;
      background: #495057;
    }

    .avatar-admin {
      background: linear-gradient(135deg, var(--error), #fa5252);
    }

    .avatar-pracownik {
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
    }

    .avatar-klient {
      background: linear-gradient(135deg, var(--success), #2b8a3e);
    }

    .user-name {
      font-weight: 500;
      color: var(--text);
    }

    .user-email {
      color: var(--text-muted);
    }

    .self-tag {
      font-style: italic;
      color: var(--primary-light);
      font-weight: 500;
    }

    .user-date {
      color: var(--text-muted);
    }

    .role-select {
      padding: 6px 28px 6px 10px;
      border-radius: 8px;
      background: var(--surface-3);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
      transition: border-color .2s ease, background-color .2s ease;
    }

    .role-select:focus {
      border-color: var(--primary);
    }

    .role-select option {
      background: var(--surface-2);
      color: var(--text);
      font-weight: 500;
    }

    .role-admin {
      border-color: rgba(255, 107, 107, 0.5);
      color: #ff6b6b;
      background: rgba(255, 107, 107, 0.08);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23ff6b6b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }

    .role-pracownik {
      border-color: rgba(139, 92, 246, 0.5);
      color: #a78bfa;
      background: rgba(139, 92, 246, 0.08);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }

    .role-klient {
      border-color: rgba(81, 207, 102, 0.5);
      color: #51cf66;
      background: rgba(81, 207, 102, 0.08);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%2351cf66' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }

    :host-context(body.light-theme) .role-admin {
      color: #c92a2a;
      border-color: rgba(201, 42, 42, 0.4);
      background: rgba(201, 42, 42, 0.06);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23c92a2a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }

    :host-context(body.light-theme) .role-pracownik {
      color: #5f3dc4;
      border-color: rgba(95, 61, 196, 0.4);
      background: rgba(95, 61, 196, 0.06);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%235f3dc4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }

    :host-context(body.light-theme) .role-klient {
      color: #2b8a3e;
      border-color: rgba(43, 138, 62, 0.4);
      background: rgba(43, 138, 62, 0.06);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%232b8a3e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }

    .btn-delete {
      background: rgba(255, 107, 107, 0.05);
      border: 1px solid rgba(255, 107, 107, 0.2);
      color: var(--error);
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition);
    }

    .btn-delete:hover:not(:disabled) {
      background: rgba(255, 107, 107, 0.15);
      border-color: var(--error);
    }

    .btn-delete:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background: rgba(255, 255, 255, 0.02);
      border-color: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
    }

    .btn-delete svg {
      width: 16px;
      height: 16px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: var(--text-muted);
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 2px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 12px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .modal-role-select {
      width: 100%;
      background: var(--surface-3);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-family: inherit;
      font-size: 15px;
      padding: 12px 16px;
      outline: none;
      cursor: pointer;
    }

    .modal-role-select option {
      background: var(--surface-2);
      color: var(--text);
    }

    .modal-role-select:focus {
      border-color: var(--primary);
    }
  `]
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private uiService = inject(UiService);

  users = signal<UserResponse[]>([]);
  isLoading = signal(true);

  searchQuery = '';
  selectedRoleFilter = 'ALL';

  // Modal State
  showAddModal = signal(false);
  newUser = {
    name: '',
    email: '',
    password: '',
    role: 'klient'
  };

  filteredUsers = computed(() => {
    const list = this.users();
    const query = this.searchQuery.toLowerCase().trim();
    const roleFilter = this.selectedRoleFilter;

    return list.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading.set(false);
        this.uiService.showToast('Błąd pobierania użytkowników', 'error');
      }
    });
  }

  isSelf(user: UserResponse): boolean {
    const me = this.authService.currentUser();
    return me ? me.email === user.email : false;
  }

  private getRoleLabel(role: string): string {
    const map: Record<string, string> = {
      'admin': 'Administrator',
      'pracownik': 'Pracownik',
      'klient': 'Klient'
    };
    return map[role] ?? role;
  }

  async changeRole(user: UserResponse, newRole: string) {
    if (this.isSelf(user)) {
      this.uiService.showToast('Nie możesz zmienić własnej roli!', 'error');
      return;
    }

    const confirmed = await this.uiService.confirm(`Czy na pewno chcesz zmienić rolę użytkownika ${user.name} na ${this.getRoleLabel(newRole)}?`);
    if (confirmed) {
      this.adminService.updateUserRole(user.id, newRole).subscribe({
        next: (updatedUser) => {
          this.uiService.showToast(
            `Rola użytkownika ${user.name} została zmieniona na ${this.getRoleLabel(newRole)}`,
            'success'
          );
          // Update locally
          this.users.update(list => list.map(u => u.id === updatedUser.id ? updatedUser : u));
        },
        error: (err) => {
          console.error('Error updating role:', err);
          this.uiService.showToast(err.error?.message || 'Błąd aktualizacji roli', 'error');
        }
      });
    }
  }

  async deleteUser(user: UserResponse) {
    if (this.isSelf(user)) {
      this.uiService.showToast('Nie możesz usunąć samego siebie!', 'error');
      return;
    }

    const confirmed = await this.uiService.confirm(`Czy na pewno chcesz permanentnie usunąć użytkownika ${user.name} (${user.email})?`);
    if (confirmed) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.uiService.showToast('Użytkownik został usunięty', 'success');
          // Remove from local list
          this.users.update(list => list.filter(u => u.id !== user.id));
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.uiService.showToast(err.error?.message || 'Błąd usuwania użytkownika', 'error');
        }
      });
    }
  }

  openAddModal() {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'klient'
    };
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.role) {
      this.uiService.showToast('Wszystkie pola są wymagane', 'error');
      return;
    }

    this.adminService.createUser(this.newUser).subscribe({
      next: (createdUser) => {
        this.uiService.showToast('Użytkownik został utworzony pomyślnie', 'success');
        this.users.update(list => [createdUser, ...list]);
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.uiService.showToast(err.error?.message || 'Błąd podczas tworzenia użytkownika', 'error');
      }
    });
  }
}
