import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxNumberBoxModule,
  DxTabsModule,
  DxLoadPanelModule,
  DxPopupModule,
  DxDropDownBoxModule,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { ReportService } from 'src/app/services/Report-data.service';
import { ReportEngineService } from '../report-engine.service';
import { MasterReportService } from '../../MASTER PAGES/master-report.service';
import CustomStore from 'devextreme/data/custom_store';
import { DxDropDownBoxTypes } from 'devextreme-angular/ui/drop-down-box';

@Component({
  selector: 'app-single-cliam-details',
  templateUrl: './single-cliam-details.component.html',
  styleUrls: ['./single-cliam-details.component.scss'],
  providers: [ReportService, ReportEngineService],
})
export class SingleCliamDetailsComponent implements OnInit {
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
  focusedRow: any = null;
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
  Facility_DataSource: any;

  isGridBoxOpened = false;

  //============tab dataSource
  SubmissiontabsWithText: any[] = [
    {
      id: 0,
      text: 'Submission Activities',
    },
    {
      id: 1,
      text: 'Diagnosis',
    },
    {
      id: 2,
      text: 'Encounte Details',
    },
    {
      id: 3,
      text: 'Others',
    },
  ];
  RemittancetabsWithText: any[] = [
    {
      id: 0,
      text: 'Remittance Activity',
    },
    {
      id: 1,
      text: 'Others',
    },
  ];
  ResubmissiontabsWithText: any[] = [
    {
      id: 1,
      text: 'Resubmission Details',
    },

    {
      id: 2,
      text: 'Encounte Details',
    },
    {
      id: 3,
      text: 'Others',
    },
  ];

  selectedIndex: number = 0;

  isSubmissionClickVisible: boolean = false;
  isResubmissionClickVisible: boolean = false;
  isRemittanceClickVisible: boolean = false;

  constructor(
    private service: ReportService,
    private masterService: MasterReportService,
    private ref: ChangeDetectorRef
  ) {
    this.get_facility_datasource();
  }

  ngOnInit(): void {
    // this.loadingVisible = true;
    // this.isContentVisible = true;
    this.focusedRow = null;
    this.activityFocusRow = null;
    this.isActivityGridVisible = false;
    this.isDiagnosisGridVisible = false;
  }

  onTabChange(index: number) {
    this.selectedIndex = index;
  }

  get_facility_datasource() {
    this.masterService.Get_Facility_List_Data().subscribe((response: any) => {
      if (response.flag == '1') {
        this.Facility_DataSource = this.makeAsyncDataSourceFromJson(
          response.data
        );
      }
    });
  }

  //==================MAking cutom datasource for facility datagrid and dropdown loADING=======
  makeAsyncDataSourceFromJson(jsonData: any) {
    return new CustomStore({
      loadMode: 'raw',
      key: 'FacilityLicense',
      load: () => {
        return new Promise((resolve, reject) => {
          try {
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        });
      },
    });
  }

  //==============instance facility selection==================
  onGridBoxOptionChanged(e: DxDropDownBoxTypes.OptionChangedEvent) {
    if (e.name === 'value') {
      this.isGridBoxOpened = false;
      this.ref.detectChanges();
    }
  }

  //=====================================================
  toggleContent() {
    this.isContentVisible = !this.isContentVisible;
  }
  //==========================Clear Button Clicked========================
  clearButtonAction() {}

  //===============Get all Data source Of the drill dowm ==================
  get_All_DataSource() {
    this.loadingVisible = true;
    this.isContentVisible = true;
    this.isActivityGridVisible = false;
    this.service
      .get_CliamDetails_DrillDown_Data(
        this.ClaimNumber,
        this.FacilityID.join(',')
      )
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

  //=================row selection event of transaction table=============
  onTransactionGridFocusedRowChanged(e: any) {
    this.loadingVisible = true;
    this.activityFocusRow = null;
    this.selectedIndex = 0;
    this.isSubmissionClickVisible = false;
    this.isResubmissionClickVisible = false;
    this.isRemittanceClickVisible = false;
    if (e.row && e.row.data) {
      this.focusedRow = e.row.data.TransactionDate;
    }
    // Reset Data Sources
    this.filteredActivityDataSource = [];
    this.filteredDiagnosisDataSource = [];
    this.claimDetailsDataSource = [];
    this.encounterDataSource = [];
    this.othersDataSource = [];
    this.ResubmissionDatasource = [];
    this.remittanceDataSource = [];

    let TransactionType = e.row.data.TransactionType;
    let facilityID = this.FacilityID.join(',');
    let selectedRowClaimRemittanceHeaderUID =
      e.row.data.ClaimRemittanceHeaderUID;
    let selectedRowClaimRemittanceUID = e.row.data.ClaimRemittanceUID;
    let selectedRowSerialNumber = e.row.data.SerialNumber;

    if (TransactionType.includes('Submission')) {
      this.service
        .get_CliamDetails_InnerDrillDown_Submission_Data(
          facilityID,
          selectedRowClaimRemittanceHeaderUID,
          selectedRowClaimRemittanceUID
        )
        .subscribe((response: any) => {
          if (response.flag === '1') {
            this.claimDetailsDataSource = [response.submission];
            this.encounterDataSource = [response.encounter];
            this.othersDataSource = [response.others];
          }
          this.loadingVisible = false;
          this.isSubmissionClickVisible = true;
        });
    } else if (TransactionType.includes('Resubmission')) {
      this.service
        .get_CliamDetails_InnerDrillDown_Resubmission_Data(
          facilityID,
          selectedRowClaimRemittanceHeaderUID,
          selectedRowClaimRemittanceUID
        )
        .subscribe((response: any) => {
          if (response.flag === '1') {
            this.claimDetailsDataSource = [response.resubmission]; // Corrected
            this.encounterDataSource = [response.encounter];
            this.othersDataSource = [response.others];
            this.ResubmissionDatasource = [response.resubmission];
          }
          this.isResubmissionClickVisible = true;
          this.loadingVisible = false;
        });
    } else if (TransactionType.includes('Remittance')) {
      this.service
        .get_CliamDetails_InnerDrillDown_Remittance_Data(
          facilityID,
          selectedRowClaimRemittanceHeaderUID,
          selectedRowClaimRemittanceUID
        )
        .subscribe((response: any) => {
          if (response.flag === '1') {
            this.remittanceDataSource = [response.remittance];
            this.othersDataSource = [response.others];
          }
          this.isRemittanceClickVisible = true;
          this.loadingVisible = false;
        });
    }

    // Filter Activity and Diagnosis Data
    this.filteredActivityDataSource = this.ActivityDataSource.filter(
      (item) =>
        item.ClaimRemittanceHeaderUID === selectedRowClaimRemittanceHeaderUID
    );

    this.filteredDiagnosisDataSource = this.DiagnosisDataSource.filter(
      (item) =>
        item.ClaimRemittanceHeaderUID === selectedRowClaimRemittanceHeaderUID &&
        item.ClaimRemittanceUID === selectedRowClaimRemittanceUID &&
        item.SerialNumber === selectedRowSerialNumber
    );

    // Show Activity Grid
    this.isActivityGridVisible = true;
  }

  //==========row selection event of submission activity table============
  // onActivityGridFocusedRowChanged(e: any) {
  //   this.filteredDiagnosisDataSource = '';
  //   let selectedRowClaimRemittanceHeaderUID =
  //     e.row.data.ClaimRemittanceHeaderUID;
  //   let selectedRowClaimRemittanceUID = e.row.data.ClaimRemittanceUID;
  //   let selectedRowSerialNumber = e.row.data.SerialNumber;
  //   this.filteredDiagnosisDataSource = this.DiagnosisDataSource.filter(
  //     (item) =>
  //       item.ClaimRemittanceHeaderUID === selectedRowClaimRemittanceHeaderUID &&
  //       item.ClaimRemittanceUID === selectedRowClaimRemittanceUID &&
  //       item.SerialNumber === selectedRowSerialNumber
  //   );
  //   this.isDiagnosisGridVisible = true;
  //   this.isEmptyDatagrid = false;
  // }

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
    let facilityID = this.FacilityID.join(',');
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
    DxDropDownBoxModule,
  ],
  providers: [],
  exports: [SingleCliamDetailsComponent],
  declarations: [SingleCliamDetailsComponent],
})
export class SingleCliamDetailsModule {}
