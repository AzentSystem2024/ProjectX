import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxNumberBoxModule } from 'devextreme-angular';
import {
  DxRadioGroupModule,
  DxTemplateModule,
  DxButtonModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { DxFormModule } from 'devextreme-angular';
import { SystemServicesService } from '../system-services.service';
@Component({
  selector: 'app-security-policy',
  templateUrl: './security-policy.component.html',
  styleUrls: ['./security-policy.component.scss'],
})
export class SecurityPolicyComponent implements OnInit {
  validationRequired: boolean = false;
  readOnlyValue: boolean = true;

  minPasswordLength: any | null = null;
  conditionRequiredValue: boolean = false;

  isNumberChecked: boolean = false;
  isUppercaseChecked: boolean = false;
  isLowercaseChecked: boolean = false;
  isSpecialCharactersChecked: boolean = false;

  emailOtp: boolean = false;
  smsOtp: boolean = false;
  whatsAppOtp: boolean = false;

  emailAlert: boolean = false;
  smsAlert: boolean = false;
  whatsAppAlert: boolean = false;

  LoginAttempts: any | null = null;
  resetDuration: any | null = null;
  failedLoginDuration: any | null = null;

  changePasswordOnLogin: boolean = false;
  passwordExpiryDaysCount: any | null = null;
  passwordRepeatCycle: any | null = null;
  sessionTimeOut: any | null = null;

  unautherizedMessage: any = '';
  disableUserOn: any | null = null;
  presentSecurityData: any;
  tooltipData: any;
  conditionEnableValue: boolean = true;

  minAllowedLength: number = 6;
  userId: any;

  constructor(private systemService: SystemServicesService) {}
  ngOnInit() {
    this.userId=sessionStorage.getItem('UserID')
    this.get_Present_Security_Policy();
  }

  onPasswordLengthChange(e: any) {
    if (e.value < this.minAllowedLength) {
      this.minPasswordLength = this.minAllowedLength; // Prevent reducing below minimum
    } else {
      this.minPasswordLength = e.value;
    }
  }



  get_Present_Security_Policy() {
    this.systemService.get_securityPolicy_List(this.userId).subscribe((response: any) => {
      if (response) {
        this.presentSecurityData = response.data[0];
        this.tooltipData = response.Tooltip;

        // console.log('data received', this.presentSecurityData);
        this.validationRequired =
          this.presentSecurityData.PasswordValidationRequired;
        this.minPasswordLength = this.presentSecurityData.MinimumLength;
        // this.conditionRequiredValue =
        //   this.presentSecurityData.MinimumCategoriesRequired;
        this.isNumberChecked = this.presentSecurityData.Numbers;
        this.isUppercaseChecked = this.presentSecurityData.UppercaseCharacters;
        this.isLowercaseChecked = this.presentSecurityData.LowercaseCharacters;
        this.isSpecialCharactersChecked =
          this.presentSecurityData.SpecialCharacters;
        this.emailOtp = this.presentSecurityData.OTPEmailOnPasswordChange;
        this.smsOtp = this.presentSecurityData.OTPSMSOnPasswordChange;
        this.whatsAppOtp = this.presentSecurityData.OTPWhatsappOnPasswordChange;
        this.emailAlert = this.presentSecurityData.AlertEmailOnPasswordChange;
        this.smsAlert = this.presentSecurityData.AlertSMSOnPasswordChange;
        this.whatsAppAlert =
          this.presentSecurityData.AlertWhatsappOnPasswordChange;
        this.sessionTimeOut = this.presentSecurityData.SessionTimeoutMinutes;
        this.LoginAttempts = this.presentSecurityData.AccountLockAttempt;
        this.resetDuration = this.presentSecurityData.AccountLockDuration;
        this.failedLoginDuration =
          this.presentSecurityData.AccountLockFailedLogin;
        this.changePasswordOnLogin =
          this.presentSecurityData.UserMustChangePasswordOnLogin;
        this.passwordExpiryDaysCount = this.presentSecurityData.PasswordAge;
        this.passwordRepeatCycle = this.presentSecurityData.PasswordRepeatCycle;
        this.unautherizedMessage =
          this.presentSecurityData.UnauthorizedBannerMessage;
        this.disableUserOn = this.presentSecurityData.DisableUserOnInactiveDays;
      }
    });
  }

  onClickSave() {

    const formData = {
      validationRequired: this.validationRequired,
      minPasswordLength: this.minPasswordLength,
      isNumberChecked: this.isNumberChecked,
      isUppercaseChecked: this.isUppercaseChecked,
      isLowercaseChecked: this.isLowercaseChecked,
      isSpecialCharactersChecked: this.isSpecialCharactersChecked,
      emailOtp: this.emailOtp,
      smsOtp: this.smsOtp,
      whatsAppOtp: this.whatsAppOtp,
      emailAlert: this.emailAlert,
      smsAlert: this.smsAlert,
      whatsAppAlert: this.whatsAppAlert,
      loginAttempts: this.LoginAttempts,
      resetDuration: this.resetDuration,
      failedLoginDuration: this.failedLoginDuration,
      changePasswordOnLogin: this.changePasswordOnLogin,
      SessionTimeOut: this.sessionTimeOut,
      passwordExpiryDaysCount: this.passwordExpiryDaysCount,
      passwordRepeatCycle: this.passwordRepeatCycle,
      unautherizedMessage: this.unautherizedMessage,
      disableUserOn: this.disableUserOn,
      UserID:this.userId
    };

    this.systemService
      .save_security_Policy_Data(formData)
      .subscribe((response: any) => {
        if (response) {
          notify(
            {
              message: `Security Policy saved Successfully`,
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
        } else {
          notify(
            {
              message: `Your Data Not Saved`,
              position: { at: 'top right', my: 'top right' },
            },
            'error'
          );
        }
      });
  }

  onClickCancel() {
    this.validationRequired = false;
    this.minPasswordLength = null;
    // this.conditionRequiredValue = null;
    this.isNumberChecked = false;
    this.isUppercaseChecked = false;
    this.isLowercaseChecked = false;
    this.isSpecialCharactersChecked = false;
    this.emailOtp = false;
    this.smsOtp = false;
    this.whatsAppOtp = false;
    this.emailAlert = false;
    this.smsAlert = false;
    this.whatsAppAlert = false;
    this.LoginAttempts = null;
    this.resetDuration = null;
    this.failedLoginDuration = null;
    this.changePasswordOnLogin = false;
    this.sessionTimeOut = null;
    this.passwordExpiryDaysCount = null;
    this.passwordRepeatCycle = null;
    this.unautherizedMessage = '';
    this.disableUserOn = null;
  }
  //===========Change validation enable or not=====================
  onValidationEnableChange(newValue: boolean): void {
    this.validationRequired = newValue;
    this.readOnlyValue = !this.readOnlyValue;
  }

  format_minutes(value: number): string {
    return `${value} minutes`;
  }
}
@NgModule({
  imports: [
    CommonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxRadioGroupModule,
    DxTemplateModule,
    DxFormModule,
    DxButtonModule,
  ],
  providers: [],
  exports: [],
  declarations: [SecurityPolicyComponent],
})
export class SecurityPolicyModule {}
