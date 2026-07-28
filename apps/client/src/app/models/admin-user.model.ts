import { UserRole } from './auth-models';

export interface AdminUser {
  id: number;
  nickname: string;
  email: string | null;
  wgAccountId: string | null;
  role: UserRole;
  wgRole: string | null;
  createdAt: string;
}
