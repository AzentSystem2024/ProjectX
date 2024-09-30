import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  isUserLoggedIn: boolean = false;
  private timeoutId: any;
  private readonly inactivityTimeout = 60000;

  constructor(
    private authservice: AuthService,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.startWatching();
    this.setupEvents();
    // console.log('testing of trigger the page',this.isUserLoggedIn);
  }


  setUserlogginValue() {
    this.isUserLoggedIn = !this.isUserLoggedIn;
    // console.log('user log in :', this.isUserLoggedIn);
  }
  // Start watching for inactivity
  startWatching() {
    this.resetTimer();
  }

  // Logout after inactivity
  logout() {
    const result = confirm(
      'Your Session is Time Out. Please login To Continue',
      'Session Time Out..!'
    );
    result.then((dialogResult: boolean) => {
      if (dialogResult) {
        this.authservice.logOut().subscribe((response: any) => {
          if (response) {
            localStorage.removeItem('sidemenuItems');
            sessionStorage.clear();
            this.setUserlogginValue();
            this.router.navigate(['/auth/login']);
          }
        });
      } else {
        this.authservice.logOut().subscribe((response: any) => {
          if (response) {
            localStorage.removeItem('sidemenuItems');
            sessionStorage.clear();
            this.setUserlogginValue();
            this.router.navigate(['/auth/login']);
          }
        });
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
      if (this.isUserLoggedIn) {
        this.ngZone.run(() => this.logout());
      }
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
