import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs'; // Основний модуль для табів
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ValidationErrorsDirective } from '../../directives/form-errors-text';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DividerModule,
    ReactiveFormsModule,
    TooltipModule,
    ValidationErrorsDirective,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  activeTab = signal(0);

  constructor() {
    effect(() => {
      this.activeTab();
      this.resetAllForms();
    });
  }

  loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  registrationForm = new FormGroup({
    nickname: new FormControl('', {
      validators: [Validators.required],
      updateOn: 'blur',
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      updateOn: 'blur',
    }),
  });

  ngOnDestroy(): void {
    this.resetAllForms();
  }

  onTabChange(value: number) {
    this.activeTab.set(value);
    this.resetAllForms();
  }

  resetAllForms() {
    this.loginForm.reset();
    this.registrationForm.reset();
    console.log('resetAllForms');
  }

  loginWithWG() {
    console.log('Redirecting to Wargaming OpenID...');
    // Тут буде лінк на твій бекенд, який редіректне на WG
  }

  loginWithGoogle() {
    console.log('Login with Google...');
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      const payload = {
        email: formValue.email!,
        password: formValue.password!,
      };

      this.authService.login(payload).subscribe({
        next: () => {
          this.loginForm.reset();
          this.router.navigate(['/']); //TODO: Use some internal page

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Вхід виконано успішно.',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            detail: 'Помилка при вході. Повторіть спробу або зверніться до офіцерів клану.',
          });
          console.error('Something went wrong: ', err);
        },
      });
    }
  }

  onRegistrationSubmit() {
    if (this.registrationForm.valid) {
      const formValue = this.registrationForm.value;
      const payload = {
        nickname: formValue.nickname!,
        email: formValue.email!,
        password: formValue.password!,
      };

      this.authService.register(payload).subscribe({
        next: (response) => {
          this.registrationForm.reset();
          this.activeTab.set(0);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Реєстрація пройдена успішно.',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            detail: 'Помилка при реєстрації. Повторіть спробу або зверніться до офіцерів клану.',
          });
          console.error('Something went wrong: ', err);
        },
      });
    }
  }

  loginWithWg(): void {
    window.location.href = 'http://localhost:3000/auth/wg/login';
  }
}
