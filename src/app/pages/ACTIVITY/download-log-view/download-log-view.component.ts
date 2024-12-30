import { CommonModule, formatDate } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';

import {
  DxDataGridModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxDataGridComponent,
  DxDateBoxModule,
} from 'devextreme-angular';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import DataSource from 'devextreme/data/data_source';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-download-log-view',
  templateUrl: './download-log-view.component.html',
  styleUrls: ['./download-log-view.component.scss'],
})
export class DownloadLogViewComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;

  dataSource: any;
  startDate: any = new Date();
  endDate: any = new Date();
  columns: any;

  constructor(private dataService: DataService) {
    this.fetch_download_log_data();
  }

  fetch_download_log_data() {
    console.log('calling fetcg function');
    this.dataSource = new DataSource<any>({
      load: () =>
        new Promise((resolve, reject) => {
          const fromDate = this.formatDateTime(this.startDate);
          const endDate = this.formatDateTime(this.endDate);
          this.dataService
            .get_Download_Log_DataView(fromDate, endDate)
            .subscribe({
              next: (response: any) => {
                if (response && response.data && Array.isArray(response.data)) {
                  const formattedData = response.data.map(
                    (item: any, index: number) => ({
                      SerialNumber: index + 1,
                      LOG_TIME: this.dataService.formatDateTime(item.LOG_TIME),
                      INSTANCE: item.INSTANCE,
                      FACILITY_LICENSE: item.FACILITY_LICENSE,
                      DOWNLOAD_TYPE: item.DOWNLOAD_TYPE,
                      IS_ERROR: item.IS_ERROR,
                      LOG_MESSAGE: item.LOG_MESSAGE,
                    })
                  );
                  resolve(formattedData);
                  this.update_Columns();
                } else {
                  resolve([]);
                }
              },
              error: (error) => {
                console.error('Error loading data:', error);
                reject(error.message);
              },
            });
        }),
    });
  }

  update_Columns() {
    console.log('calling column update function');
    this.columns = [
      {
        dataField: 'SerialNumber',
        caption: 'SL NO',
        allowEditing: false,
        alignment: 'left',
        width: 80,
      },
      {
        dataField: 'LOG_TIME',
        caption: 'Date And Time',
        allowEditing: false,
      },
      {
        dataField: 'INSTANCE',
        caption: 'Instance',
        allowEditing: false,
      },
      {
        dataField: 'FACILITY_LICENSE',
        caption: 'Facility',
        allowEditing: false,
      },
      {
        dataField: 'LOG_MESSAGE',
        caption: 'Description',
        allowEditing: false,
        width: 200,
      },
      {
        dataField: 'IS_ERROR',
        caption: ' ',
        allowEditing: false,
        allowSorting: false,
        allowResizing: false,
        allowHeaderFiltering: false,
        allowReordering: false,
        allowGrouping: false,
        width: 'auto',
        cellTemplate: (container: any, options: any) => {
          const button = document.createElement('button');
          button.textContent = options.value ? 'Error' : 'No Error';
          button.style.backgroundColor = options.value ? 'red' : '#2393d9';
          button.style.color = 'white';
          button.style.border = 'none';
          button.style.borderRadius = '5px';
          button.style.padding = '5px';
          container.appendChild(button);
        },
      },
    ];
  }

  //=================DAte format changing to needed format========
  formatDateTime(date: string): string {
    return formatDate(new Date(date), 'yyyy-MM-dd', 'en-US');
  }

  refresh = () => {
    this.dataGrid.instance.refresh();
  };
}
@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxLookupModule,
    DxDateBoxModule,
  ],
  providers: [],
  exports: [],
  declarations: [DownloadLogViewComponent],
})
export class DownloadLogViewModule {}
