export enum UserRole {
  MEMBER = 'member',
  OFFICER = 'officer',
  MODERATOR = 'moderator',
}

export interface DecodedToken {
  sub: number;
  wgAccountId: string;
  nickname: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
