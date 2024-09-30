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
    const url = `${BASE_URL}/facility/licensefacilityInfo`;
    return this.http.post(url, {});
  }

  //=============================Security Notification ===================================================
  //==============lising data===========
  getSecurityNotificationData() {
    const url = `${BASE_URL}/notificationsettings/list`;
    return this.http.post(url, {});
  }

  //========save notification data=======
  saveNotificationSettings(formdata: any) {
    const url = `${BASE_URL}/notificationsettings/save`;
    const reqBody = formdata;
    return this.http.post(url, reqBody);
  }
  //========save notification template data=======
  getNotificationTemplateList() {
    const url = `${BASE_URL}/notificationsettings/templatelist`;
    return this.http.post(url, {});
  }

  //=========update a notificatin template ========
 updateNotificationSettingTemplate(formdata: any) {
  const url = `${BASE_URL}/notificationsettings/updatenotification`;
  const reqBody = formdata;
  return this.http.post(url, reqBody);
}
  //=============send a test mail==================
  sendTestMail(userid: any, receiverid: any, subject: any, message: any) {
    const url = `${BASE_URL}/changepassword/formail`;
    const reqBody = {
      userid: userid,
      EmailID: receiverid,
      subject: subject,
      mesasge: message,
    };
    return this.http.post(url, reqBody);
  }
}
