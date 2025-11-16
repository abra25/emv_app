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
  {path:'',component:LoginComponent},
  {
    path: 'https://emplyeevacation.netlify.app/admin',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'https://emplyeevacation.netlify.app/dashboard', component: EmployeeListComponent },  
      { path: 'https://emplyeevacation.netlify.app/employees', component: EmployeeListComponent },
      { path: 'https://emplyeevacation.netlify.app/vacation', component: VacationComponent }
    ]
  },
  {path:'https://emplyeevacation.netlify.app/employee',component:EmployeeComponent},
  {path:'https://emplyeevacation.netlify.app/register',component:RegisterComponent},
  { path: 'https://emplyeevacation.netlify.app/update-user/:id', component: UpdateUserComponent },
  { path: '**', redirectTo: '' } ,// Wildcard route for a 404 page 
  { path: 'https://emplyeevacation.netlify.app/profile', component:ProfileComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
