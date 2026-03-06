import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);

export const selectUser = createSelector(selectAuthState, (state) => state.user);

export const selectNickname = createSelector(selectUser, (user) => user?.nickname || '');

export const selectUserRole = createSelector(selectUser, (user) => user?.role);
