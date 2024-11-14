import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const BASE_URL = environment.PROJECTX_API_BASE_URL;

const Token = JSON.parse(localStorage.getItem('Token'));

@Injectable()
export class DataService {
  constructor(private http: HttpClient, private router: Router) {}

  //===============Fetch claim details drill down values===========
  set_pageLoading_And_Closing_Log(Action: any,PageName:any) {
    const userid = sessionStorage.getItem('UserID');
    const currentPathName = PageName
    const TOKEN = JSON.parse(localStorage.getItem('logData')).Token;
    const url = `${BASE_URL}/user/useractivity`;
    const reqBody = {
      USER_ID: userid,
      TITLE: currentPathName,
      ACTION: Action,
      TOKEN: TOKEN,
    };
    console.log()
    return this.http.post(url, reqBody);
  }
}
