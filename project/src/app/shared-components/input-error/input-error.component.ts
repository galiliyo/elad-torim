import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import { VALIDATION_ERROR_MESSAGES } from './validation-error-messages.token';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="showErrors">
      <div *ngFor="let error of errors! | keyvalue" class="input-error">
        {{ errorsMap[error.key] }}
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        font-size: 0.8rem;
        color: red;
        display: inline-block;
      }
    `,
  ],
})
export class InputErrorComponent {
  @Input()
  errors: ValidationErrors | undefined | null = {};
  @Input({ required: true }) showErrors: boolean | undefined = false;
  protected errorsMap = inject(VALIDATION_ERROR_MESSAGES);
}
