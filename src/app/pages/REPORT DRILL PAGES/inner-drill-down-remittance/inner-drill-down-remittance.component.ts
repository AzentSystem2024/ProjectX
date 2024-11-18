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

@Component({
  selector: 'app-inner-drill-down-remittance',
  templateUrl: './inner-drill-down-remittance.component.html',
  styleUrls: ['./inner-drill-down-remittance.component.scss'],
})
export class InnerDrillDownRemittanceComponent implements OnInit {
  @Input() clickedRowData: any | '';
  @Input() FacilityID: any | '';

  showNavButtons = false;
  scrollByContent = false;
  rtlEnabled = false;
  tabsWithText: any;
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
  ],
  providers: [],
  exports: [InnerDrillDownRemittanceComponent],
  declarations: [InnerDrillDownRemittanceComponent],
})
export class InnerDrillDownRemittanceModule {}
