import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-license-info',
  templateUrl: './license-info.component.html',
  styleUrls: ['./license-info.component.scss'],
  providers: [ReportService],
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
  DataSource: any; //===DataSorce Variable==
  ProductKey: any;
  LicensedTo: any;

  constructor(
    private service: ReportService,
    private systemService: SystemServicesService
  ) {
    this.get_list_dataSource();
  }

  //====================Get all listing Data======================
  get_list_dataSource() {
    this.systemService.list_license_info_data().subscribe((response: any) => {
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

      this.DataSource = response.data;
    });
  }

  //========================Export data ==========================
  onExporting(event: any) {
    const fileName='licence-info'
    this.service.exportDataGrid(event,fileName);
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
