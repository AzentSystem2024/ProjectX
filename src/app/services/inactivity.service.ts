import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private timeoutId: any;
  private readonly inactivityTimeout = 120000;
  constructor(private authservice: AuthService, private ngZone: NgZone) {
    this.startWatching();
    this.setupEvents();
    console.log('testing of trigger the page');
  }

  // Start watching for inactivity
  startWatching() {
    this.resetTimer();
  }

  // Logout after inactivity
  logout() {
    const result = confirm('Your Session is Time Out. Please login To Continue', 'Session Time Out..!');
    result.then((dialogResult: boolean) => {
      if (dialogResult) {
        this.authservice.logOut();
      } else {
        this.authservice.logOut();
        notify(
          {
            message: `Sorry..!! Your session timed out . you should login for continue`,
            position: { at: 'top right', my: 'top right' },
          },
          'error'
        );
      }
    });
  }

  // Reset the inactivity timer
  resetTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.ngZone.run(() => this.logout()); // Ensures the logout is triggered inside Angular's zone
    }, this.inactivityTimeout);
  }

  // Setup user activity events
  setupEvents() {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, () => this.resetTimer());
    });
  }
}
