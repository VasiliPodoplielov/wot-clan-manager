import { Component, OnInit } from '@angular/core'; // Як ми і домовлялися :)
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {
    this.items = [
      {
        label: 'Головна',
        icon: 'pi pi-home',
        command: () => this.navigateTo('/'),
      },
      {
        label: 'Гравці',
        icon: 'pi pi-users',
        command: () => this.navigateTo('/players'),
      },
      {
        label: 'Команди',
        icon: 'pi pi-shield',
        command: () => this.navigateTo('/teams'),
      },
      {
        label: 'Статистика',
        icon: 'pi pi-chart-bar',
        items: [
          { label: 'Маневри #1', icon: 'pi pi-history' },
          { label: 'Маневри #2', icon: 'pi pi-history' },
        ],
      },
    ];
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
