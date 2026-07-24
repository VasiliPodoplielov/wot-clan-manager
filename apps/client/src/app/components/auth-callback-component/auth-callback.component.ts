import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './auth-callback.component.html',
})
export class AuthCallbackComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    const fragment = this.route.snapshot.fragment ?? '';
    const params = new URLSearchParams(fragment);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      this.authService.saveSession(token);
      this.router.navigate(['/']);
      return;
    }

    console.error('Помилка входу через Wargaming:', error ?? 'токен не знайдено в URL');
    this.messageService.add({
      severity: 'error',
      summary: 'Помилка входу',
      detail: 'Не вдалося увійти через Wargaming. Спробуйте ще раз.',
    });
    this.router.navigate(['/login']);
  }
}
