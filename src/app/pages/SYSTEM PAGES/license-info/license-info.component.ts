import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxDataGridComponent,
} from 'devextreme-angular';
import { ReportService } from 'src/app/services/Report-data.service';
import { SystemServicesService } from '../system-services.service';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-license-info',
  templateUrl: './license-info.component.html',
  styleUrls: ['./license-info.component.scss'],
  providers: [ReportService, DataService],
})
export class LicenseInfoComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;

  ProductKey: any;
  LicensedTo: any;

  DataSource = new DataSource<any>({
    load: () =>
      new Promise((resolve, reject) => {
        this.systemService.list_license_info_data().subscribe({
          next: (response: any) => {
            this.LicensedTo = response.CustomerName;
            this.ProductKey = response.ProductKey;
            response.data.forEach((item: any, index: number) => {
              item.serialNumber = index + 1;

              item.Expiry_Date = this.dataService.formatDateTime(
                item.Expiry_Date
              );
            });

            resolve(response.data); // Resolve with the modified data
          },
          error: (error) => reject(error.message), // Reject with the error message
        });
      }),
  });
  currentPathName: any;
  initialized: boolean;

  constructor(
    private service: ReportService,
    private systemService: SystemServicesService,
    private router: Router,
    private dataService: DataService
  ) {}

  //========================Export data ==========================
  onExporting(event: any) {
    const fileName = 'licence-info';
    this.service.exportDataGrid(event, fileName);
  }
  //=================== Page refreshing===========================
  refresh = () => {
    this.dataGrid.instance.refresh();
  };
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
  ],
  providers: [],
  exports: [],
  declarations: [LicenseInfoComponent],
})
export class LicenseInfoModule {}
