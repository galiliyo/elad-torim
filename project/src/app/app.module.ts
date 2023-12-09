import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SideMenuComponent } from './appointments/side-menu/side-menu.component';
import { AppointmentsListComponent } from './appointments/appointments-list/appointments-list.component';
import { StackComponent } from './shared-components/stack/stack.component';
import { AppointmentCardComponent } from '@appRoot/appointments/appointment-card/appointment-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentFormComponent } from '@appRoot/appointments/appointment-form/appointment-form.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginPageComponent,
    StackComponent,
    AppointmentCardComponent,
    BrowserAnimationsModule,
    MatNativeDateModule,
    AppointmentsListComponent,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    AppointmentFormComponent,
    SideMenuComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
