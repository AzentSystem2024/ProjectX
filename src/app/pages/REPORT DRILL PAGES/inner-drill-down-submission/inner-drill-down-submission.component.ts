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

interface SubmissionDetails {
  MemberID: any;
  IDPayer: any;
  ReceiverID: any;
  Receiver: any;
  PayerID: any;
  Payer: any;
  EmiratesID: any;
  Clinician: any;
  OrderingClinician: any;
  Diagnosis: any;
  EncouneterType: any;
  PatientID: any;
  EligibilityIDPayer: any;
  StartDate: any;
  StartType: any;
  EndDate: any;
  EndType: any;
  TransferSource: any;
  TransferDescription: any;
  EndDateActual: any;
  PackageName: any;
  XMLFileName: any;
  FileID: any;
  IsCancelled: any;
  Remarks: any;
  FileSyncDate: any;
  DataSyncDate: any;
  ProcessedDate: any;
}
@Component({
  selector: 'app-inner-drill-down-submission',
  templateUrl: './inner-drill-down-submission.component.html',
  styleUrls: ['./inner-drill-down-submission.component.scss'],
})
export class InnerDrillDownSubmissionComponent implements OnInit {
  @Input() clickedRowData: any | '';
  @Input() FacilityID: any | '';

  tabsWithText: any = [
    {
      id: 0,
      text: 'Encounter Details',
    },
    {
      id: 1,
      text: 'Others',
    },
  ];
  showNavButtons = false;
  scrollByContent = false;
  rtlEnabled = false;
  orientation: any = 'horizontal';
  stylingMode: any = 'primary';
  submissionDetails: SubmissionDetails;
  loadingVisible: boolean = true;

  selectedTabIndex = 0; // Default to the first tab

  constructor(private service: ReportService) {}

  ngOnInit() {
    this.fetch_DataSource();
  }
  fetch_DataSource() {
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
        if (response.flag === '1') {
          this.loadingVisible = false;
          if (response?.submission) {
            this.submissionDetails = {
              MemberID: response.submission.MemberID,
              IDPayer: response.submission.IDPayer,
              ReceiverID: response.submission.ReceiverID,
              Receiver: response.submission.Receiver,
              PayerID: response.submission.PayerID,
              Payer: response.submission.Payer,
              EmiratesID: response.submission.EmiratesID,
              Clinician: response.submission.Clinician,
              OrderingClinician: response.submission.OrderingClinician,
              Diagnosis: response.submission.Diagnosis,
              EncouneterType: response.submission.EncouneterType,
              PatientID: response.submission.PatientID,
              EligibilityIDPayer: response.submission.IDPayer,
              StartDate: this.service.formatDate(response.submission.StartDate),
              StartType: response.submission.StartType,
              EndDate: this.service.formatDate(response.submission.EndDate),
              EndType: response.submission.EndType,
              TransferSource: response.submission.TransferSource,
              TransferDescription: response.submission.TransferDescription,
              EndDateActual: response.submission.EndDateActual,
              PackageName: response.submission.PackageName,
              XMLFileName: response.submission.XMLFileName,
              FileID: response.submission.FileID,
              IsCancelled: response.submission.IsCancelled,
              Remarks: response.submission.Remarks,
              FileSyncDate: this.service.formatDate(
                response.submission.FileSyncDate
              ),
              DataSyncDate: this.service.formatDate(
                response.submission.DataSyncDate
              ),
              ProcessedDate: this.service.formatDate(
                response.submission.ProcessedDate
              ),
            };
            console.log('submission data =>', this.submissionDetails);
          }
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
    DxFormModule,
  ],
  providers: [],
  exports: [InnerDrillDownSubmissionComponent],
  declarations: [InnerDrillDownSubmissionComponent],
})
export class InnerDrillDownSubmissionModule {}
