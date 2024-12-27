import { CommonModule, formatDate } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import DevExpress from 'devextreme';
import {
  DxDataGridModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxDataGridComponent,
  DxDateBoxModule,
  DevExtremeModule,
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
          // console.log('From date and end date:', fromDate, endDate);
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
        alignment: 'center',
        width: 80,
      },
      {
        dataField: 'LOG_TIME',
        caption: 'Date And Time',
        allowEditing: false,
        width: 200,
      },
      {
        dataField: 'INSTANCE',
        caption: 'Instance',
        allowEditing: false,
        width: 150,
      },
      {
        dataField: 'FACILITY_LICENSE',
        caption: 'Facility',
        allowEditing: false,
        width: 180,
      },
      {
        dataField: 'IS_ERROR',
        caption: ' ',
        allowEditing: false,
        width: 'auto',
        cellTemplate: (container: any, options: any) => {
          const icon = options.value ? 'error' : 'check'; // Set the icon based on the value
          const button = document.createElement('div'); // Create a div to hold the button
          container.appendChild(button);
          // Create and append the DevExtreme button with an icon
          const dxButton = new DevExpress.ui.dxButton(button, {
            icon: icon, // Use DevExtreme icon
            stylingMode: 'contained', // Optional: To add background color
            type: 'normal',
            width: 'auto',
            height: 'auto',
          });
        },
      },
      {
        dataField: 'LOG_MESSAGE',
        caption: 'Description',
        allowEditing: false,
        width: 250,
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
    DevExtremeModule,
  ],
  providers: [],
  exports: [],
  declarations: [DownloadLogViewComponent],
})
export class DownloadLogViewModule {}
