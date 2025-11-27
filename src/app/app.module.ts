import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Needed for Material

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { VacationComponent } from './components/vacation/vacation.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PreferencesComponent } from './components/preferences/preferences.component';

import { NotificationsComponent } from './components/notifications/notifications.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ add ReactiveFormsModule
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material modules
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field'; // ✅ add if using mat-form-field
import { MatInputModule } from '@angular/material/input'; // ✅ add if using mat-input

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    VacationComponent,
    EmployeeListComponent,
    EmployeeComponent,
    UpdateUserComponent,
    ProfileComponent,
    PreferencesComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, // ✅ for Material animations
    FormsModule,
    ReactiveFormsModule,     // ✅ for reactive forms
    RouterModule,
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,      // ✅ if you use <mat-form-field>
    MatInputModule,          // ✅ if you use <input matInput>
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
