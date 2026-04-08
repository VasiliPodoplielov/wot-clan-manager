export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData extends ILoginData {
  nickname: string;
}

export enum UserRole {
  MEMBER = 'member',
  OFFICER = 'officer',
  MODERATOR = 'moderator',
}
