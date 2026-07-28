import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlayersListComponent } from './components/players-list-component/players-list.component';
import { LoginComponent } from './components/login-component/login.component';
import { AdminPlayersListComponent } from './components/admin-players-list/admin-players-list.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'players', component: PlayersListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/players', component: AdminPlayersListComponent, canActivate: [adminGuard] },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./components/auth-callback-component/auth-callback.component').then(
        m => m.AuthCallbackComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
