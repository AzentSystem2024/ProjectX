import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

const BASE_URL = environment.PROJECTX_API_BASE_URL;

const Token = JSON.parse(localStorage.getItem('Token'));

@Injectable()
export class DataService {
  constructor(private http: HttpClient, private router: Router) {}

  //=================DAte format changing to needed format========
  formatDateTime(date: string): string {
    return formatDate(new Date(date), 'dd-MMM-yyyy hh:mm a', 'en-US');
  }

  //===============Fetch claim details drill down values===========
  set_pageLoading_And_Closing_Log(Action: any, PageName: any) {
    const userid = sessionStorage.getItem('UserID');
    const currentPathName = PageName;
    const TOKEN = JSON.parse(localStorage.getItem('logData')).Token;
    const url = `${BASE_URL}user/useractivity`;
    const reqBody = {
      USER_ID: userid,
      TITLE: currentPathName,
      ACTION: Action,
      TOKEN: TOKEN,
    };
    return this.http.post(url, reqBody);
  }
  //==================dashboard facility sync details data==========
  get_DashbOard_SyncData_Details() {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}facility/synchstatus`;
    const reqBody = {
      UserID: userid,
    };
    return this.http.post(url, reqBody);
  }

  //==================dashboard facility sync details data==========
  get_UserWise_FacilityList_Data() {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}facility/facilitydetails`;
    const reqBody = {
      UserID: userid,
    };
    return this.http.post(url, reqBody);
  }

  import_Local_folder_Claim_data(
    facilityID: any,
    fileName: any,
    fileData: any
  ) {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}facility/importclaim`;
    const reqBody = {
      userID: userid,
      facilityID: facilityID,
      fileName: fileName,
      fileData: fileData,
    };
    return this.http.post(url, reqBody);
  }

  import_Local_folder_Remittance_data(
    facilityID: any,
    fileName: any,
    fileData: any
  ) {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}facility/importremittance`;
    const reqBody = {
      userID: userid,
      facilityID: facilityID,
      fileName: fileName,
      fileData: fileData,
    };
    return this.http.post(url, reqBody);
  }

  get_Claim_SyncData_Details(facilityID: any, DateFrom: any, DateTo: any) {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}facility/synchclaim`;
    const reqBody = {
      UserID: userid,
      DateFrom: DateFrom,
      DateTo: DateTo,
      FacilityID: facilityID,
    };
    return this.http.post(url, reqBody);
  }

  get_Remittance_SyncData_Details(facilityID: any, DateFrom: any, DateTo: any) {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}facility/synchremittance`;
    const reqBody = {
      UserID: userid,
      DateFrom: DateFrom,
      DateTo: DateTo,
      FacilityID: facilityID,
    };
    return this.http.post(url, reqBody);
  }

  get_Process_ReportData_Details(facilityID: any) {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}facility/process`;
    const reqBody = {
      UserID: userid,
      DateFrom: '',
      DateTo: '',
      FacilityID: facilityID,
    };
    return this.http.post(url, reqBody);
  }

  get_Download_Log_DataView(fromDate: any, endDate: any) {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}downloadsettings/loglist`;
    const reqBody = {
      DATE_FROM: fromDate,
      DATE_TO: endDate,
    };
    return this.http.post(url, reqBody);
  }

  //==================Auto  download settings data List==========
  get_AutoDownload_Instance_Settings() {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}downloadsettings/list`;

    return this.http.post(url, {});
  }

  //==================Auto  download settings data List==========
  autoDownload_Instance_Settings_insert(data: any) {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}downloadsettings/insert`;
    const reqBody = data;
    return this.http.post(url, reqBody);
  }

  getServiceSynchStatus(): Observable<{ Flag: number; Message: string }> {
    console.trace('getServiceSynchStatus called');
    const url = `${BASE_URL}downloadsettings/ServiceSynch`;
    return this.http.post<{ Flag: number; Message: string }>(url, {}); // Empty object for POST body
  }

  //==================Email schedule data List==========
  get_email_Log_data() {
    const url = `${BASE_URL}emailscheduler/list`;
    const reqBody = {};
    return this.http.post(url, reqBody);
  }

  //================Insert email alert data============
  insert_Email_alert_Data(formData: any) {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}emailscheduler/insert`;
    const reqBody = {
      UserID: userid,
      ReportID: formData.reportID,
      SearchOn: formData.searchOn,
      DatePeriod: formData.datePeriod,
      EncounterType: formData.encounterType,
      FacilityID: formData.facilities,
      EmailUserID: formData.userEmailID,
    };
    return this.http.post(url, reqBody);
  }

  //================Insert email alert data============
  update_Email_alert_Data(formData: any) {
    const userid = sessionStorage.getItem('UserID');
    const url = `${BASE_URL}emailscheduler/update`;
    console.log('selected row data after editing from service =>', formData);
    const reqBody = {
      UserID: userid,
      ID: formData.ID,
      ReportID: formData.ReportIDList.join(','),
      SearchOn: formData.SearchOn,
      DatePeriod: formData.DatePeriod,
      EncounterType: formData.EncounterType,
      FacilityID: formData.FacilityIDList.join(','),
      EmailUserID: formData.EmailUserIDList.join(','),
    };
    return this.http.post(url, reqBody);
  }
}
