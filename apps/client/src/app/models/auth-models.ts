export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export interface DecodedToken {
  sub: number;
  wgAccountId: string;
  nickname: string;
  email?: string;
  role: UserRole;
  iat: number;
  exp: number;
}
