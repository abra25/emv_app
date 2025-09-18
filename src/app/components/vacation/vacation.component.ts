import { Component, OnInit } from '@angular/core';
import { VacationService } from '../../services/vacation.service';
import { Vacation } from '../../model/Vacation';

@Component({
  selector: 'app-vacation',
  standalone: false,
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.css']
})
export class VacationComponent implements OnInit {
  pendingVacations: Vacation[] = [];
  vacations: Vacation[] = [];

  constructor(private vacationService: VacationService) {}

  ngOnInit(): void {
    this.loadPendingVacations();
  }

  loadPendingVacations(): void {
  this.vacationService.getPendingVacations().subscribe({
    next: (data) => this.vacations = data,
    error: (err) => console.error('Error loading vacations', err)
  });
 }

  approve(vcnId: number | undefined): void {
  if (!vcnId) return;
  this.vacationService.updateVacationStatus(vcnId, 'approved').subscribe({
    next: () => this.removeVacationFromList(vcnId),
    error: err => console.error('Error approving vacation', err)
  });
}

reject(vcnId: number | undefined): void {
  if (!vcnId) return;
  this.vacationService.updateVacationStatus(vcnId, 'rejected').subscribe({
    next: () => this.removeVacationFromList(vcnId),
    error: err => console.error('Error rejecting vacation', err)
  });
}

  private removeVacationFromList(vcnId: number): void {
    this.vacations = this.vacations.filter(vac => vac.vcnId !== vcnId);
  }
  getDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

}
