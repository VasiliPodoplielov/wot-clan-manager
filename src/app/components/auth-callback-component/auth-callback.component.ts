import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.saveSession(token);
      this.router.navigate(['/']);
    } else {
      console.error('Токен не знайдено в URL');
      this.router.navigate(['/login']);
    }
  }
}
