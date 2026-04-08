import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { endpoints } from '../../constants/endpoints';
import {
  catchError,
  finalize,
  firstValueFrom,
  Observable,
  of,
  shareReplay,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

interface Player {
  accountId: number;
  nickname: string;
  role: string;
  wgRating: number;
  winRate: string;
  battles: number;
}

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
  ],
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss'],
})
export class PlayersListComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();
  players$: Observable<Player[]> = of([]);
  loading = true;

  ngOnInit() {
    this.loading = true;

    this.players$ = this.http
      .get<Player[]>(endpoints.wargaming.clanMembers, {
        params: { clanId: 500311453 },
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
        }),
        catchError(err => {
          console.error('Помилка завантаження:', err);
          this.loading = false;
          return of([]);
        }),
      );
  }

  getWn8Color(wn8: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    if (wn8 >= 2900) return 'success'; // Фіолетовий/Темно-зелений
    if (wn8 >= 1600) return 'info'; // Зелений/Синій

    return 'warn'; // Жовтий/Червоний
  }

  openTomatoGG(nickname: string, id: number) {
    window.open(`https://www.tomato.gg/stats/EU/${nickname}=${id}`, '_blank');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
