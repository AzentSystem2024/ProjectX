import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxResizableModule,
  DxDropDownBoxModule,
  DxFormModule,
  DxDateBoxModule,
  DxToolbarModule,
  DxAccordionModule,
  DxCheckBoxModule,
  DxSliderModule,
  DxTagBoxModule,
  DxTemplateModule,
  DxPopupModule,
  DxTreeViewModule,
  DxSortableModule,
  DxTabPanelModule,
  DxListModule,
  DxValidatorModule,
  DxValidationSummaryModule,
  DxTreeViewComponent,
  DxLookupComponent,
  DxDataGridComponent,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { formatNumber } from 'devextreme/localization';
import { ReportService } from 'src/app/services/Report-data.service';
import { ReportEngineService } from '../report-engine.service';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { AdvanceFilterPopupModule } from '../../POP-UP_PAGES/advance-filter-popup/advance-filter-popup.component';
@Component({
  selector: 'app-claim-details-activity',
  templateUrl: './claim-details-activity.component.html',
  styleUrls: ['./claim-details-activity.component.scss'],
  providers: [ReportService, ReportEngineService],
})
export class ClaimDetailsActivityComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  @ViewChild(DxTreeViewComponent, { static: false })
  treeView: DxTreeViewComponent;

  @ViewChild('lookup', { static: false }) lookup: DxLookupComponent;

  //=================DAtaSource for data Grid Table========
  dataGrid_DataSource: any;

  columnsConfig: any; //==============Column data storing variable

  //================Variables for Storing DataSource========
  SearchOn_DataSource: any;
  Facility_DataSource: any;
  EncounterType_DataSource: any;
  RecieverID_DataSource: any;
  PayerID_DataSource: any;
  Payer_DataSource: any;
  Clinician_DataSource: any;
  OrderingClinician_DataSource: any;
  ResubmissionType_DataSource: any;
  DenialCodes_DataSource: any;
  CptTypes_DataSource: any;
  CliamStatus_DataSource: any;
  paymentStatus_DataSource: any;
  monthDataSource: { name: string; value: any }[];
  years: number[] = [];

  //================Variables for Storing selected Parameters========
  SearchOn_Value: any = null;
  Facility_Value: any = [];
  EncounterType_Value: any = null;
  From_Date_Value: any = new Date();
  To_Date_Value: any = new Date();
  ReceiverID_Value: any[] = [];
  PayerID_Value: any[] = [];
  Payer_Value: any[] = [];
  Clinician_Value: any[] = [];
  OrderingClinician_Value: any[] = [];
  selectedmonth: any = '';
  selectedYear: number | null = null;
  ClaimNumber_Value: any = null;
  PatientID_Value: any = null;
  Resubmission_Value: any = null;
  DenialCodes_Value: any[] = [];
  CliamStatus_Value: any[] = [];
  memberID_Value: any = null;
  paymentStatus_Value: any = null;

  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [10, 20, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  show_Pagination = true;

  //=====================other variables==================
  isParamsOpend: boolean = true;
  hint_for_Parametr_div: any = 'Hide Parameters';
  currentPathName: any;
  userId: string;
  minDate: Date;
  maxDate: Date;
  ColumnNames: any;
  memorise_Dropdown_DataList: any;
  isFilterOpened = false; //filter row enable-desable variable
  GridSource: any;
  isEmptyDatagrid: boolean = true;
  summaryColumnsData: any[] = [];
  columndata: any;
  isAdvancefilterOpened: boolean = false;
  filterpopupWidth: any = '70%';
  advanceFilterGridColumns: any;
  MemoriseReportName: any;
  isSaveMemorisedOpened: boolean = false;
  personalReportData: any;

  

  constructor(
    private service: ReportService,
    private router: Router,
    private reportengine: ReportEngineService
  ) {
    this.minDate = new Date(2000, 1, 1); // Set the minimum date
    this.maxDate = new Date(); // Set the maximum date
    //============Year field dataSource===============
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year);
    }
    //=============month field datasource============
    this.monthDataSource = this.service.getMonths();
  }

  ngOnInit() {
    this.userId = sessionStorage.getItem('UserID');
    this.currentPathName = this.router.url.replace('/', '');
    this.get_searchParameters_Dropdown_Values();
  }

  //============Get search parameters dropdown values=======
  get_searchParameters_Dropdown_Values() {
    this.service.get_SearchParametrs_Data().subscribe((response: any) => {
      this.SearchOn_DataSource = response.SearchOn;
      this.Facility_DataSource = response.facility;
      this.EncounterType_DataSource = response.EncounterType;
      this.RecieverID_DataSource = response.ReceiverID;
      this.PayerID_DataSource = response.PayerID;
      this.Payer_DataSource = response.Payer;
      this.Clinician_DataSource = response.Clinician;
      this.OrderingClinician_DataSource = response.OrderingClinician;
      this.ResubmissionType_DataSource = response.ResubmissionType;
      this.CliamStatus_DataSource = response.ClaimStatus;
      this.paymentStatus_DataSource = response.PaymentStatus;
      this.advanceFilterGridColumns = response.AdvanceFilter;
    });
  }

  //===========Fetch DataSource For The Datagrid Table=============
  get_Datagrid_DataSource() {
    const FormData = {
      SearchOn: this.SearchOn_Value,
      Facility: this.Facility_Value.join(', '),
      EncounterType: this.EncounterType_Value,
      From_Date: this.reportengine.formatDate(this.From_Date_Value),
      To_Date: this.reportengine.formatDate(this.To_Date_Value),
      ReceiverID: this.ReceiverID_Value.join(', '),
      PayerID: this.PayerID_Value.join(', '),
      Payer: this.Payer_Value.join(', '),
      Clinician: this.Clinician_Value.join(', '),
      OrderingClinician: this.OrderingClinician_Value.join(', '),
      ClaimNumber: this.ClaimNumber_Value,
      PatientID: this.PatientID_Value,
      Resubmission: this.Resubmission_Value,
      DenialCodes: this.DenialCodes_Value,
      CliamStatus: this.CliamStatus_Value,
      memberID: this.memberID_Value,
      paymentStatus: this.paymentStatus_Value,
    };
    this.isParamsOpend = false;
    this.dataGrid_DataSource = new DataSource<any>({
      load: () =>
        new Promise((resolve, reject) => {
          this.service.fetch_Claim_Details_With_Activity(FormData).subscribe({
            next: (response: any) => {
              this.isEmptyDatagrid = false;
              this.columndata = response.ReportColumns;
              this.columnsConfig = response.ReportColumns.map((column) => {
                return {
                  dataField: column.Name,
                  caption: column.Title,
                  visible: column.Visibility,
                  type: column.Type,
                  format:
                    column.Type === 'Decimal'
                      ? {
                          type: 'fixedPoint',
                          precision: 2,
                        }
                      : undefined,
                };
              });
              this.ColumnNames = this.columnsConfig
                .filter((column) => column.visible)
                .map((column) => column.dataField);

              this.personalReportData = response.PersonalReports;
              this.memorise_Dropdown_DataList = response.PersonalReports.map(
                (personalReport) => {
                  return {
                    name: personalReport.name,
                  };
                }
              );

              resolve(response.ReportData); // Resolve with the fetched ReportData
            },
            error: (error) => reject(error.message), // Reject with the error message
          });
        }),
    });
  }

  import_Advance_Filter() {
    const filterData = this.reportengine.getData();
    console.log('advance filter imported data', filterData);
    this.Facility_Value = this.Facility_DataSource.filter((item) =>
      filterData.ReceiverID.split(',').includes(item.Name)
    ).map((item) => item.ID);

    this.ReceiverID_Value = this.RecieverID_DataSource.filter((item) =>
      filterData.ReceiverID.split(',').includes(item.Name)
    ).map((item) => item.ID);

    this.PayerID_Value = this.PayerID_DataSource.filter((item) =>
      filterData.PayerID.split(',').includes(item.Name)
    ).map((item) => item.ID);

    this.Payer_Value = this.Payer_DataSource.filter((item) =>
      filterData.ReceiverID.split(',').includes(item.Name)
    ).map((item) => item.ID);

    this.Clinician_Value = this.Clinician_DataSource.filter((item) =>
      filterData.Clinician.split(',').includes(item.Name)
    ).map((item) => item.ID);

    this.OrderingClinician_Value = this.OrderingClinician_DataSource.filter(
      (item) => filterData.OrderingClinician.split(',').includes(item.Name)
    ).map((item) => item.ID);
  }

  //============Show Parametrs Div=======================
  show_Parameter_Div = () => {
    this.isParamsOpend = !this.isParamsOpend;
    this.hint_for_Parametr_div = this.isParamsOpend
      ? 'Hide Parameters'
      : 'Show Parameters';
  };

  //============Show Filter Row==========================
  filterClick = () => {
    if (this.dataGrid_DataSource) {
      this.isFilterOpened = !this.isFilterOpened;
    }
  };

  //============Show Filter Row==========================
  SummaryClick = () => {
    const reportGridElement = document.querySelector('.reportGrid');
    if (reportGridElement) {
      reportGridElement.classList.toggle('reportGridFooter');
    }
  };

  //================Year value change ===================
  onYearChanged(e: any): void {
    this.selectedYear = e.value;
    if (this.selectedmonth != '') {
      this.From_Date_Value = new Date(this.selectedYear, this.selectedmonth, 1);
      this.To_Date_Value = new Date(
        this.selectedYear,
        this.selectedmonth + 1,
        0
      );
    } else {
      this.From_Date_Value = new Date(this.selectedYear, 0, 1);
      this.To_Date_Value = new Date(this.selectedYear, 11, 31);
    }
  }
  //================Month value change ===================
  onMonthValueChanged(e: any) {
    this.selectedmonth = e.value;
    this.From_Date_Value = new Date(this.selectedYear, this.selectedmonth, 1);
    this.To_Date_Value = new Date(this.selectedYear, this.selectedmonth + 1, 0);
  }
  //============Hide drop down after Value Selected======
  onDropdownValueChanged() {
    const lookupInstance = this.lookup.instance;
    if (lookupInstance) {
      lookupInstance.close();
    }
  }
  onDropDownBoxValueChanged() {
    this.updateSelection(this.treeView?.instance);
    const allItem = this.Facility_DataSource.find(
      (item) => item.Name === 'All'
    );
    if (this.Facility_Value.includes(allItem.ID)) {
      const otherIds = this.Facility_DataSource.filter(
        (item) => item.Name !== 'All'
      ).map((item) => item.ID);
      this.Facility_Value = otherIds;
      this.treeView.instance.selectAll();
    } else {
      this.treeView.instance.unselectAll();
    }
  }
  updateSelection(treeView: DxTreeViewComponent['instance']) {
    if (!treeView) return;

    if (!this.Facility_Value) {
      treeView.unselectAll();
    }

    this.Facility_Value?.forEach((value) => {
      treeView.selectItem(value);
    });
  }

  //=================Show advance filter popup==========
  get_advance_Filter() {
    this.isAdvancefilterOpened = true;
  }

  //=====================Search on Each Column===========
  applyFilter() {
    this.GridSource.filter();
  }

  customiseCountText(itemInfo) {
    return `Count: ${itemInfo.value}`;
  }

  customiseTotal(itemInfo) {
    return `Total: ${formatNumber(itemInfo.value, {
      type: 'fixedPoint',
      precision: 2,
    })}`;
  }

  //==============Show Memorise Report===================
  ShowMemoriseTable = (e: any) => {
    const SelectedValue = e.value;
    if (SelectedValue === null) {
      this.get_Datagrid_DataSource();
    }
    this.columnsConfig = this.personalReportData
      .filter((report: any) => report.name == SelectedValue)
      .map((report: any) => {
        return report.Columns.map((column: any) => ({
          dataField: column.Name,
          caption: column.Title,
          visible: column.Visibility,
          type: column.Type,
          format:
            column.Type === 'Decimal'
              ? {
                  type: 'fixedPoint',
                  precision: 2,
                }
              : undefined,
        }));
      })
      .flat(); // Flatten the array in case each report has multiple columns

    this.ColumnNames = this.columnsConfig
      .filter((column) => column.visible)
      .map((column) => column.dataField);
  };

  //==========show memorise save pop up==================
  show_Memorise_popup = () => {
    this.isSaveMemorisedOpened = !this.isSaveMemorisedOpened;
  };
  //==========fetch custome memorise report name==========
  onMemoriseReportNameChanged(e) {
    this.MemoriseReportName = e.value;
  }
  //================Save Memorize Reports=================
  save_Memorise_Report() {
    const memoriseName = this.MemoriseReportName;
    const filterParameters = JSON.parse(sessionStorage.getItem('reportData'));
    const reportColumns = this.columndata;
    const allColumns = this.ColumnNames;
    const columns = this.dataGrid.instance.getVisibleColumns();
    const VisiblecolumnNames = columns
      .map((col) => col.caption || col.dataField)
      .filter((name) => name !== undefined);
    const hiddenColumns = allColumns.filter(
      (colName) => !VisiblecolumnNames.includes(colName)
    );
    const memoriseReportColumns = reportColumns.map((column) => {
      return {
        ...column,
        Visibility: hiddenColumns.includes(column.Name) ? false : true,
      };
    });

    // console.log('save memorise details', memoriseName, filterParameters);
    this.service
      .save_Memorise_report(
        memoriseName,
        memoriseReportColumns,
        filterParameters
      )
      .subscribe((response: any) => {
        if (response) {
          notify(
            {
              message: `${response.message}`,
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
        } else {
          notify(
            {
              message: `${response.message}`,
              position: { at: 'top right', my: 'top right' },
            },
            'error'
          );
        }
      });
  }

  findColumnLocation = (e: any) => {
    const columnName = e.value;
    this.reportengine.makeColumnVisible(this.dataGrid, columnName);
  };

  //=============DataGrid Refreshing=====================
  refresh = () => {
    this.dataGrid.instance.refresh();
  };

  //================Exporting Function===================
  onExporting(event: any) {
    const fileName = 'Cliam-Details-Activity';
    this.service.exportDataGrid(event, fileName);
  }
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxLookupModule,
    DxResizableModule,
    DxDropDownBoxModule,
    FormPopupModule,
    CommonModule,
    DxFormModule,
    DxDateBoxModule,
    DxToolbarModule,
    DxAccordionModule,
    DxCheckBoxModule,
    DxSliderModule,
    DxTagBoxModule,
    DxTemplateModule,
    DxPopupModule,
    ReactiveFormsModule,
    DxTreeViewModule,
    DxSortableModule,
    DxTabPanelModule,
    DxListModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    AdvanceFilterPopupModule,
  ],
  providers: [],
  exports: [],
  declarations: [ClaimDetailsActivityComponent],
})
export class ClaimDetailsActivityModule {}
