import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, of, Subscription } from 'rxjs';
import { endpoints } from '../constants/endpoints';
import { EventInfo } from '../models/event-models';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private http = inject(HttpClient);

  private readonly activeEventSubject = new BehaviorSubject<EventInfo | null>(null);
  readonly activeEvent$: Observable<EventInfo | null> = this.activeEventSubject.asObservable();

  loading = true;

  private loadActiveEventSub: Subscription | undefined;

  getActiveEvent(): void {
    this.loadActiveEventSub?.unsubscribe();
    this.loading = true;

    this.loadActiveEventSub = this.http
      .get<EventInfo | null>(endpoints.events.active)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.loadActiveEventSub = undefined;
        }),
        catchError(err => {
          console.error('Помилка завантаження події:', err);
          this.loading = false;
          return of(null);
        }),
      )
      .subscribe(event => this.activeEventSubject.next(event));
  }
}
