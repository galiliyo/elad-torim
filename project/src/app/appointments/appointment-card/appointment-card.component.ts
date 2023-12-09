import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@appRoot/shared-components/card/card.component';
import { Appointment } from '@appRoot/types/appointment.interface';
import { MatIconModule } from '@angular/material/icon';
import { StackComponent } from '@appRoot/shared-components/stack/stack.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentsService } from '@appRoot/services/appointments.service';
import { MatCardModule } from '@angular/material/card';
import { DoctorsService } from '@appRoot/services/doctors.service';
import { AppointmentFormComponent } from '@appRoot/appointments/appointment-form/appointment-form.component';
import { PreventClickOutsideDirective } from '@appRoot/directives/prevent-click-outside.directive';

const defaultAppointment = {
  userName: '',
  docId: 0,
  date: '',
  info: '',
  id: 0,
};

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    MatIconModule,
    StackComponent,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    AppointmentFormComponent,
    PreventClickOutsideDirective,
  ],
  templateUrl: './appointment-card.component.html',
  styleUrls: ['./appointment-card.component.scss'],
})
export class AppointmentCardComponent implements OnInit {
  @Input({ required: true }) appointment: Appointment = defaultAppointment;

  isEditMode = false;
  fb = inject(FormBuilder);
  doctorsService = inject(DoctorsService);
  appointmentsService = inject(AppointmentsService);

  date = '';

  form = this.fb.group({
    date: [new Date()],
    time: [''],
    comment: [''],
  });
  protected doctorName = '';
  editModeOn() {
    this.isEditMode = true;
  }
  ngOnInit() {
    if (this.appointment) {
      this.date = this.appointment.date.split('T')[0];
      this.form.controls.date.setValue(new Date(this.appointment!.date));
      this.form.controls.time.setValue(
        new Date(this.appointment!.date).toTimeString(),
      );
    }

    this.doctorsService
      .getDoctorNameById(this.appointment.docId as number)
      .subscribe((doctorName: string) => {
        this.doctorName = doctorName;
      });
  }

  getDateString(date: Date, time: string): string {
    // Parse the time string to a Date object
    const timeDate = new Date(`1970-01-01T${time}`);

    // Combine the date and time into a single Date object
    const combinedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      timeDate.getHours(),
      timeDate.getMinutes(),
      timeDate.getSeconds(),
      timeDate.getMilliseconds(),
    );

    // Format the combined Date object to ISO format
    return combinedDate.toISOString();
  }
  deleteAppointment() {
    this.appointmentsService.deleteAppointment(
      this.appointment!.userName,
      this.appointment!.id!,
    );
  }

  onCancel() {
    this.isEditMode = false;
  }
}
