import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ILoginData, IRegisterData } from '../components/login-component/login.models';
import { DecodedToken, UserRole } from '../models/auth-models';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/auth/auth.actions';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private store = inject(Store);
  private messageService = inject(MessageService);
  private readonly API_URL = 'http://localhost:3000/auth';

  currentUser = signal<DecodedToken | null>(this.getStoredUser());

  isModerator = computed(() => this.currentUser()?.role === UserRole.MODERATOR);
  isOfficer = computed(() => this.currentUser()?.role === UserRole.OFFICER || this.isModerator());

  private getStoredUser(): DecodedToken | null {
    const token = localStorage.getItem('token');
    return token ? jwtDecode<DecodedToken>(token) : null;
  }

  login(credentials: any) {
    return this.http.post<{ access_token: string }>(`${this.API_URL}/login`, credentials).pipe(
      tap(({ access_token }) => {
        this.saveSession(access_token);
      }),
    );
  }

  register(data: IRegisterData): Observable<any> {
    return this.http
      .post(`${this.API_URL}/register`, data)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  saveSession(token: string) {
    localStorage.setItem('token', token);
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);

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

  private handleAuth(response: any) {
    if (response.token) {
      localStorage.setItem('access_token', response.token);
      this.currentUser.set(response.user);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.store.dispatch(AuthActions.logout());

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Вихід виконано успішно.',
    });
  }
}
