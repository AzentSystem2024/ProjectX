import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxNumberBoxModule,
  DxLoadPanelModule,
  DxTabsModule,
  DxPopupModule,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { ReportService } from 'src/app/services/Report-data.service';
import { ReportEngineService } from '../../REPORT PAGES/report-engine.service';
import { InnerDrillDownSubmissionComponent } from '../inner-drill-down-submission/inner-drill-down-submission.component';
import { InnerDrillDownSubmissionModule } from '../inner-drill-down-submission/inner-drill-down-submission.component';
import { InnerDrillDownRemittanceComponent } from '../inner-drill-down-remittance/inner-drill-down-remittance.component';
import { InnerDrillDownRemittanceModule } from '../inner-drill-down-remittance/inner-drill-down-remittance.component';
import { InnerDrillDownResubmissionModule } from '../inner-drill-down-resubmission/inner-drill-down-resubmission.component';

@Component({
  selector: 'app-claim-detail-activity-drill-down',
  templateUrl: './claim-detail-activity-drill-down.component.html',
  styleUrls: ['./claim-detail-activity-drill-down.component.scss'],
})
export class ClaimDetailActivityDrillDownComponent implements OnInit {
  @Input() clickedRowData: any | '';

  width: any = '100%';
  rtlEnabled: boolean = false;
  scrollByContent: boolean = true;
  showNavButtons: boolean = true;
  orientations: any = 'horizontal';
  stylingMode: any = 'primary';
  iconPosition: any = 'left';
  selectedRows: { [key: number]: any[] } = {};
  selectedTab: number = 0;

  //====================DataSource Variables and Value Fields============
  TransactionDataSource: any;
  ActivityDataSource: any;
  DiagnosisDataSource: any;

  filteredActivityDataSource: any;
  filteredDiagnosisDataSource: any;
  // ================== Field Values ===================
  ClaimNumberValue: any;
  EmiratesIDvalue: any;
  ReceiverIDValue: any;
  PayerIDValue: any;
  IDPayerValue: any;
  MemberIDValue: any;
  ClaimCountValue: any;
  ClaimAmountValue: any;
  RemittanceAmountValue: any;
  RemittanceCountValue: any;
  //===============Column storing variables================
  transactionColumns: any;
  SubmisstionActivityColumns: any;
  DiagnosisColumns: any;

  isActivityGridVisible: boolean = false;
  isDiagnosisGridVisible: boolean = false;

  ClaimNumber: any;
  FacilityID: any;
  focusedRow: any;
  activityFocusRow: any;

  loadingVisible: boolean;
  isContentVisible: boolean = true;

  isEmptyDatagrid: boolean = true;
  RowData: any;
  isSubmissionDrillOpened: boolean = false;
  isResubmissionDrillOpened: boolean = false;
  isRemittanceDrillOpened: boolean = false;

  cliamDetailsDrillDownLoaded: boolean = false;
  ResubmissionDrillDownLoaded: boolean = false;
  RemittanceDrillDownLoaded: boolean = false;
  OthersDrillDownLoaded: boolean = false;
  encounterDrillDownLoaded: boolean = false;

  detailColumns: any;
  claimDetailsDataSource: any;
  encounterDataSource: any;
  othersDataSource: any;
  ResubmissionDatasource: any[];

  remittanceDataSource: any[];

  expandedRowKey: any = null;
  submissionColor: any = '#6e8550';
  remittanceColor: any = '#3a5869';
  resubmissionColor: any = '#508576';

  constructor(
    private service: ReportService,
    private reportEngine: ReportEngineService
  ) {
    this.loadingVisible = true;
  }

  ngOnInit(): void {
    this.loadingVisible = true;
    this.isContentVisible = true;
    this.focusedRow = null;
    this.activityFocusRow = null;
    this.isActivityGridVisible = false;
    this.isDiagnosisGridVisible = false;

    // Extract ClaimNumber and FacilityID from clickedRowData
    this.ClaimNumber = this.clickedRowData.ClaimNumber;
    this.FacilityID = this.clickedRowData.FacilityID;
    this.RowData = this.clickedRowData;
    // Call get_DataSource() if ClaimNumber and FacilityID are available
    if (this.ClaimNumber && this.FacilityID) {
      this.get_All_DataSource();
    }
  }

  toggleContent() {
    this.isContentVisible = !this.isContentVisible;
  }

  //===============Get all Data source Of the drill dowm ==================
  get_All_DataSource() {
    this.loadingVisible = true;
    this.isContentVisible = true;
    this.service
      .get_CliamDetails_DrillDown_Data(this.ClaimNumber, this.FacilityID)
      .subscribe((response: any) => {
        this.ClaimNumberValue = response.Summary[0].ClaimNumber;
        this.EmiratesIDvalue = response.Summary[0].EmiratesIDNumber;
        this.ReceiverIDValue = response.Summary[0].ReceiverID;
        this.PayerIDValue = response.Summary[0].PayerID;
        this.IDPayerValue = response.Summary[0].IDPayer;
        this.MemberIDValue = response.Summary[0].MemberID;
        this.ClaimCountValue = response.Summary[0].ClaimCount;
        this.ClaimAmountValue = response.Summary[0].ClaimAmount;
        this.RemittanceAmountValue = response.Summary[0].RemittanceAmount;
        this.RemittanceCountValue = response.Summary[0].RemittanceCount;
        this.DiagnosisDataSource = response.Diagnosis;
        this.ActivityDataSource = response.Activity.map((item) => {
          return {
            ...item,
            StartDate: this.service.formatDate(item.StartDate),
          };
        });
        this.TransactionDataSource = response.Transaction.map((item) => {
          return {
            ...item,
            TransactionDate: this.service.formatDate(item.TransactionDate),
          };
        });
        this.transactionColumns = response.TransactionColumns;
        this.SubmisstionActivityColumns = response.ActivityColumns;
        this.DiagnosisColumns = response.DiagnosisColumns;
        this.loadingVisible = false;
        this.isEmptyDatagrid = false;
      });
  }
  //===============change color of each row depend transaction type==========
  onRowPrepared(e: any) {
    if (e.rowType === 'data') {
      if (e.data.TransactionType.includes('Submission')) {
        e.rowElement.style.backgroundColor = `${this.submissionColor}`;
      } else if (e.data.TransactionType.includes('Resubmission')) {
        e.rowElement.style.backgroundColor = `${this.resubmissionColor}`;
      } else if (e.data.TransactionType.includes('Remittance')) {
        e.rowElement.style.backgroundColor = `${this.remittanceColor}`;
      }
    }
  }
  //=================row selection event of transaction table=============
  onTransactionGridFocusedRowChanged(e: any) {
    this.activityFocusRow = null;
    this.isDiagnosisGridVisible = false;
    this.filteredActivityDataSource = '';
    let selectedRowClaimRemittanceHeaderUID =
      e.row.data.ClaimRemittanceHeaderUID;

    this.filteredActivityDataSource = this.ActivityDataSource.filter(
      (item) =>
        item.ClaimRemittanceHeaderUID === selectedRowClaimRemittanceHeaderUID
    );

    this.isActivityGridVisible = true;
    this.isEmptyDatagrid = false;
  }
  //==========row selection event of submission activity table============
  onActivityGridFocusedRowChanged(e: any) {
    this.filteredDiagnosisDataSource = '';

    let selectedRowClaimRemittanceHeaderUID =
      e.row.data.ClaimRemittanceHeaderUID;
    let selectedRowClaimRemittanceUID = e.row.data.ClaimRemittanceUID;
    let selectedRowSerialNumber = e.row.data.SerialNumber;
    this.filteredDiagnosisDataSource = this.DiagnosisDataSource.filter(
      (item) =>
        item.ClaimRemittanceHeaderUID === selectedRowClaimRemittanceHeaderUID &&
        item.ClaimRemittanceUID === selectedRowClaimRemittanceUID &&
        item.SerialNumber === selectedRowSerialNumber
    );
    this.isDiagnosisGridVisible = true;
    this.isEmptyDatagrid = false;
  }

  //================Row data drill down click event======================
  TransactionRowDrillDownClick(e: any) {
    if (this.expandedRowKey !== null && this.expandedRowKey !== e.key) {
      e.component.collapseRow(this.expandedRowKey);
    }
    this.expandedRowKey = e.key;

    const rowKey = e.key;
    const expandedRowData = e.component
      .getDataSource()
      .items()
      .find((item) => item.TransactionDate === rowKey);

    const transactionType: any = expandedRowData.TransactionType;
    let facilityID = this.FacilityID;
    let submissionUID = expandedRowData.ClaimRemittanceHeaderUID;
    let claimUID = expandedRowData.ClaimRemittanceUID;

    this.ResubmissionDrillDownLoaded = false;
    this.encounterDrillDownLoaded = false;
    this.cliamDetailsDrillDownLoaded = false;
    this.RemittanceDrillDownLoaded = false;
    this.OthersDrillDownLoaded = false;

    if (transactionType.includes('Submission')) {
      this.service
        .get_CliamDetails_InnerDrillDown_Submission_Data(
          facilityID,
          submissionUID,
          claimUID
        )
        .subscribe((response: any) => {
          if (response.flag === '1') {
            this.claimDetailsDataSource = [response.submission];
            this.encounterDataSource = [response.encounter];
            this.othersDataSource = [response.others];

            this.cliamDetailsDrillDownLoaded = true;
            this.encounterDrillDownLoaded = true;
            this.OthersDrillDownLoaded = true;
          }
        });
    }

    if (transactionType.includes('Resubmission')) {
      this.service
        .get_CliamDetails_InnerDrillDown_Resubmission_Data(
          facilityID,
          submissionUID,
          claimUID
        )
        .subscribe((response: any) => {
          if (response.flag === '1') {
            this.claimDetailsDataSource = [response.submission];
            this.encounterDataSource = [response.encounter];
            this.othersDataSource = [response.others];
            this.ResubmissionDatasource = [response.resubmission];
            this.ResubmissionDrillDownLoaded = true;
            this.encounterDrillDownLoaded = true;
            this.cliamDetailsDrillDownLoaded = true;
            this.OthersDrillDownLoaded = true;
          }
        });
    }

    if (transactionType.includes('Remittance')) {
      this.service
        .get_CliamDetails_InnerDrillDown_Remittance_Data(
          facilityID,
          submissionUID,
          claimUID
        )
        .subscribe((response: any) => {
          if (response.flag === '1') {
            this.remittanceDataSource = [response.remittance];
            this.othersDataSource = [response.others];
            this.ResubmissionDrillDownLoaded = false;
            this.encounterDrillDownLoaded = false;
            this.cliamDetailsDrillDownLoaded = false;
            this.RemittanceDrillDownLoaded = true;
            this.OthersDrillDownLoaded = true;
          }
        });
    }
  }
}
@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxDataGridModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxLookupModule,
    DxNumberBoxModule,
    FormPopupModule,
    DxTabsModule,
    DxLoadPanelModule,
    DxPopupModule,
    InnerDrillDownSubmissionModule,
    InnerDrillDownRemittanceModule,
    InnerDrillDownResubmissionModule,
  ],
  providers: [],
  exports: [ClaimDetailActivityDrillDownComponent],
  declarations: [ClaimDetailActivityDrillDownComponent],
})
export class ClaimDetailActivityDrillDownModule {}
