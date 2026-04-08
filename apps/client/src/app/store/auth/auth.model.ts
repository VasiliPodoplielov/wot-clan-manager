export interface AuthState {
  user: { nickname: string; role: string; email: string } | null;
  isAuthenticated: boolean;
}
