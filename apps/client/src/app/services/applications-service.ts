import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { endpoints } from '../constants/endpoints';
import { ApplicationInfo, SubmitApplicationPayload } from '../models/application-models';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  submit(payload: SubmitApplicationPayload): Observable<ApplicationInfo> {
    return this.http.post<ApplicationInfo>(endpoints.applications.create, payload, {
      headers: this.authHeaders(),
    });
  }

  checkMine(eventId: number): Observable<ApplicationInfo | null> {
    return this.http
      .get<ApplicationInfo | null>(endpoints.applications.mine, {
        params: { eventId },
        headers: this.authHeaders(),
      })
      .pipe(
        catchError(err => {
          // Ендпоінт завжди повертає 200 з `null`, коли заявки немає — тож будь-яка
          // помилка тут (401/403/мережа/5xx) реальна, і її треба хоча б залогувати,
          // а не мовчки видавати за "заявки немає".
          console.error('Не вдалося перевірити статус заявки:', err);
          return of(null);
        }),
      );
  }

  private authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
