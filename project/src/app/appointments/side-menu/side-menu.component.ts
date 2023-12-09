import { Component } from '@angular/core';
import { AppointmentFormComponent } from '@appRoot/appointments/appointment-form/appointment-form.component';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  standalone: true,
  styleUrls: ['./side-menu.component.scss'],
  imports: [AppointmentFormComponent],
})
export class SideMenuComponent {}
