import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
}
