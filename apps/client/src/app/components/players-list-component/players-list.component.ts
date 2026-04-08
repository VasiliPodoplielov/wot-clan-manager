import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { WgRatingColorPipe } from '../../pipes/wg-rating.pipe';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';

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
    WgRatingColorPipe,
  ],
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss'],
})
export class PlayersListComponent implements OnInit, OnDestroy {
  userService = inject(UserService);
  users$ = this.userService.users$;

  ngOnInit() {
    this.userService.getUsers();
  }

  ngOnDestroy() {
    this.userService.cancelUsersRequest();
  }

  openTomatoGG(nickname: string, id: number) {
    window.open(`https://www.tomato.gg/stats/EU/${nickname}=${id}`, '_blank');
  }
}
