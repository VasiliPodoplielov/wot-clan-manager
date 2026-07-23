import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, of, Subscription } from 'rxjs';
import { endpoints } from '../constants/endpoints';
import { UserInfo } from '../models/user-models';
import { CLAN_ID } from '../constants/clanData';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  private readonly usersSubject = new BehaviorSubject<UserInfo[] | null>(null);
  readonly users$: Observable<UserInfo[] | null> = this.usersSubject.asObservable();

  loading = true;

  private loadUsersSub: Subscription | undefined;

  getUsers(): void {
    this.loadUsersSub?.unsubscribe();
    this.loading = true;

    this.loadUsersSub = this.http
      .get<UserInfo[]>(endpoints.wargaming.clanMembers, {
        params: { clanId: CLAN_ID },
      })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.loadUsersSub = undefined;
        }),
        catchError(err => {
          console.error('Помилка завантаження:', err);
          this.loading = false;
          return of([]);
        }),
      )
      .subscribe(users => this.usersSubject.next(users));
  }

  /** Unsubscribe aborts the in-flight HTTP request (e.g. on route change). */
  cancelUsersRequest(): void {
    this.loadUsersSub?.unsubscribe();
    this.loadUsersSub = undefined;
  }
}
