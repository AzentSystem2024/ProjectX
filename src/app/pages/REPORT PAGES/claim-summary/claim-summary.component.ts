import {
  Component,
  ViewChild,
  NgModule,
  AfterViewInit,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDataGridComponent,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxFormModule,
  DxLookupComponent,
  DxValidatorComponent,
  DxValidationSummaryModule,
} from 'devextreme-angular';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxDateBoxModule } from 'devextreme-angular';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportDataGridToXLSX } from 'devextreme/excel_exporter';
import DataSource from 'devextreme/data/data_source';
import { CommonModule } from '@angular/common';
import { FormPopupModule } from 'src/app/components';
import notify from 'devextreme/ui/notify';
import { ContactPanelModule } from 'src/app/components/library/contact-panel/contact-panel.component';
import {
  DenialNewFormComponent,
  DenialNewFormModule,
} from 'src/app/pages/POP-UP_PAGES/denial-new-form/denial-new-form.component';
import {
  DxLookupModule,
  DxDropDownBoxModule,
  DxResizableModule,
} from 'devextreme-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/services/Report-data.service';
import { ToolbarAnalyticsModule } from 'src/app/components/utils/toolbar-analytics/toolbar-analytics.component';
import {
  DxAccordionModule,
  DxCheckBoxModule,
  DxSliderModule,
  DxTagBoxModule,
  DxTemplateModule,
  DxValidatorModule,
} from 'devextreme-angular';
import {
  DxTreeViewComponent,
  DxTreeViewModule,
  DxTreeViewTypes,
} from 'devextreme-angular/ui/tree-view';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DxSortableModule,
  DxTabPanelModule,
  DxListModule,
} from 'devextreme-angular';
import { DxFormComponent } from 'devextreme-angular';
import { ReportEngineService } from '../report-engine.service';
import { AdvanceFilterPopupComponent } from '../../POP-UP_PAGES/advance-filter-popup/advance-filter-popup.component';
import { AdvanceFilterPopupModule } from '../../POP-UP_PAGES/advance-filter-popup/advance-filter-popup.component';
//======================Dropdown interface=======================
interface dropdownData {
  ID: number;
  Description: string;
}

@Component({
  templateUrl: './claim-summary.component.html',
  styleUrls: ['./claim-summary.component.scss'],
  providers: [ReportService, ReportEngineService],
})
export class ClaimSummaryComponent implements AfterViewInit {
  @ViewChild(AdvanceFilterPopupComponent, { static: false })
  advanceFilter: AdvanceFilterPopupComponent;

  @ViewChild(DxValidatorComponent, { static: false })
  validator: DxValidatorComponent;

  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  @ViewChild(DenialNewFormComponent, { static: false })
  denialComponent: DenialNewFormComponent;

  @ViewChild('lookup', { static: false }) lookup: DxLookupComponent;

  @ViewChild(DxTreeViewComponent, { static: false })
  treeView: DxTreeViewComponent;

  isErrorVisible: boolean = false; //for required error showing

  isPanelOpened = false;

  isFilterOpened = false; //filter row enable-desable variable
  isSummaryOpened = false; //summary row enable-desable variable
  isParamsOpend: boolean = true;
  isSaveMemorisedOpened: boolean = false;

  selectedItemKeys: any[] = [];
  Denial_Type_DropDownData: dropdownData[]; // Variable for storing drop down
  Denial_category_DropDownData: dropdownData[]; // Variable for storing drop down

  GridSource: any; //--variable for using column wise filtering data---

  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  show_Pagination = false;

  columnsData: any;

  //================Variables for Storing selected Parameters========
  SearchOn_Value: any = null;
  Facility_Value: any = [];
  EncounterType_Value: any = null;
  From_Date_Value: any = new Date();
  To_Date_Value: any = new Date();
  AsOnDate: any = new Date();
  ReceiverID_Value: any[] = [];
  PayerID_Value: any[] = [];
  Payer_Value: any[] = [];
  Clinician_Value: any[] = [];
  OrderingClinician_Value: any[] = [];
  initial_net_amount: any;
  //===========Variables For DataSource Of Multiple DropDowns=========
  SearchOn_DataSource: any;
  Facility_DataSource: any;
  EncounterType_DataSource: any;
  RecieverID_DataSource: any;
  PayerID_DataSource: any;
  Payer_DataSource: any;
  Clinician_DataSource: any;
  OrderingClinician_DataSource: any;

  dataSource: any; //storing data from api
  columnsConfig: any; // used to store all column name
  minDate: Date; // validation for data fields
  maxDate: Date; // validation for data fields

  systemCurrencyCode: any; // using store system currency format
  ColumnNames: any;

  hint_for_Parametr_div: any = 'Hide Parameters';

  currentTime: any = new Date(); //==Crrent time for passing memorise report

  memoriseEnable: any = 'false';
  logData: any;
  user_Id: any = 2;
  Report_Page: string;
  Parameters: any[] = [];
  myform: FormGroup;
  MemoriseReportName: any;
  memoriseDropDownSelectedValue: any;
  MemoriseReportColumns: any;
  memorise_Dropdown_Data: any;

  monthDataSource: { name: string; value: any }[];
  years: number[] = [];
  selectedmonth: any = '';
  selectedYear: number | null = null;
  columnChooserConfig = {
    enabled: true,
    height: 400, // Set your desired height here
    width: 250, // Set your desired width here
  };
  isAdvancefilterOpened: boolean = false;
  filterpopupWidth: any = '70%';
  advanceFilterGridColumns: any;
  //=======================Constructor==================
  constructor(
    private service: ReportService,
    private router: Router,
    private reportEngine: ReportEngineService
  ) {
    this.minDate = new Date(2000, 1, 1); // Set the minimum date
    this.maxDate = new Date(); // Set the maximum date
    // this.fetch_Dropdown_InitData();
    this.get_searchParameters_Dropdown_Values();
    //============Year field dataSource===============
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year);
    }
    //=============month field datasource============
    this.monthDataSource = this.service.getMonths();
    this.logData = JSON.parse(localStorage.getItem('logData'));
    this.user_Id = this.logData.UserID;
    this.Report_Page = this.router.url.slice(1);
    const parametrs = JSON.parse(sessionStorage.getItem('reportData'));
    this.Parameters.push(parametrs);
    // this.systemCurrencyCode = this.service.getSystemCurrencyCode();
    const loadedPAgeFlag = JSON.parse(sessionStorage.getItem('loadedFlag'));
    // if (loadedPAgeFlag == 'true') {
    //   this.DataSorce_After_reload_Page();
    // }
  }

  ngAfterViewInit() {
    if (this.dataGrid) {
      const columns = this.dataGrid.instance.getVisibleColumns();
    }
  }
  //================Year value change ===========================
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
  //================Month value change ===========================
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

  //============Get search parameters dropdown values=======
  get_searchParameters_Dropdown_Values() {
    this.service.get_SearchParametrs_Data().subscribe((response: any) => {
      this.SearchOn_DataSource = response.SearchOn;
      this.Facility_DataSource = response.facility.filter(
        (item: any) => item.Name !== 'All'
      );
      this.EncounterType_DataSource = response.EncounterType;
      this.RecieverID_DataSource = response.ReceiverID;
      this.PayerID_DataSource = response.PayerID;
      this.Payer_DataSource = response.Payer;
      this.Clinician_DataSource = response.Clinician;
      this.OrderingClinician_DataSource = response.OrderingClinician;
      this.advanceFilterGridColumns = response.AdvanceFilter;
    });
  }

  //============Fetch DataSource For Reporting Grid======
  loadData(
    userId: any,
    searchOn: any,
    Facility: any,
    encounterType: any,
    fromData: any,
    toDate: any,
    receiverId: any,
    payerId: any,
    payer: any,
    Clinician: any,
    OrderingClinician: any
  ) {
    this.dataSource = '';
    this.service
      .fetch_Claim_Details_With_Activity({})
      .subscribe((data: any) => {
        // console.log('report data loaded', data);
        const personalReportData = data.PersonalReports;
        // console.log('data loaded', personalReportData);
        this.memorise_Dropdown_Data = personalReportData.map(
          (personalReport) => {
            return {
              name: personalReport.name,
            };
          }
        );

        const personalReport = data.PersonalReports.find(
          (report) => report.name === this.memoriseDropDownSelectedValue
        );

        // Extract the columns if the personalReport is found
        this.MemoriseReportColumns = personalReport
          ? personalReport.Columns
          : [];
        // console.log('memo loaded', this.MemoriseReportColumns);
        this.columnsData =
          this.memoriseEnable === 'true'
            ? this.MemoriseReportColumns
            : data.ReportColumns;
        // console.log('columns are ', this.columnsData);
        this.ColumnNames = this.columnsData.map((column) => column.Name);
        // console.log("columns are fetched",this.columnsData)

        // Assuming columnsData is the array of column objects you provided
        this.columnsConfig = this.columnsData.map((column) => {
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
        // console.log('testing 1', this.columnsConfig);
        this.dataSource = data.ReportData;
        // console.log('report data is ', this.dataSource);
        // sessionStorage.setItem('DataSource', JSON.stringify(data));
        this.show_Pagination = true;
        // this.refresh;
      });
  }
  //============Call DataSource Using Selected Values====
  get_Report_DataSource() {
    const validationResult = this.validator.instance.validate();

    if (validationResult.isValid) {
      var userId = this.user_Id;
      var searchOn = this.SearchOn_Value;
      var Facility = this.Facility_Value.join(', ');
      var EncounterType = this.EncounterType_Value;
      var fromDate = this.formatDate(this.From_Date_Value);
      var toDate = this.formatDate(this.To_Date_Value);
      var receiverId = this.ReceiverID_Value.join(', ');
      var payerId = this.PayerID_Value.join(', ');
      var payer = this.Payer_Value.join(', ');
      var Clinician = this.Clinician_Value.join(', ');
      var OrderingClinician = this.OrderingClinician_Value.join(', ');

      // Create an object with the variables
      var reportData = {
        SEARCH_ON: searchOn,
        FACILITY_ID: Facility,
        ENCOUNTER_TYPE: EncounterType,
        START_DATE: fromDate,
        END_DATE: toDate,
        RECEIVER_ID: receiverId,
        PAYER_ID: payerId,
        PAYER: payer,
        CLINICIAN: Clinician,
        ORDERING_CLINICIAN: OrderingClinician,
      };
      console.log('report data loaded', reportData);
      // Store the object in session storage
      sessionStorage.setItem('reportData', JSON.stringify(reportData));
      this.loadData(
        userId,
        searchOn,
        Facility,
        EncounterType,
        fromDate,
        toDate,
        receiverId,
        payerId,
        payer,
        Clinician,
        OrderingClinician
      );
      sessionStorage.setItem('loadedFlag', JSON.stringify('true'));
      this.show_Parameter_Div();
    } else {
    }
  }
  //==============DataLoading After Reload Page==========
  DataSorce_After_reload_Page() {
    const report_Parameters = JSON.parse(sessionStorage.getItem('reportData'));
    this.SearchOn_Value = report_Parameters.SEARCH_ON;
    this.Facility_Value = report_Parameters.FACILITY_ID;
    this.EncounterType_Value = report_Parameters.ENCOUNTER_TYPE;
    this.From_Date_Value = report_Parameters.START_DATE;
    this.To_Date_Value = report_Parameters.END_DATE;
    this.ReceiverID_Value = report_Parameters.RECEIVER_ID;
    this.PayerID_Value = report_Parameters.PAYER_ID;
    this.Payer_Value = report_Parameters.PAYER;
    this.Clinician_Value = report_Parameters.CLINICIAN;
    this.OrderingClinician_Value = report_Parameters.ORDERING_CLINICIAN;
    this.loadData(
      this.user_Id,
      this.SearchOn_Value,
      this.Facility_Value,
      this.EncounterType_Value,
      this.From_Date_Value,
      this.To_Date_Value,
      this.ReceiverID_Value,
      this.PayerID_Value,
      this.Payer_Value,
      this.Clinician_Value,
      this.OrderingClinician_Value
    );
    this.isParamsOpend = false;
  }
  //=================change the format of date===========
  formatDate(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
  //============Show Parametrs Div=======================
  show_Parameter_Div = () => {
    this.isParamsOpend = !this.isParamsOpend;
    this.hint_for_Parametr_div = this.isParamsOpend
      ? 'Hide Parameters'
      : 'Show Parameters';
  };
  //=================Show advance filter popup==========
  get_advance_Filter() {
    this.isAdvancefilterOpened = true;
  }
  //============Show Filter Row==========================
  filterClick = () => {
    this.isFilterOpened = !this.isFilterOpened;
  };
  //============Show Filter Row==========================
  SummaryClick = () => {
    this.isSummaryOpened = !this.isSummaryOpened;
  };
  //==============Show Memorise Report===================
  ShowMemoriseTable = (e: any) => {
    this.memoriseDropDownSelectedValue = e.value;
    // this.memoriseEnable = this.memoriseEnable === 'true' ? 'false' : 'true';
    this.memoriseEnable = 'true';
    this.get_Report_DataSource();
  };
  //=============DataGrid Refreshing=====================
  refresh = () => {
    this.dataGrid.instance.refresh();
  };
  //=====================Search on Each Column===========
  applyFilter() {
    this.GridSource.filter();
  }
  //===========Column location finding===================
  makeColumnVisible = (e: any) => {
    const columnName = e.value;
    this.reportEngine.makeColumnVisible(this.dataGrid, columnName);
  };
  //================Exporting Function===================
  onExporting(event: any) {
    const fileName = 'Cliam-Summary';
    this.service.exportDataGrid(event, fileName);
  }
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
    const reportColumns = this.columnsData;
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
        Visibility: hiddenColumns.includes(column.Name) ? 'false' : 'true',
      };
    });

    console.log('save memorise details', memoriseName, filterParameters);
    this.reportEngine
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
  import_Advance_Filter() {
    const filterData = this.reportEngine.getData();
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
    ContactPanelModule,
    DenialNewFormModule,
    FormPopupModule,
    CommonModule,
    DxFormModule,
    ToolbarAnalyticsModule,
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
    AdvanceFilterPopupModule,
    DxValidationSummaryModule,
  ],
  providers: [],
  exports: [],
  declarations: [ClaimSummaryComponent],
})
export class ClaimSummaryModule {}
