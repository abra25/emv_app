import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../model/User';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AutoLogoutService } from '../../services/auto-logout.service';
import { VacationService } from '../../services/vacation.service';
import { Vacation } from '../../model/Vacation';

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
     // Use null to allow auto-increment
    startDate: this.vacation.startDate,
    endDate: this.vacation.endDate,
    reason: this.vacation.reason,
    status: 'pending' as 'pending',  
    user: { id: this.currentUser.id },
    totalDays: this.getDays(this.vacation.startDate, this.vacation.endDate)
  };

  this.vacationService.newVacation(payload).subscribe({
    next: () => {
      alert("Vacation request submitted successfully");
      // optionally reset the form
    },
    error: (err) => {
      console.error("Vacation submission failed", err);
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
    if (confirm('Are you sure you want to cancel this vacation request?')) {
      this.vacationService.deleteVacation(vcnId).subscribe({
        next: () => {
          alert('Vacation submission canceled.');
          this.loadUserVacations(); // Refresh the list
        },
        error: (err) => {
          console.error('Cancel failed:', err);
          alert('Failed to cancel vacation.');
        }
      });
    }
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
