import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { SystemServicesService } from '../pages/SYSTEM PAGES/system-services.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  isUserLoggedIn: any;
  private timeoutId: any;
  inactivityTimeout: any;

  constructor(
    private authservice: AuthService,
    private ngZone: NgZone,
    private router: Router,
    private systemservice: SystemServicesService
  ) {}

  startTheInactiveService() {
    this.get_securityPolicy_List();
  }
  //===============fetch the security policy data for session time out duration==========
  get_securityPolicy_List() {
    const userid = sessionStorage.getItem('UserID');
    this.systemservice
      .get_securityPolicy_List(userid)
      .subscribe((response: any) => {
        if (response) {
          const presentSecurityData = response.data[0];
          this.inactivityTimeout =
            presentSecurityData.SessionTimeoutMinutes * 60000;
          this.isUserLoggedIn = true;
          this.startWatching();
          this.setupEvents();
        }
      });
  }
  //==================Change the value of userLogin=========
  setUserlogginValue() {
    this.isUserLoggedIn = !this.isUserLoggedIn;
    // console.log('user login values', this.isUserLoggedIn);
  }
  // Start watching for inactivity
  startWatching() {
    this.resetTimer();
  }

  logout() {
    const result = confirm(
      'Your Session is Time Out. Please login To Continue',
      'Session Time Out..!'
    );
    result.then((dialogResult: boolean) => {
      if (dialogResult) {
        // window.location.reload();
        this.authservice.logOut().subscribe((response: any) => {
          if (response) {
            localStorage.removeItem('sidemenuItems');
            sessionStorage.clear();
            this.setUserlogginValue();

            this.router.navigate(['/auth/login']).then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 250);
            });
          }
        });
      } else {
        this.authservice.logOut().subscribe((response: any) => {
          if (response) {
            // window.location.reload();
            localStorage.removeItem('sidemenuItems');
            sessionStorage.clear();
            this.setUserlogginValue();

            this.router.navigate(['/auth/login']).then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 250);
            });
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
