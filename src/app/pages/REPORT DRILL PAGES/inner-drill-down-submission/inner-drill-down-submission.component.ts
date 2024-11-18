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
  DxFormModule,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { ReportService } from 'src/app/services/Report-data.service';

@Component({
  selector: 'app-inner-drill-down-submission',
  templateUrl: './inner-drill-down-submission.component.html',
  styleUrls: ['./inner-drill-down-submission.component.scss'],
})
export class InnerDrillDownSubmissionComponent implements OnInit {
  @Input() clickedRowData: any | '';
  @Input() FacilityID: any | '';

  showNavButtons = false;
  scrollByContent = false;
  rtlEnabled = false;
  tabsWithText: any = [
    {
      id: 0,
      text: 'Encounter Details',
    },
    {
      id: 1,
      text: 'Encounter details',
    },
    {
      id: 2,
      text: 'Others',
    },
  ];
  orientation: any = 'horizontal';
  stylingMode: any = 'primary';
  datasource: any;

  constructor(private service: ReportService) {}

  ngOnInit() {
    if (this.clickedRowData.transactionType.includes('Submission')) {
      let facilityID = this.FacilityID;
      let submissionUID = this.clickedRowData.ClaimRemittanceHeaderUID;
      let claimUID = this.clickedRowData.ClaimRemittanceUID;
      this.service
        .get_CliamDetails_InnerDrillDown_Submission_Data(
          facilityID,
          submissionUID,
          claimUID
        )
        .subscribe((response: any) => {
          this.datasource = response;
          console.log(response);
        });
    }
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
    DxFormModule,
  ],
  providers: [],
  exports: [InnerDrillDownSubmissionComponent],
  declarations: [InnerDrillDownSubmissionComponent],
})
export class InnerDrillDownSubmissionModule {}
