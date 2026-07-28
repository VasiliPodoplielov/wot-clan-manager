import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ILoginData, IRegisterData } from '../components/login-component/login.models';
import { DecodedToken, UserRole } from '../models/auth-models';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/auth/auth.actions';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { endpoints } from '../constants/endpoints';

interface AuthResponse {
  access_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly TOKEN_STORAGE_KEY = 'access_token';

  private http = inject(HttpClient);
  private store = inject(Store);
  private messageService = inject(MessageService);

  currentUser = signal<DecodedToken | null>(null);

  isAdmin = computed(() => this.currentUser()?.role === UserRole.ADMIN);

  constructor() {
    const storedUser = this.getStoredUser();

    if (storedUser) {
      this.currentUser.set(storedUser);
      this.dispatchLoginSuccess(storedUser);
    }
  }

  private getStoredUser(): DecodedToken | null {
    const token =
      localStorage.getItem(AuthService.TOKEN_STORAGE_KEY) ?? localStorage.getItem('token');

    if (!token) {
      return null;
    }

    if (!localStorage.getItem(AuthService.TOKEN_STORAGE_KEY)) {
      localStorage.setItem(AuthService.TOKEN_STORAGE_KEY, token);
      localStorage.removeItem('token');
    }

    return jwtDecode<DecodedToken>(token);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_STORAGE_KEY);
  }

  login(credentials: ILoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(endpoints.auth.login, credentials).pipe(
      tap(({ access_token }) => {
        this.saveSession(access_token);
      }),
    );
  }

  register(data: IRegisterData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(endpoints.auth.register, data)
      .pipe(tap(({ access_token }) => this.saveSession(access_token)));
  }

  saveSession(token: string): void {
    localStorage.setItem(AuthService.TOKEN_STORAGE_KEY, token);
    localStorage.removeItem('token');

    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    this.currentUser.set(decoded);
    this.dispatchLoginSuccess(decoded);
  }

  private dispatchLoginSuccess(decoded: DecodedToken): void {
    this.store.dispatch(
      AuthActions.loginSuccess({
        user: {
          nickname: decoded.nickname,
          role: decoded.role,
          email: decoded.email,
        },
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_STORAGE_KEY);
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.store.dispatch(AuthActions.logout());

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Вихід виконано успішно.',
    });
  }
}
