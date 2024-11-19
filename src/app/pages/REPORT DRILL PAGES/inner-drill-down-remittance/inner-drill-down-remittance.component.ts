import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import {
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxNumberBoxModule,
  DxTabsModule,
  DxLoadPanelModule,
  DxTabPanelModule,
  DxPopupModule,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { ReportService } from 'src/app/services/Report-data.service';

interface Remittance {
  SenderID: any;
  Sender: any;
  IDPayer: any;
  XMLFileName: any;
  FileID: any;
  IsCancelled: any;
  Remarks: any;
  FileSyncDate: any;
  DataSyncDate: any;
  ProcessedDate: any;
}
@Component({
  selector: 'app-inner-drill-down-remittance',
  templateUrl: './inner-drill-down-remittance.component.html',
  styleUrls: ['./inner-drill-down-remittance.component.scss'],
})
export class InnerDrillDownRemittanceComponent implements OnInit {
  @Input() clickedRowData: any | '';
  @Input() FacilityID: any | '';

  tabsWithText: any = [
    {
      id: 0,
      text: 'Others',
    },
  ];

  showNavButtons = false;
  scrollByContent = false;
  rtlEnabled = false;
  orientation: any = 'horizontal';
  stylingMode: any = 'primary';
  datasource: Remittance;

  loadingVisible: boolean = true;

  selectedTabIndex = 0; // Default to the first tab

  constructor(private service: ReportService) {}

  ngOnInit() {
    this.fetch_dataSource();
  }
  fetch_dataSource() {
    let facilityID = this.FacilityID;
    let submissionUID = this.clickedRowData.ClaimRemittanceHeaderUID;
    let claimUID = this.clickedRowData.ClaimRemittanceUID;
    this.service
      .get_CliamDetails_InnerDrillDown_Remittance_Data(
        facilityID,
        submissionUID,
        claimUID
      )
      .subscribe((response: any) => {
        console.log(response);
        if (response.flag === '1') {
          const remittance: Remittance = {
            SenderID: response.remittance.SenderID,
            Sender: response.remittance.Sender,
            IDPayer: response.remittance.IDPayer,
            XMLFileName: response.remittance.XMLFileName,
            FileID: response.remittance.FileID,
            IsCancelled: response.remittance.IsCancelled,
            Remarks: response.remittance.Remarks,
            FileSyncDate: this.service.formatDate(
              response.remittance.FileSyncDate
            ),
            DataSyncDate: this.service.formatDate(
              response.remittance.DataSyncDate
            ),
            ProcessedDate: this.service.formatDate(
              response.remittance.ProcessedDate
            ),
          };

          this.datasource = remittance;
        }
      });
  }
}
@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxLookupModule,
    DxNumberBoxModule,
    FormPopupModule,
    DxTabsModule,
    DxLoadPanelModule,
    DxTabPanelModule,
    DxPopupModule,
  ],
  providers: [],
  exports: [InnerDrillDownRemittanceComponent],
  declarations: [InnerDrillDownRemittanceComponent],
})
export class InnerDrillDownRemittanceModule {}
