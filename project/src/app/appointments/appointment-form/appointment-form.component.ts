import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DoctorsService } from '@appRoot/services/doctors.service';
import { AppointmentsService } from '@appRoot/services/appointments.service';
import { UsersService } from '@appRoot/services/users.service';
import { Subject } from 'rxjs';
import { Appointment } from '@appRoot/types/appointment.interface';
import { takeUntil } from 'rxjs/operators';

const officeHours = {
  start: 9,
  end: 17,
  interval: 30,
};

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  standalone: true,
  styleUrls: ['./appointment-form.component.scss'],
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    NgForOf,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
  ],
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  @Input() isEditMode = false;
  @Input() appointment: Appointment | null = null;
  @Output() onCancel = new EventEmitter<void>();

  fb = inject(FormBuilder);
  doctorsService = inject(DoctorsService);
  appointmentsService = inject(AppointmentsService);
  usersService = inject(UsersService);
  timeSlots = this.generateTimeSlots();
  maxCharCount = 70;
  appointmentForm = this.fb.group({
    doctor: [0, Validators.required],
    date: [new Date(), Validators.required],
    time: ['', Validators.required],
    comments: ['', [Validators.maxLength(this.maxCharCount)]],
  });
  todayDate: Date = new Date();
  contextualStrings = { windowTitle: '', submitBtnLabel: '' };

  private session = this.usersService.session;
  private _unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.contextualStrings = {
      windowTitle: this.isEditMode ? 'עריכת תור' : 'תור חדש',
      submitBtnLabel: this.isEditMode ? 'שמירה' : 'זימון תור',
    };

    if (this.isEditMode && this.appointment) {
      this.patchFormValues(this.appointment);
    }
  }

  patchFormValues(appointment: Appointment): void {
    this.appointmentForm?.patchValue({
      doctor: +appointment.docId,
      date: new Date(appointment.date),
      time: this.getTimeFromIsoDate(appointment.date),
      comments: appointment.info,
    });
  }

  generateTimeSlots(): string[] {
    const timeSlots: string[] = [];
    const startTime = officeHours.start * 60; // 09:00 in minutes
    const endTime = officeHours.end * 60; // 16:00 in minutes
    const interval = officeHours.interval; // Time slot interval in minutes

    for (let time = startTime; time <= endTime; time += interval) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}`;
      timeSlots.push(formattedTime);
    }

    return timeSlots;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  getTimeFromIsoDate(isoDate: string): string {
    const date = new Date(isoDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${this.padZero(hours)}:${this.padZero(minutes)}`;
  }

  submitForm(): void {
    if (!this.appointmentForm!.valid) {
      console.log('Form is invalid. Please fill in all required fields.');
      return;
    }
    const { doctor, date, time, comments } = this.appointmentForm.value;
    const isoDateTime = this.getIsoDateTime(date!, time!);

    const appointmentData: Appointment = {
      userName: this.session!.user.userName,
      docId: doctor!,
      date: isoDateTime,
      info: comments || '',
    };

    if (this.isEditMode) {
      this.appointmentsService
        .updateAppointment(
          this.session?.user.userName!,
          appointmentData,
          this.appointment!.id!,
        )
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe(() => this.onCancelClick());
    } else {
      this.appointmentsService
        .submitAppointment(this.session!.user.userName, appointmentData)
        .subscribe(() => this.resetForm());
    }
  }

  resetForm() {
    this.appointmentForm?.reset();
    this.appointmentForm?.markAsPristine();
    Object.values(this.appointmentForm!.controls).forEach((control) => {
      control.markAsPristine();
    });
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private getIsoDateTime(date: Date, time: string): string {
    const combinedDate = new Date(date);
    const [hours, minutes] = time.split(':');
    combinedDate.setHours(parseInt(hours, 10));
    combinedDate.setMinutes(parseInt(minutes, 10));

    return combinedDate.toISOString();
  }
}
