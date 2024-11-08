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
export class LicenseInfoComponent implements OnInit, OnDestroy {
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

            // Modify the response data to add the serial number and format the expiry date
            response.data.forEach((item: any, index: number) => {
              item.serialNumber = index + 1;

              const expiryDate = new Date(item.Expiry_Date);
              item.Expiry_Date = expiryDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
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

  ngOnInit(): void {
    const Action = 0;
    this.currentPathName = this.router.url.replace('/', '');
    this.dataService
      .set_pageLoading_And_Closing_Log(Action, this.currentPathName)
      .subscribe((response: any) => {});

    this.initialized = true;
  }

  ngOnDestroy(): void {
    if (this.initialized) {
      const Action = 10;
      this.dataService
        .set_pageLoading_And_Closing_Log(Action, this.currentPathName)
        .subscribe((response: any) => {});
    }
  }

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
