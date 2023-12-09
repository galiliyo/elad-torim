import { Component, inject } from '@angular/core';
import { UsersService } from '@appRoot/services/users.service';
import { StackComponent } from '@appRoot/shared-components/stack/stack.component';
import {
  AsyncPipe,
  DatePipe,
  NgIf,
  NgStyle,
  TitleCasePipe,
} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: ['./header.component.scss'],
  imports: [StackComponent, TitleCasePipe, DatePipe, AsyncPipe, NgIf, NgStyle],
})
export class HeaderComponent {
  userService = inject(UsersService);
  router = inject(Router);

  logout() {
    this.userService.logOut();
    this.router.navigate(['/']);
  }
}
