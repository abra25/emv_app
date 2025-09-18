import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { User } from '../../model/User';
import { Vacation } from '../../model/Vacation';

import { AutoLogoutService } from '../../services/auto-logout.service';
import { UserService } from '../../services/user.service';
import { VacationService } from '../../services/vacation.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  sidebarOpen = true;
  dropdownOpen = false;
  activeLink = 'dashboard';
  currentDate: string = '';
  searchQuery = '';

  users: User[] = [];
  totalEmployees = 0;

  // Pending & Approved Vacations
  pendingVacations: Vacation[] = [];
  approvedVacations: Vacation[] = [];
  approvedCount = 0;

  // Modal
  modalVisible = false;
  modalUser = '';
  selectedVacation?: Vacation;

  // Subscriptions
  private routerSubscription?: Subscription;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private autoLogoutService: AutoLogoutService,
    private userService: UserService,
    private vacationService: VacationService
  ) {}

  ngOnInit(): void {
    this.autoLogoutService.startWatching();
    this.loadUsers();
    this.loadPendingVacations();
    this.loadApprovedVacations();

    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((evt: any) => {
        const segment = evt.urlAfterRedirects.split('/')[2];
        this.activeLink = segment || 'dashboard';

        if (this.activeLink === 'dashboard') {
          this.loadUsers();
          this.loadPendingVacations();
          this.loadApprovedVacations();
        }
        else if (this.activeLink === 'vacations') {
          this.loadPendingVacations();
        }
        else if (this.activeLink === 'approved') {
          this.loadApprovedVacations();
        }
      });

    const today = new Date();
    this.currentDate = today.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  ngOnDestroy(): void {
    this.autoLogoutService.stopWatching();
    this.routerSubscription?.unsubscribe();
  }

  // Utility to calculate days between two dates (inclusive)
  getDays(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    const diffMs = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.totalEmployees = users.length;
      },
      error: err => {
        console.error('Failed to fetch users:', err);
        alert(`Error fetching users: ${err.message}`);
      }
    });
  }

  loadPendingVacations(): void {
    this.vacationService.getPendingVacations().subscribe({
      next: vacs => this.pendingVacations = vacs,
      error: err => console.error('Error loading pending vacations:', err)
    });
  }

  loadApprovedVacations(): void {
    this.vacationService.getAllVacations().subscribe({
      next: vacs => {
        this.approvedVacations = vacs.filter(v => v.status === 'approved');
        this.approvedCount = this.approvedVacations.length;
      },
      error: err => console.error('Error loading approved vacations:', err)
    });
  }

  get filteredUserList(): User[] {
    return this.users.filter(u =>
      u.username?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSettingsDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.router.navigate(['']);
  }

  setActive(link: string): void {
    this.activeLink = link;

    if (link === 'dashboard') {
      this.loadUsers();
      this.loadPendingVacations();
      this.loadApprovedVacations();
    }
    else if (link === 'vacations') {
      this.loadPendingVacations();
    }
    else if (link === 'approved') {
      this.loadApprovedVacations();
    }
  }

  openModal(v: Vacation): void {
    this.modalUser = v.user?.fullName || 'Unknown';
    this.selectedVacation = v;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
    this.selectedVacation = undefined;
  }

  confirmAction(action: 'approved' | 'rejected'): void {
    if (!this.selectedVacation?.vcnId) {
      return alert('Invalid vacation ID.');
    }

    this.vacationService
      .updateVacationStatus(this.selectedVacation.vcnId, action)
      .subscribe({
        next: () => {
          alert(`Vacation has been ${action}`);
          this.loadPendingVacations();
          this.loadApprovedVacations();
          this.closeModal();
        },
        error: err => {
          console.error('Status update failed:', err);
          alert('Failed to update status.');
        }
      });
  }

  cancelVacation(vcnId: number): void {
    if (!confirm('Cancel this vacation request?')) return;
    this.vacationService.deleteVacation(vcnId).subscribe({
      next: () => {
        alert('Vacation request canceled.');
        this.loadPendingVacations();
        this.loadApprovedVacations();
      },
      error: err => {
        console.error('Cancel failed:', err);
        alert('Failed to cancel vacation request.');
      }
    });
  }
  goTo(tab: string): void {
  this.setActive(tab);
  this.router.navigate(['/admin', tab]); 
}

}
