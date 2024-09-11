import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
const BASE_URL = environment.PROJECTX_API_BASE_URL;

const Token = JSON.parse(localStorage.getItem('Token'));
@Injectable({
  providedIn: 'root',
})
export class SystemServicesService {
  constructor(private http: HttpClient) {}
  //======Facility Drop down data=====================
  Get_GropDown(dropDownField: any) {
    const Url = `${BASE_URL}/dropdown`;
    const reqBody = { name: dropDownField };
    return this.http.post(Url, reqBody);
  }
  //===================================Security Policy===================================
  get_securityPolicy_List() {
    const Url = `${BASE_URL}/securitysettings/list`;
    return this.http.post(Url, {});
  }
  //========================Insert OR Update security policy list==========================
  save_security_Policy_Data(data: any) {
    const Url = `${BASE_URL}/securitysettings/save`;
    const reqBody = {
      PasswordValidationRequired: data.validationRequired,
      MinimumLength: data.minPasswordLength,
      MinimumCategoriesRequired: data.conditionRequiredValue,
      Numbers: data.isNumberChecked,
      UppercaseCharacters: data.isUppercaseChecked,
      LowercaseCharacters: data.isLowercaseChecked,
      SpecialCharacters: data.isSpecialCharactersChecked,
      OTPEmailOnPasswordChange: data.emailOtp,
      OTPSMSOnPasswordChange: data.smsOtp,
      OTPWhatsappOnPasswordChange: data.whatsAppOtp,
      AlertEmailOnPasswordChange: data.emailAlert,
      AlertSMSOnPasswordChange: data.smsAlert,
      AlertWhatsappOnPasswordChange: data.whatsAppAlert,
      AccountLockAttempt: data.loginAttempts,
      AccountLockDuration: data.resetDuration,
      AccountLockFailedLogin: data.failedLoginDuration,
      UserMustChangePasswordOnLogin: data.changePasswordOnLogin,
      PasswordAge: data.passwordExpiryDaysCount,
      PasswordRepeatCycle: data.passwordRepeatCycle,
      UnauthorizedBannerMessage: data.unautherizedMessage,
      DisableUserOnInactiveDays: data.disableUserOn,
    };
    return this.http.post(Url, reqBody);
  }

  //===============================Post office credentials===============================
  //===========List===========
  get_PostOfficeCredencial_List() {
    const Url = `${BASE_URL}/facilitycredentials/list`;
    const reqBody = {
      list: [],
    };
    return this.http.post(Url, reqBody);
  }
  //=====Add or update data========
  update_PostOfficeCredencial_Data(
    FacilityID: any,
    PostOfficeID: any,
    LoginName: any,
    Password: any
  ) {
    const url = `${BASE_URL}/facilitycredentials/update`;
    const reqBody = {
      FacilityID: FacilityID,
      PostOfficeID: PostOfficeID,
      LoginName: LoginName,
      Password: Password,
    };
    return this.http.post(url, reqBody);
  }
  // ------------------------------------------License Info---------------------------------------------------
  list_license_info_data() {
    const url = `${BASE_URL}/facilitycredentials/update`;
    return this.http.post(url, {});
  }
}
