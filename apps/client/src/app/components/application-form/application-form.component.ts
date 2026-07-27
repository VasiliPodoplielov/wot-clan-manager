import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { ApplicationsService } from '../../services/applications-service';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';

export interface ApplicationFormValue {
  isReadyForPrime: boolean;
  canLead: boolean;
  additionalInfo: string;
}

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    CheckboxModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './application-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);

  readonly eventId = input.required<number>();
  readonly eventName = input('Маневри');
  readonly eventStartDate = input('DD.MM.YYYY');
  readonly eventEndDate = input('DD.MM.YYYY');
  readonly primeTime = input('21:00 - 23:00');

  readonly applicationSubmitted = output<ApplicationFormValue>();

  readonly isLoggedIn = this.store.selectSignal(selectIsAuthenticated);
  readonly alreadyApplied = signal(false);

  readonly submitting = signal(false);
  readonly submitAttempted = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    isReadyForPrime: [false, Validators.requiredTrue],
    canLead: [false],
    additionalInfo: [''],
  });

  readonly isReadyForPrime = toSignal(this.form.controls.isReadyForPrime.valueChanges, {
    initialValue: this.form.controls.isReadyForPrime.getRawValue(),
  });

  readonly canSubmit = computed(() => this.isReadyForPrime() && !this.submitting());

  readonly showReadyError = computed(() => {
    const control = this.form.controls.isReadyForPrime;
    return control.invalid && (control.touched || control.dirty || this.submitAttempted());
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    toObservable(computed(() => ({ eventId: this.eventId(), isLoggedIn: this.isLoggedIn() })))
      .pipe(
        switchMap(({ eventId, isLoggedIn }) =>
          isLoggedIn ? this.applicationsService.checkMine(eventId) : of(null),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(application => this.alreadyApplied.set(!!application));
  }

  async onSubmit(): Promise<void> {
    this.submitAttempted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.getRawValue();

    this.applicationsService
      .submit({ eventId: this.eventId(), ...formValue })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.applicationSubmitted.emit(formValue);
          this.alreadyApplied.set(true);
          this.form.reset({
            isReadyForPrime: false,
            canLead: false,
            additionalInfo: '',
          });
          this.submitAttempted.set(false);
          this.submitting.set(false);
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Помилка',
            detail: err?.error?.message ?? 'Не вдалося надіслати заявку. Спробуйте пізніше.',
          });
          this.submitting.set(false);
        },
      });
  }
}
