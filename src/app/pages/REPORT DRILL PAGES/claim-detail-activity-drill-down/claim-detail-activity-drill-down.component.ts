import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  NgModule,
  OnChanges,
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
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { ReportService } from 'src/app/services/Report-data.service';
import { ReportEngineService } from '../../REPORT PAGES/report-engine.service';

@Component({
  selector: 'app-claim-detail-activity-drill-down',
  templateUrl: './claim-detail-activity-drill-down.component.html',
  styleUrls: ['./claim-detail-activity-drill-down.component.scss'],
})
export class ClaimDetailActivityDrillDownComponent implements OnChanges {
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

  constructor(
    private service: ReportService,
    private reportEngine: ReportEngineService
  ) {}
  //=====================value change event of the component===============
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clickedRowData'] && this.clickedRowData) {
      this.loadingVisible = true;
      this.focusedRow = null;
      this.activityFocusRow = null;
      this.isActivityGridVisible = false;
      this.isDiagnosisGridVisible = false;

      // Extract ClaimNumber and FacilityID from clickedRowData
      this.ClaimNumber = this.clickedRowData.ClaimNumber;
      this.FacilityID = this.clickedRowData.FacilityID;

      // Call get_DataSource() if ClaimNumber and FacilityID are available
      if (this.ClaimNumber && this.FacilityID) {
        this.get_All_DataSource();
      }
    }
  }

  //===============Get all Data source Of the drill dowm ==================
  get_All_DataSource() {
    this.loadingVisible = true;
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
            StartDate: this.reportEngine.formatDate(item.StartDate),
          };
        });
        this.TransactionDataSource = response.Transaction.map((item) => {
          return {
            ...item,
            TransactionDate: this.reportEngine.formatDate(item.TransactionDate),
          };
        });
        this.transactionColumns = response.TransactionColumns;
        this.SubmisstionActivityColumns = response.ActivityColumns;
        this.DiagnosisColumns = response.DiagnosisColumns;
        this.loadingVisible = false;
      });
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
    console.log('filtered datasource :', this.filteredActivityDataSource);
    this.isActivityGridVisible = true;
  }
  //==========row selection event of submission activity table============
  onActivityGridFocusedRowChanged(e: any) {
    this.filteredDiagnosisDataSource = '';
    console.log('selected row data :', e.row.data);

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
    console.log('filtered datasource :', this.filteredDiagnosisDataSource);
    this.isDiagnosisGridVisible = true;
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
  ],
  providers: [],
  exports: [ClaimDetailActivityDrillDownComponent],
  declarations: [ClaimDetailActivityDrillDownComponent],
})
export class ClaimDetailActivityDrillDownModule {}
