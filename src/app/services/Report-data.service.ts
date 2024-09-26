import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportDataGridToXLSX } from 'devextreme/excel_exporter';
import { jsPDF } from 'jspdf';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';

import { environment } from 'src/environments/environment';
const BASE_URL=environment.PROJECTX_API_BASE_URL
// const baseURL2 = InitData_URL;

@Injectable()
export class ReportService {
  private months: { name: string; value: any }[] = [
    { name: 'All', value: '' },
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 },
  ];

  constructor(private http: HttpClient) {}

  //============Share months to component ================
  getMonths(): { name: string; value: number }[] {
    return this.months;
  }

  //==========Fetch data of Claim Summary Date Wise=============
  get_Claim_Summary_Date_wise(
    userId: any,
    SearchOn: any,
    Facility: any,
    EncounterType: any,
    DateFrom: any,
    DateTo: any,
    ReceiverId:any,
    PayerId:any,
    Payer:any,
    Clinician:any,
    OrderingClinician:any,


  ) {
    const url = `${BASE_URL}reports/claimdetails`;
    const reqBodyData = {
      userid: userId,
      SearchOn: SearchOn,
      DateFrom: DateFrom,
      DateTo: DateTo,
      EncounterType: EncounterType,
      Facility: Facility,
      ReceiverId:ReceiverId,
      PayerId:PayerId,
      Payer:Payer,
      Clinician:Clinician,
      OrderingClinician:OrderingClinician



    };
    return this.http.post(url, reqBodyData);
  }

  //==================Fetch DropDown Data ==============================
  get_Init_Data() {
    const url = `${BASE_URL}/reports/parametervalues`;
    const reqBody = {};
    return this.http.post(url, reqBody);
  }
  //===============Fetch all search parametrs dropdown values===========
  get_SearchParametrs_Data() {
    const url = `${BASE_URL}/reports/parametervalues`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'dXNlcmlkPTEmdGltZT0yMDI0MDYyMTExMDk=',
    });
    return this.http.post(url, headers);
  }
  //=========================Fetch System Currency Format==================
  getSystemCurrencyCode(): string {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: 'USD', // Default currency code
    }).resolvedOptions().currency;
  }
  //=========================Save memorise Report==========================
  save_Memorise_report(
    userId: any,
    reportId: any,
    reportName: any,
    memoriseColumnData: any,
    filterParameters: any
  ): any {
    const url = `${BASE_URL}userreports/insert`;
    const reqBody = {
      USER_ID: userId,
      REPORT_ID: reportId,
      USER_REPORT_NAME: reportName,
      columns: memoriseColumnData,
    };
    return this.http.post(url, reqBody);
  }

  //==============Export function==================
  exportDataGrid(e: any,fileName:any) {
    if (e.format === 'pdf') {
      const doc = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: e.component,
      }).then(() => {
        doc.save(`${fileName}.pdf`);
      });
    } else {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(`${fileName}`);
      exportDataGridToXLSX({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            `${fileName}.xlsx`
          );
        });
      });
      e.cancel = true;
    }
  }
}
