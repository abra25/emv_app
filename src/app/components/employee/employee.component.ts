import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../model/User';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AutoLogoutService } from '../../services/auto-logout.service';
import { VacationService } from '../../services/vacation.service';
import { Vacation } from '../../model/Vacation';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-employee',
  standalone: false,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']  // corrected "styleUrl" to "styleUrls"
})
export class EmployeeComponent implements OnInit, OnDestroy {
  activeTab: string = 'dashboard';
  sidebarOpen = true;
  userVacations: Vacation[] = [];
  vacation: Vacation = new Vacation();
  currentUser!: User;
  currentDate: string = '';

  constructor(
    private userService: UserService,private router: Router, 
    private autoLogoutService: AutoLogoutService,
    private vacationService: VacationService
  ) {}

  ngOnInit(): void {
    this.autoLogoutService.startWatching();

    // ✅ Load current user first
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.currentUser = JSON.parse(userString) as User;
    } else {
      alert('User not logged in.');
      this.router.navigate(['']);
      return;
    }

    this.vacation.user = this.currentUser;

    // ✅ Then safely load user vacations
    this.loadUserVacations();

    const today = new Date();
    this.currentDate = today.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Tab selection logic
  setActiveTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'myrequests') {
      this.fetchMyVacations();
    }
  }

  fetchMyVacations() {
    if (!this.currentUser?.id) return;

    this.vacationService.getVacationsByUserId(this.currentUser.id).subscribe({
      next: (res) => {
        this.userVacations = res;
      },
      error: (err) => {
        console.error('Error loading vacation requests:', err);
      }
    });
  }
  resetForm() {
  this.vacation = {
    vcnId: null as any, // Use undefined to allow auto-increment
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending',
    user: { id: this.currentUser.id },
    totalDays: 0
  };
}

  submitRequest() {
  if (!this.currentUser?.id) return;

  const payload: Vacation = {
    startDate: this.vacation.startDate,
    endDate: this.vacation.endDate,
    reason: this.vacation.reason,
    status: 'pending',
    user: { id: this.currentUser.id },
    totalDays: this.getDays(this.vacation.startDate, this.vacation.endDate)
  };

  this.vacationService.newVacation(payload).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Request Submitted!',
        text: 'Your vacation request has been sent successfully.',
      });
      this.resetForm();
    },
    error: (err) => {
      console.error("Vacation submission failed", err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Could not submit your request. Try again.',
      });
    }
  });
}



  loadUserVacations(): void {
    if (!this.currentUser?.id) return;

    this.vacationService.getVacationsByUserId(this.currentUser.id).subscribe({
      next: (vacations) => {
        this.userVacations = vacations;
      },
      error: (err) => {
        console.error('Failed to load user vacations:', err);
      }
    });
  }

  getDays(start: string, end: string): number {
    const from = new Date(start);
    const to = new Date(end);
    const diff = Math.abs(to.getTime() - from.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  cancelVacation(vcnId: number): void {
  Swal.fire({
    title: 'Cancel Request?',
    text: 'Are you sure you want to cancel this vacation request?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, cancel it'
  }).then((result) => {
    if (result.isConfirmed) {
      
      this.vacationService.deleteVacation(vcnId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Canceled',
            text: 'Vacation request has been canceled.',
          });
          this.loadUserVacations();
        },
        error: (err) => {
          console.error('Cancel failed:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to cancel vacation.',
          });
        }
      });

    }
  });
}


  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    this.autoLogoutService.stopWatching();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  
}
