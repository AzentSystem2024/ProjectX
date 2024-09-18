import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
export interface IUser {
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface IResponse {
  isOk: boolean;
  data?: IUser;
  message?: string;
}

const defaultPath = '/';

//=============================Base url==============================
import { BaseURL } from '../services/constant-url.service';

//==================================Default USer Name and details=======================
export const defaultUser: IUser = {
  email: 'Nithin@gmail.com',
  name: 'Nithin Sivadas',
  avatarUrl:
    'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
};
//============================================================
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedin = new BehaviorSubject<boolean>(false);
  private menuData = new BehaviorSubject<any>(null);

  private _loginName: string;

  SideMenu: any;
  private _user: IUser | null = defaultUser;
  UserData: any;
  // private User:any

  // Getter for loginName that retrieves it from session storage
  get loginName(): string {
    return sessionStorage.getItem('loginName') || '';
  }

  // Setter for loginName that sets it to session storage
  set loginName(value: string) {
    sessionStorage.setItem('loginName', value);
  }

  get UserID(): string {
    return sessionStorage.getItem('UserID') || '';
  }
  
  set UserID(value: string) {
    sessionStorage.setItem('UserID', value);
  }

  get loggedIn(): boolean {
    return !!this._user;
  }

  private _lastAuthenticatedPath: string = defaultPath;

  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(private router: Router, private http: HttpClient) {}

  setUserData(data: any) {
    this.UserData = data;
  }

  getUserData() {
    return this.UserData;
  }
  //=================internet ip of system================================
  getIPAddress() {
    return this.http.get('https://api.ipify.org/?format=json');
  }

  initializeProject() {
    return this.http.post(`${BaseURL}CustomerInfo/getinfo`, {});
  }
  //================Log In function===============================
  logIn(username: any, password: any, forcelogin: any) {
    const API_URL = ` ${BaseURL}user/LOGIN`;
    const ReqBody = {
      LoginName: username,
      Password: password,
      LocalIP: '192.168.1.143',
      ComputerName: 'System1',
      DomainName: 'Domain1',
      ComputerUser: 'User1',
      InternetIP: '192.158.1.38',
      SystemTimeUTC: '2020-09-07T00:08:09',
      ForceLogin: forcelogin,
    };
    return this.http.post<any>(API_URL, ReqBody);
  }

  getMenuData() {
    return this.menuData.asObservable();
  }

  isLoggedIn() {
    return this.loggedin.asObservable();
  }

  async getUser() {
    try {
      return {
        isOk: true,
        data: this._user,
      };
    } catch {
      return {
        isOk: false,
        data: null,
      };
    }
  }

  async createAccount(email: string, password: string) {
    try {
      this.router.navigate(['/auth/create-account']);
      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to create account',
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to change password',
      };
    }
  }

  async resetPassword(email: string) {
    try {
      // Send request

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to reset password',
      };
    }
  }

  async logOut() {
    localStorage.removeItem('sidemenuItems');
    sessionStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;
    const isAuthForm = [
      'login',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode',
    ].includes(route.routeConfig?.path || defaultPath);

    if (!isLoggedIn && isAuthForm) {
      this.router.navigate(['/auth/login']);
    }

    if (isLoggedIn) {
      this.authService.lastAuthenticatedPath =
        route.routeConfig?.path || defaultPath;
    }

    return isLoggedIn || isAuthForm;
  }
}
