import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlayersListComponent } from './components/players-list-component/players-list.component';
import { LoginComponent } from './components/login-component/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'players', component: PlayersListComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
