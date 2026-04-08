import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appValidationErrors]',
  standalone: true,
})
export class ValidationErrorsDirective implements OnInit, OnDestroy {
  private statusSub?: Subscription;
  private errorElement?: HTMLElement;

  private errorMessages: Record<string, (args: any) => string> = {
    required: () => 'Це поле є обов’язковим',
    email: () => 'Невірний формат email',
    minlength: (args) => `Мінімум символів: ${args.requiredLength}`,
  };

  constructor(
    private el: ElementRef,
    private control: NgControl,
    private renderer: Renderer2,
  ) {}

  @HostListener('blur')
  onBlur() {
    this.updateErrorMessage();
  }

  @HostListener('focus')
  onFocus() {
    this.removeError();
  }

  ngOnInit() {
    this.statusSub = this.control.statusChanges?.subscribe(() => {
      const control = this.control.control;
      if (control?.pristine) {
        this.removeError();
      }
    });
  }

  private updateErrorMessage() {
    const errors = this.control.errors;

    if (!errors || (this.control.pristine && !this.control.touched)) {
      this.removeError();
      return;
    }

    const firstErrorKey = Object.keys(errors)[0];
    const message = this.errorMessages[firstErrorKey]
      ? this.errorMessages[firstErrorKey](errors[firstErrorKey])
      : 'Помилка валідації';

    this.setError(message);
  }

  private setError(message: string) {
    this.removeError();

    this.errorElement = this.renderer.createElement('small');
    this.renderer.addClass(this.errorElement, 'text-red-500');
    this.renderer.addClass(this.errorElement, 'block');
    this.renderer.addClass(this.errorElement, 'mt-1');

    const text = this.renderer.createText(message);
    this.renderer.appendChild(this.errorElement, text);

    this.renderer.appendChild(this.el.nativeElement.parentElement, this.errorElement);
  }

  private removeError() {
    if (this.errorElement) {
      this.renderer.removeChild(this.el.nativeElement.parentElement, this.errorElement);
      this.errorElement = undefined;
    }
  }

  ngOnDestroy() {
    this.statusSub?.unsubscribe();
  }
}
