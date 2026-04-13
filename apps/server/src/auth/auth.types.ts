import { UserRole } from 'src/users/user.models';
import { User } from 'src/users/entities/user.entity';

export interface RegisterDto {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface WargamingCallbackParams {
  access_token: string;
  account_id: string;
  nickname: string;
  status: string;
  expires_at?: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  sub: number;
  nickname: string;
  role: UserRole;
  email?: string;
  wgAccountId?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  role: UserRole;
}

export interface AuthTokenResponse {
  access_token: string;
  user: AuthUser;
}

export interface WargamingAuthResponse {
  token: string;
  user: User;
}

export interface AuthJwtPayload {
  sub: number;
  nickname: string;
  role: UserRole;
  email?: string;
  wgAccountId?: string;
}
