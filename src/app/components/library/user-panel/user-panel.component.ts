import { Component, NgModule, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import {
  UserMenuSectionModule,
  UserMenuSectionComponent,
} from '../user-menu-section/user-menu-section.component';
import { IUser } from '../../../services/auth.service';
@Component({
  selector: 'user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent {
  @Input()
  menuItems: any;

  @Input()
  menuMode!: string;

  @Input()
  user!: IUser | null;

  @ViewChild(UserMenuSectionComponent)
  userMenuSection: UserMenuSectionComponent;

  constructor() {}
  //==================fetch letters for logo=================
  //    getInitials = (fullName) => {
  //     const names = fullName.split(" ");
  //     let initials = "";
  //     names.forEach((name) => {
  //         initials += name.charAt(0);
  //     });
  //     return initials.toUpperCase();
  // }

  handleDropDownButtonContentReady({ component }) {
    component.registerKeyHandler('downArrow', () => {
      this.userMenuSection.userInfoList.nativeElement.focus();
    });
  }
}

@NgModule({
  imports: [DxDropDownButtonModule, UserMenuSectionModule, CommonModule],
  declarations: [UserPanelComponent],
  exports: [UserPanelComponent],
})
export class UserPanelModule {}
