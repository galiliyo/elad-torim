import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { UsersService } from '@appRoot/services/users.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export function userNameValidator(
  usersService: UsersService,
): AsyncValidatorFn {
  return (
    control: AbstractControl,
  ): Observable<{ [key: string]: any } | null> => {
    return usersService.getAllUsers().pipe(
      map((allUsers) => {
        const user = allUsers.find(
          (u) => control.value.toLowerCase() === u.userName.toLowerCase(),
        );
        return user ? null : { userDoesNotExist: true };
      }),
      catchError(() => of(null)),
    );
  };
}
