import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminUsersService } from '../../services/admin-users-service';
import { AdminUser } from '../../models/admin-user.model';
import { UserRole } from '../../models/auth-models';
import { CLAN_ID } from '../../constants/clanData';

interface RoleOption {
  label: string;
  value: UserRole;
}

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Адмін',
  [UserRole.USER]: 'Користувач',
  [UserRole.GUEST]: 'Гість',
};

@Component({
  selector: 'app-admin-players-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    SelectModule,
  ],
  templateUrl: './admin-players-list.component.html',
  styleUrls: ['./admin-players-list.component.scss'],
})
export class AdminPlayersListComponent implements OnInit {
  private adminUsersService = inject(AdminUsersService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  players = signal<AdminUser[]>([]);
  loading = signal(false);

  readonly roleOptions: RoleOption[] = [
    { label: ROLE_LABELS[UserRole.ADMIN], value: UserRole.ADMIN },
    { label: ROLE_LABELS[UserRole.USER], value: UserRole.USER },
    { label: ROLE_LABELS[UserRole.GUEST], value: UserRole.GUEST },
  ];

  ngOnInit(): void {
    this.load();
  }

  roleLabel(role: UserRole): string {
    return ROLE_LABELS[role] ?? role;
  }

  onRoleChange(player: AdminUser, newRole: UserRole, roleModel: NgModel): void {
    if (newRole === player.role) {
      return;
    }

    this.confirmationService.confirm({
      header: 'Підтвердження зміни ролі',
      message: `Змінити роль гравця "${player.nickname}" на "${this.roleLabel(newRole)}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Так',
      rejectLabel: 'Скасувати',
      accept: () => this.applyRoleChange(player, newRole, roleModel),
      reject: () => roleModel.reset(player.role),
    });
  }

  private applyRoleChange(player: AdminUser, newRole: UserRole, roleModel: NgModel): void {
    this.adminUsersService.updateRole(player.id, newRole).subscribe({
      next: updated => {
        this.players.update(list => list.map(p => (p.id === updated.id ? updated : p)));
        this.messageService.add({
          severity: 'success',
          summary: 'Роль оновлено',
          detail: `${updated.nickname} тепер "${this.roleLabel(updated.role)}".`,
        });
      },
      error: err => {
        roleModel.reset(player.role);
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: err?.error?.message ?? 'Не вдалося змінити роль гравця.',
        });
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.adminUsersService.getUsers(CLAN_ID).subscribe({
      next: players => {
        this.players.set(players);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося завантажити список гравців.',
        });
      },
    });
  }
}
