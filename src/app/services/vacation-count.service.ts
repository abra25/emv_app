import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VacationService } from './vacation.service';

@Injectable({
  providedIn: 'root'
})
export class VacationCountService {
  private _pendingCount = new BehaviorSubject<number>(0);
  public readonly pendingCount$ = this._pendingCount.asObservable();

  constructor(private vacationService: VacationService) {}

  // Load actual pending count from backend
  refreshPendingCount(): void {
    this.vacationService.getPendingVacations().subscribe({
      next: (vacations) => {
        this._pendingCount.next(vacations.length);
      },
      error: (err) => {
        console.error('Failed to load pending count', err);
        this._pendingCount.next(0);
      }
    });
  }

  // Decrease count when admin approves or rejects a vacation
  decrementPendingCount(): void {
    const current = this._pendingCount.getValue();
    this._pendingCount.next(Math.max(current - 1, 0));
  }

  // Optional: increase count if a new request is submitted
  incrementPendingCount(): void {
    const current = this._pendingCount.getValue();
    this._pendingCount.next(current + 1);
  }

  // Optional: manually set the count
  setPendingCount(count: number): void {
    this._pendingCount.next(count);
  }

  // Optional: reset the count (e.g. on logout)
  resetCount(): void {
    this._pendingCount.next(0);
  }
}
