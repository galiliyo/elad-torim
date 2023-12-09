import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '@appRoot/services/users.service';
import { HttpClientModule } from '@angular/common/http';
import { userNameValidator } from '@appRoot/validators/user-name.vaidator';
import { CardComponent } from '@appRoot/shared-components/card/card.component';
import { ButtonComponent } from '@appRoot/shared-components/button/button.component';
import { StackComponent } from '@appRoot/shared-components/stack/stack.component';
import { InputErrorComponent } from '@appRoot/shared-components/input-error/input-error.component';
import { JsonPipe, NgClass } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CardComponent,
    ButtonComponent,
    StackComponent,
    InputErrorComponent,
    JsonPipe,
    NgClass,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnDestroy {
  fb = inject(FormBuilder);
  router = inject(Router);
  usersService = inject(UsersService);
  login = this.fb.group({
    userName: [
      '',
      {
        validators: [Validators.required],
        asyncValidators: [userNameValidator(this.usersService)],
        updateOn: 'blur',
      },
    ],
  });
  private unsubscribe$ = new Subject<void>();

  get showUserNameErrors(): boolean {
    const control = this.login.get('userName');
    return Boolean(control?.errors && (control?.touched || control?.dirty));
  }

  loginUser() {
    const userName = this.login.get('userName')?.value;
    if (!userName) {
      return;
    }
    this.usersService
      .login(userName)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigate(['appointments']);
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
