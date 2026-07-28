import { IsEnum } from 'class-validator';
import { UserRole } from './user.models';
import { User } from './entities/user.entity';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

// Адмінська форма гравця для GET /users — без password.
export class UserAdminDto {
  id: number;
  nickname: string;
  email: string | null;
  wgAccountId: string | null;
  role: UserRole;
  wgRole: string | null; // WG-звання, інформаційне, не впливає на права доступу
  createdAt: Date;

  static fromEntity(user: User, wgRole: string | null = null): UserAdminDto {
    const dto = new UserAdminDto();
    dto.id = user.id;
    dto.nickname = user.nickname;
    dto.email = user.email;
    dto.wgAccountId = user.wgAccountId;
    dto.role = user.role;
    dto.wgRole = wgRole;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
