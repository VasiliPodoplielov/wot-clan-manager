import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { Component, OnInit } from '@angular/core';

interface Player {
  id: number;
  nickname: string;
  role: string;
  wn8: number;
  winrate: string;
  battles: number;
  lastSeen: string;
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
export class PlayersListComponent implements OnInit {
  players: Player[] = [];
  loading = true;

  ngOnInit() {
    // Тимчасові дані (Mock data) для візуалізації
    this.players = [
      {
        id: 12345,
        nickname: 'Tankist_UA',
        role: 'Commander',
        wn8: 2450,
        winrate: '56%',
        battles: 25000,
        lastSeen: '2024-05-20',
      },
      {
        id: 67890,
        nickname: 'Cyber_Cossack',
        role: 'Soldier',
        wn8: 1850,
        winrate: '52%',
        battles: 12000,
        lastSeen: '2024-05-21',
      },
      {
        id: 11223,
        nickname: 'Steel_Rain',
        role: 'Officer',
        wn8: 3100,
        winrate: '61%',
        battles: 45000,
        lastSeen: '2024-05-21',
      },
    ];

    this.loading = false;
  }

  getWn8Color(wn8: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    if (wn8 >= 2900) return 'success'; // Фіолетовий/Темно-зелений
    if (wn8 >= 1600) return 'info'; // Зелений/Синій

    return 'warn'; // Жовтий/Червоний
  }

  openTomatoGG(nickname: string, id: number) {
    window.open(`https://www.tomato.gg/stats/EU/${nickname}=${id}`, '_blank');
  }
}
