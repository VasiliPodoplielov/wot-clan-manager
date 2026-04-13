import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

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

  readonly eventName = input('Маневри');
  readonly eventStartDate = input('DD.MM.YYYY');
  readonly eventEndDate = input('DD.MM.YYYY');
  readonly primeTime = input('21:00 - 23:00');

  readonly applicationSubmitted = output<ApplicationFormValue>();

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

  async onSubmit(): Promise<void> {
    this.submitAttempted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    try {
      await Promise.resolve();

      this.applicationSubmitted.emit(this.form.getRawValue());
      this.form.reset({
        isReadyForPrime: false,
        canLead: false,
        additionalInfo: '',
      });
      this.submitAttempted.set(false);
    } finally {
      this.submitting.set(false);
    }
  }
}
