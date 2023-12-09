import { InjectionToken } from '@angular/core';

export const ERROR_MESSAGES: { [key: string]: string } = {
  required: `שדה חובה`,
  minlength: `אורך קצת מדי`,
  pattern: `פורמט לא נכון`,
  userDoesNotExist: `משתמש לא נמצא`,
};

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(
  `Validation Messages`,
  {
    providedIn: 'root',
    factory: () => ERROR_MESSAGES,
  },
);
