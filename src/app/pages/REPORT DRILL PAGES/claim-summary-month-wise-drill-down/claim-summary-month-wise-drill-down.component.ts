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
import { DxTabPanelModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-claim-summary-month-wise-drill-down',
  templateUrl: './claim-summary-month-wise-drill-down.component.html',
  styleUrls: ['./claim-summary-month-wise-drill-down.component.scss'],
})
export class ClaimSummaryMonthWiseDrillDownComponent implements OnChanges {
  @Input() clickedRowData: any | '';
  @Input() DetailData: any | '';

  width: any = '100%';
  rtlEnabled: boolean = false;
  scrollByContent: boolean = true;
  orientation: any = 'vertical';
  stylingMode: any = 'secondary';
  iconPosition: any = 'left';

  selectedTabIndex = 0;
  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = ['all'];
  pageSize: any = 'all';
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  show_Pagination = true;

  TabViewDataSource: any;
  GridDataSource: any;

  tabsPosition: any = 'left';

  loadingVisible: boolean;
  isContentVisible: boolean = true;

  isEmptyDatagrid: boolean = true;
  columndata: any;
  columnsConfig: any;
  ColumnNames: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clickedRowData'] && this.clickedRowData) {
      this.loadingVisible = true;
      this.isContentVisible = true;
      console.log('clicked row data :', this.clickedRowData);

      this.TabViewDataSource = this.DetailData.Groups.split(',').map(
        (group) => ({
          text: group.trim(),
        })
      );

      if (this.DetailData) {
        // console.log('clicked row data :', this.clickedRowData);
        this.get_Datagrid_DataSource();
      }
    }
  }

  //===========Fetch DataSource For The Datagrid Table============
  async get_Datagrid_DataSource() {
    this.isContentVisible = false;
    this.loadingVisible = true;

    try {
      const response: any = this.DetailData;
      if (response.ReportID != '') {
        this.isEmptyDatagrid = false;
        this.columndata = response.ReportColumns;

        const userLocale = navigator.language || 'en-US';
        // console.log('user locale settings:', userLocale);

        this.columnsConfig = this.generateColumnsConfig(
          response.ReportColumns,
          userLocale
        );
        // console.log('column details=>', this.columnsConfig);
        const ReportData = response.ReportData;

        // Initialize dataGrid_DataSource with the pre-loaded data
        this.GridDataSource = new DataSource<any>({
          load: () => Promise.resolve(ReportData),
        });
        // console.log('grid datasource=', this.GridDataSource);
        this.loadingVisible = false;
      } else {
        this.loadingVisible = false;
        notify(
          {
            message: `${response.message}`,
            position: { at: 'top right', my: 'top right' },
          },
          'error'
        );
      }
    } catch (error) {
      this.loadingVisible = false;
      this.isContentVisible = true;
      notify(
        {
          message: `An error occurred while fetching the data. Please try again later.`,
          position: { at: 'top right', my: 'top right' },
          displayTime: 3000,
        },
        'error'
      );
    }
  }
  //=================create column configuration data=============
  generateColumnsConfig(reportColumns: any, userLocale: any) {
    return reportColumns.map((column) => {
      let columnFormat;

      if (column.Type === 'DateTime') {
        columnFormat = {
          type: 'date',
          formatter: (date) =>
            new Intl.DateTimeFormat(userLocale, {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            }).format(new Date(date)),
        };
      }
      if (column.Type === 'Decimal') {
        columnFormat = {
          type: 'fixedPoint',
          precision: 2,
          formatter: (value) =>
            new Intl.NumberFormat(userLocale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value),
        };
      }
      if (column.Type === 'Percentage') {
        columnFormat = 'percent';
      }
      return {
        dataField: column.Name,
        caption: column.Title,
        visible: column.Visibility,
        type: column.Type,
        format: columnFormat,
      };
    });
  }
  //===============Datagrid row click event=======================
  handleRowDrillDownClick = (e: any) => {
    console.log('row clicked');
  };
  //====================side tabs click event====================
  onTabClick(e: any) {
    console.log('selected tab data', e);
    this.selectedTabIndex = e.itemIndex; // Update selected index on tab click
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
    DxTabPanelModule,
  ],
  providers: [],
  exports: [ClaimSummaryMonthWiseDrillDownComponent],
  declarations: [ClaimSummaryMonthWiseDrillDownComponent],
})
export class ClaimSummaryMonthWiseDrillDownModule {}
