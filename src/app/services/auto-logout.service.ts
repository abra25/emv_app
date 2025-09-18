import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  private userActivityEvents$ = merge(
    fromEvent(document, 'mousemove'),
    fromEvent(document, 'keydown'),
    fromEvent(document, 'click'),
    fromEvent(document, 'scroll'),
    fromEvent(document, 'touchstart')
  );

  private userActivitySubscription?: Subscription;
  private timeoutPeriod = 6* 60 * 1000; 

  constructor(private router: Router, private ngZone: NgZone) {}

  startWatching() {
    this.ngZone.runOutsideAngular(() => {
      this.userActivitySubscription = this.userActivityEvents$
        .pipe(
          switchMap(() => timer(this.timeoutPeriod))
        )
        .subscribe(() => {
          this.ngZone.run(() => this.logoutUser());
        });
    });
  }

  stopWatching() {
    this.userActivitySubscription?.unsubscribe();
  }

  private logoutUser() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['']);
   
  }
}
