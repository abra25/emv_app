import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { VacationComponent } from './components/vacation/vacation.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', component: LoginComponent },

  {
    path: 'admin',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EmployeeListComponent },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'vacation', component: VacationComponent }
    ]
  },

  { path: 'employee', component: EmployeeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'update-user/:id', component: UpdateUserComponent },
  { path: 'profile', component: ProfileComponent },

  { path: '**', redirectTo: '' } // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
