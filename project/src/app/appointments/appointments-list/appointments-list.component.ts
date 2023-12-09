import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Appointment } from '@appRoot/types/appointment.interface';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { DoctorsService } from '@appRoot/services/doctors.service';
import { AppointmentCardComponent } from '@appRoot/appointments/appointment-card/appointment-card.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PreventClickOutsideDirective } from '@appRoot/directives/prevent-click-outside.directive';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  standalone: true,
  styleUrls: ['./appointments-list.component.scss'],
  imports: [
    MatSelectModule,
    AppointmentCardComponent,
    AsyncPipe,
    NgForOf,
    NgIf,
    MatProgressSpinnerModule,
    PreventClickOutsideDirective,
  ],
})
export class AppointmentsListComponent implements OnInit, OnDestroy {
  @Input() appointments$: Observable<Appointment[]> | null = null;
  doctorsService = inject(DoctorsService);
  filteredAppointments$: Observable<Appointment[]> | null = new Observable<
    Appointment[]
  >();
  private _selectedDoctorIdSubject$ = new BehaviorSubject<number | null>(-1);
  selectedDoctorId$: Observable<number | null> =
    this._selectedDoctorIdSubject$.asObservable();
  private unsubscribe$ = new Subject<void>();
  constructor() {
    this._selectedDoctorIdSubject$.next(-1);
  }
  ngOnInit() {
    // Combine the selectedDoctorId$ with the appointments$ to create filteredAppointments$
    this.filteredAppointments$ = this.selectedDoctorId$!.pipe(
      switchMap((selectedDoctorId) =>
        this.appointments$!.pipe(
          map((appointments) => {
            // Check if a doctor is selected
            if (selectedDoctorId === null || selectedDoctorId === -1) {
              // If no doctor is selected, return all appointments
              return appointments;
            } else {
              // If a doctor is selected, filter appointments by doctor ID
              return appointments.filter(
                (appointment) => appointment.docId === selectedDoctorId,
              );
            }
          }),
        ),
      ),
      // Unsubscribe when the component is destroyed
      takeUntil(this.unsubscribe$),
    );
  }

  trackByFn(index: number, item: Appointment) {
    return item.id;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectDoctor(event: MatSelectChange) {
    this._selectedDoctorIdSubject$.next(parseInt(event.value));
  }
}
