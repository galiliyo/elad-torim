import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AppointmentsService } from '@appRoot/services/appointments.service';
import { UsersService } from '@appRoot/services/users.service';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Session } from '@appRoot/types/session.interface';
import { Appointment } from '@appRoot/types/appointment.interface';
import { SideMenuComponent } from '@appRoot/appointments/side-menu/side-menu.component';
import { AppointmentsListComponent } from '@appRoot/appointments/appointments-list/appointments-list.component';
import { HeaderComponent } from '@appRoot/appointments/header/header.component';

@Component({
  selector: 'app-appointments$',
  templateUrl: './appointments.component.html',
  standalone: true,
  styleUrls: ['./appointments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SideMenuComponent, AppointmentsListComponent, HeaderComponent],
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  sortedAppointments$: Observable<Appointment[]> | null = null;
  private readonly appointmentsService: AppointmentsService =
    inject(AppointmentsService);
  private readonly usersService = inject(UsersService);
  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    // I can subscribe to the session and also get a static value of it with a getter
    this.usersService.userSession$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userSession: Session) => {
        if (userSession?.user?.userName) {
          this.appointmentsService.loadUserAppointments(
            userSession.user.userName,
          );
        }
      });

    this.sortedAppointments$ = this.appointmentsService.userAppointments$.pipe(
      map((appointments: Appointment[]) => {
        // Sort the appointments$ by the 'date' field
        if (Array.isArray(appointments) && appointments.length) {
          return appointments.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
          });
        } else return [];
      }),
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
