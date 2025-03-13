import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
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
  DxLoadPanelModule,
  DxLookupComponent,
  DxDataGridComponent,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { AdvanceFilterPopupModule } from '../../POP-UP_PAGES/advance-filter-popup/advance-filter-popup.component';
import { ClaimDetailActivityDrillDownModule } from '../../REPORT DRILL PAGES/claim-detail-activity-drill-down/claim-detail-activity-drill-down.component';
import CustomStore from 'devextreme/data/custom_store';
import { ReportService } from 'src/app/services/Report-data.service';

@Component({
  selector: 'app-allocation-page',
  templateUrl: './allocation-page.component.html',
  styleUrls: ['./allocation-page.component.scss'],
  providers: [ReportService],
})
export class AllocationPageComponent {
  @ViewChild('lookup', { static: false }) lookup: DxLookupComponent;

  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  isContentVisible: boolean = true;
  Facility_Value: any;
  Facility_DataSource: any[];
  SearchOn_DataSource: any[];
  SearchOn_Value: any;
  selectedYear: any;
  years: any[] = [];
  monthDataSource: any;
  selectedmonth: any;
  From_Date_Value: string | number | Date;
  minDate: string | number | Date;
  maxDate: string | number | Date;
  To_Date_Value: string | number | Date;
  EncounterType_DataSource: any[];
  EncounterType_Value: any;
  Payer_DataSource: any[];
  Payer_Value: any;
  PayerID_Value: any;
  PayerID_DataSource: any[];
  PayerIDjsonData: any;
  Clinician_Value: any;
  Clinician_DataSource: any[];
  ClinicianJsonData: any;
  OrderingClinician_Value: any;
  OrderingClinician_DataSource: any[];
  orderingClinicianJsonData: any;
  ReceiverID_Value: any;
  RecieverID_DataSource: any[];
  RecieverIDjsonData: any;

  Denial_Amount: any;

  PatientID_Value: string;
  memberID_Value: string;
  ResubmissionType_DataSource: any[];
  Resubmission_Value: any;
  DenialCodes_Value: any[];
  FullyRejected_DataSource: any[];
  FullyRejected_Value: any;
  Ageing_DataSource: any[];
  Ageing_Value: any;

  loadingVisible: boolean;

  constructor(private reportServce: ReportService) {
    //============Year field dataSource===============
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year);
    }
    //=============month field datasource============
    this.monthDataSource = this.reportServce.getMonths();

    this.reportServce
      .get_SearchParametrs_resubmission_Data()
      .subscribe((resp: any) => {
        let initdata: any = resp;
        console.log('init data loaded successfully :>>', initdata);
      });
  }
  // ======================facility display expression ============
  facilityDisplayExpr = (item: any) => {
    return item ? `${item.FacilityLicense} - ${item.FacilityName}` : '';
  };
  //================Show and Hide Search parameters========
  toggleContent() {
    this.isContentVisible = !this.isContentVisible;
  }
  //==================MAking cutom datasource for facility datagrid and dropdown loADING=======
  makeAsyncDataSourceFromJson(jsonData: any) {
    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
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
  //============Hide drop down after Value Selected======
  onDropdownValueChanged() {
    const lookupInstance = this.lookup.instance;
    if (lookupInstance) {
      lookupInstance.close();
      lookupInstance.option('searchValue', '');
    }
  }

  //===========Function to handle selection change and sort the data==========
  onSelectionChanged(event: any, jsonData: any[], dataSourceKey: string): void {
    console.log('Original JSON Data:', jsonData);
    const selectedRows = event.selectedRowsData;
    const selectedRowIds = selectedRows.map((row) => row.ID);
    const unselectedRows = jsonData.filter(
      (row) => !selectedRowIds.includes(row.ID)
    );
    const reorderedData = [...selectedRows, ...unselectedRows];
    this[dataSourceKey] = this.makeAsyncDataSourceFromJson(reorderedData);
    console.log('Updated DataSource:', this[dataSourceKey]);
    this.dataGrid.instance.refresh();
  }

  //================ Year value change ===================
  onYearChanged(e: any): void {
    this.selectedYear = e.value;
    this.selectedmonth = '';
    const currentYear = new Date().getFullYear();
    const today = new Date();
    if (this.selectedYear === currentYear) {
      // Set from date to the start of the year and to date to today
      this.From_Date_Value = new Date(this.selectedYear, 0, 1); // January 1 of the current year
      this.To_Date_Value = today; // Today's date
    } else {
      this.From_Date_Value = new Date(this.selectedYear, 0, 1); // January 1
      this.To_Date_Value = new Date(this.selectedYear, 11, 31); // December 31
    }
  }

  //================Month value change ===================
  onMonthValueChanged(e: any) {
    this.selectedmonth = e.value ?? '';
    if (this.selectedmonth === '') {
      this.From_Date_Value = new Date(this.selectedYear, 0, 1); // January 1 of the selected year
      this.To_Date_Value = new Date(this.selectedYear, 11, 31); // December 31 of the selected year
    } else {
      this.From_Date_Value = new Date(this.selectedYear, this.selectedmonth, 1);
      this.To_Date_Value = new Date(
        this.selectedYear,
        this.selectedmonth + 1,
        0
      );
    }
  }

  get_advance_Filter() {}
  get_Datagrid_DataSource() {}
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
    DxLoadPanelModule,
    AdvanceFilterPopupModule,
    ClaimDetailActivityDrillDownModule,
  ],
  providers: [],
  exports: [AllocationPageComponent],
  declarations: [AllocationPageComponent],
})
export class AllocationPageModule {}
