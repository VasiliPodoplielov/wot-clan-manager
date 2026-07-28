import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from '../constants/endpoints';
import { AdminUser } from '../models/admin-user.model';
import { UserRole } from '../models/auth-models';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getUsers(clanId: number): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(endpoints.users.list, {
      params: { clanId },
      headers: this.authHeaders(),
    });
  }

  updateRole(id: number, role: UserRole): Observable<AdminUser> {
    return this.http.patch<AdminUser>(
      endpoints.users.updateRole(id),
      { role },
      { headers: this.authHeaders() },
    );
  }

  private authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
