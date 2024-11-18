import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
  ViewChild,
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
  DxDataGridComponent,
  DxPopupModule,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { ReportService } from 'src/app/services/Report-data.service';
import { ReportEngineService } from '../../REPORT PAGES/report-engine.service';
import { DxTabPanelModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { ClaimDetailActivityDrillDownComponent } from '../claim-detail-activity-drill-down/claim-detail-activity-drill-down.component';
import { ClaimDetailActivityDrillDownModule } from '../claim-detail-activity-drill-down/claim-detail-activity-drill-down.component';
@Component({
  selector: 'app-claim-summary-month-wise-drill-down',
  templateUrl: './claim-summary-month-wise-drill-down.component.html',
  styleUrls: ['./claim-summary-month-wise-drill-down.component.scss'],
})
export class ClaimSummaryMonthWiseDrillDownComponent implements OnChanges {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  @Input() clickedRowData: any | '';
  @Input() DetailData: any | '';

  width: any = '100%';
  rtlEnabled: boolean = false;
  scrollByContent: boolean = true;
  orientation: any = 'vertical';
  stylingMode: any = 'secondary';
  iconPosition: any = 'left';

  selectedTabIndex: any = 0;
  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [10, 20, 'all'];
  pageSize: any = '10';
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
  InnerClickedRowData: any;
  Year: any;
  Month: any;
  FacilityID: any;
  ReportData: any;
  filteredData: any;
  // isDrillDownPopupOpened: boolean = false;
  isSecondDrillOpened: boolean = false;
  selectedTab: any;

  constructor(private service: ReportService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clickedRowData'] && this.clickedRowData) {
      this.loadingVisible = true;
      this.isContentVisible = true;
      this.Year = this.clickedRowData.ClaimYear;
      this.Month = this.clickedRowData.ClaimMonth;
      this.FacilityID = this.clickedRowData.FacilityID;
      if (this.Year && this.Month && this.FacilityID) {
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

        this.columnsConfig = this.generateColumnsConfig(
          response.ReportColumns,
          userLocale
        );

        this.ReportData = response.ReportData.filter((item: any) => {
          return (
            item.ClaimMonth == this.Month &&
            item.ClaimYear == this.Year &&
            item.FacilityID == this.FacilityID
          );
        });

        const isClaimedCount = this.ReportData.filter(
          (item: any) => item.IsClaimed === 1
        ).length;
        const isRemmitedCount = this.ReportData.filter(
          (item: any) => item.IsRemmited === 1
        ).length;
        const isRejectedCount = this.ReportData.filter(
          (item: any) => item.IsRejected === 1
        ).length;
        const isPendingRemittanceCount = this.ReportData.filter(
          (item: any) => item.IsPendingRemittance === 1
        ).length;
        const isPartiallyPaidCount = this.ReportData.filter(
          (item: any) => item.IsPartiallyPaid === 1
        ).length;
        const isFullyPaidCount = this.ReportData.filter(
          (item: any) => item.IsFullyPaid === 1
        ).length;
        const isFullyRejectedCount = this.ReportData.filter(
          (item: any) => item.IsFullyRejected === 1
        ).length;
        const isSelfPaidCount = this.ReportData.filter(
          (item: any) => item.IsSelfPaid === 1
        ).length;

        // Mapping of tab labels to counts
        const tabCounts: { [key: string]: number } = {
          Claimed: isClaimedCount,
          Remitted: isRemmitedCount,
          Rejected: isRejectedCount,
          PendingRemittance: isPendingRemittanceCount,
          'Partially Paid': isPartiallyPaidCount,
          'Fully Paid': isFullyPaidCount,
          'Fully Rejected': isFullyRejectedCount,
          'Self Pay': isSelfPaidCount,
        };

        // Update TabViewDataSource with concatenated count
        this.TabViewDataSource = this.DetailData.Groups.split(',').map(
          (group) => {
            const groupName = group.trim();
            const count = tabCounts[groupName] || 0; // Get count or 0 if not found
            return {
              text: `${groupName} (${count})`,
            };
          }
        );
        this.selectedTab = this.TabViewDataSource[0].text.replace(
          /\s\(\d+\)$/,
          ''
        );

        // Initialize dataGrid_DataSource with the pre-loaded data
        this.GridDataSource = new DataSource<any>({
          load: () => Promise.resolve(this.ReportData),
        });

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
    this.InnerClickedRowData = e.row.data;
    // console.log('inner drill down data =>', this.InnerClickedRowData);
    this.isSecondDrillOpened = true;
  };

  //====================side tabs click event====================
  onTabClick(e: any) {
    this.selectedTab = e.itemData.text.replace(/\s\(\d+\)$/, '');

    switch (this.selectedTab) {
      case 'Claimed':
        this.filteredData = this.ReportData.filter(
          (item: any) => item.IsClaimed === 1
        );
        break;
      case 'Remitted':
        this.filteredData = this.ReportData.filter(
          (item: any) => item.IsRemmited === 1
        );
        break;
      case 'Rejected':
        this.filteredData = this.ReportData.filter(
          (item: any) => item.IsRejected === 1
        );
        break;
      case 'PendingRemittance':
        this.filteredData = this.ReportData.filter(
          (item: any) => item.IsPendingRemittance === 1
        );
        break;
      case 'Partially Paid':
        this.filteredData = this.ReportData.filter(
          (item: any) => item.IsPartiallyPaid === 1
        );
        break;
      case 'Fully Paid':
        this.filteredData = this.ReportData.filter(
          (item: any) => item.IsFullyPaid === 1
        );
        break;
      case 'Fully Rejected':
        this.filteredData = this.ReportData.filter(
          (item: any) => item.IsFullyRejected === 1
        );
        break;
      case 'Self Pay':
        this.filteredData = this.ReportData.filter(
          (item: any) => item.IsSelfPaid === 1
        );
        break;
      default:
        break;
    }
    // Update data grid or display data
    this.dataGrid.instance.refresh();
    this.GridDataSource = this.filteredData; // Assuming dataGridSource is bound to the data grid
  }

  //================Exporting Function===================
  onExporting(event: any) {
    const fileName = `${this.selectedTab}`;
    if (fileName) {
      this.service.exportDataGrid(event, fileName);
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
    DxTabPanelModule,
    DxPopupModule,
    ClaimDetailActivityDrillDownModule,
  ],
  providers: [],
  exports: [ClaimSummaryMonthWiseDrillDownComponent],
  declarations: [ClaimSummaryMonthWiseDrillDownComponent],
})
export class ClaimSummaryMonthWiseDrillDownModule {}
