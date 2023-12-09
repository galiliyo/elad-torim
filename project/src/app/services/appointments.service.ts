import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { Appointment } from '@appRoot/types/appointment.interface';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  @Injectable({
    providedIn: 'root',
  })
  httpClient = inject(HttpClient);
  private _unsubscribe$ = new Subject<void>();

  private _userAppointments = new BehaviorSubject<Appointment[] | null>(null);
  public userAppointments$ = this._userAppointments as Observable<
    Appointment[]
  >;

  loadUserAppointments(userName: string): void {
    const url = `${environment.baseUrl}/appointments?userName=${userName}`;

    this.httpClient
      .get<Appointment[]>(url)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((appointments) => this._userAppointments.next(appointments));
  }

  deleteAppointment(userName: string, id: number) {
    const url = `${environment.baseUrl}/appointments/${id}`;

    this.httpClient
      .delete(url)
      .pipe(
        tap(() => {
          this.loadUserAppointments(userName);
          console.log('Appointment deleted successfully.');
        }),
        catchError((error) => {
          console.error('Error deleting appointment:', error);
          throw error;
        }),
      )
      .subscribe();
  }

  updateAppointment(userName: string, appointment: Appointment, id: number) {
    const url = `${environment.baseUrl}/appointments/${id}`;
    return this.httpClient.put(url, appointment).pipe(
      tap(() => {
        this.loadUserAppointments(userName);
      }),
    );
  }

  submitAppointment(userName: string, appointment: Appointment) {
    const url = `${environment.baseUrl}/appointments`;
    return this.httpClient.post(url, appointment).pipe(
      tap(() => {
        // Load user appointments after a successful POST
        this.loadUserAppointments(userName);
      }),
    );
  }
}
