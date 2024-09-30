import {
  Component, NgModule, Input, Output, EventEmitter, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { UserPanelModule } from '../user-panel/user-panel.component';
import { AuthService, IUser } from 'src/app/services';
import { ThemeSwitcherModule } from 'src/app/components/library/theme-switcher/theme-switcher.component';
import { DxTooltipModule } from 'devextreme-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})

export class AppHeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  user: IUser | null = { email: '' };

  userMenuItems = [
    {
      text: 'Change Password',
      icon: 'key',
      onClick: () => {
        this.changePassword();
      },
    },
  {
    text: 'Logout',
    icon: 'runner',
    onClick: () => {
      this.authService.logOut().subscribe((response:any)=>{
        if(response){
          localStorage.removeItem('sidemenuItems');
          sessionStorage.clear();
          this.router.navigate(['/auth/login']);
        }
      })
    },
  }];

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit() {
    // Fetch the user and set the loginName
    this.authService.getUser().then((response) => {
      if (response.isOk && response.data) {
        this.user = response.data;
        this.user.name = this.authService.loginName; // Bind loginName
        // Get UserPhoto from sessionStorage
        const storedUserPhoto = sessionStorage.getItem('UserPhoto');

        // Set avatarUrl: use storedUserPhoto if available, otherwise default to the fallback image
        this.user.avatarUrl = storedUserPhoto
          ? storedUserPhoto
          : 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png';
        }
    });
  }
  changePassword(){
    this.router.navigateByUrl('/change-password');
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  };
}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    DxToolbarModule,
    ThemeSwitcherModule,
    UserPanelModule,
    DxTooltipModule,
  ],
  declarations: [AppHeaderComponent],
  exports: [AppHeaderComponent],
})
export class AppHeaderModule { }
