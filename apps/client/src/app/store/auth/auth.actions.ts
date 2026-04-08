import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Success': props<{ user: { nickname: string; role: string; email: string } }>(),
    Logout: emptyProps(),
  },
});
