import { MasterReportService } from './../../MASTER PAGES/master-report.service';
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
import { SystemServicesService } from '../system-services.service';
import { ReportService } from 'src/app/services/Report-data.service';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-post-office-credentials',
  templateUrl: './post-office-credentials.component.html',
  styleUrls: ['./post-office-credentials.component.scss'],
  providers: [ReportService, DataService],
})
export class PostOfficeCredentialsComponent implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  isSearchPanelVisible = false;
  postOffice_DropDownData: any;

  dataSource = new DataSource<any>({
    load: () =>
      new Promise((resolve, reject) => {
        this.systemService.get_PostOfficeCredencial_List().subscribe({
          next: (response: any) => {
            if (response) {
              const transformedData = this.transformData(response); // Transform the data
              resolve(transformedData); // Resolve with the transformed data
            } else {
              resolve([]); // Resolve with an empty array if response is falsy
            }
          },
          error: (error) => reject(error.message), // Reject with the error message
        });
      }),
  });
  currentPathName: any;
  initialized: boolean;

  constructor(
    private systemService: SystemServicesService,
    private service: ReportService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getDenial_Type_DropDown();
    const Action = 0;
    this.currentPathName = this.router.url.replace('/', '');
    this.dataService
      .set_pageLoading_And_Closing_Log(Action, this.currentPathName)
      .subscribe((response: any) => {
        console.log(response);
      });

    this.initialized = true;
  }

  ngOnDestroy(): void {
    if (this.initialized) {
      const Action = 10;
      this.dataService
        .set_pageLoading_And_Closing_Log(Action, this.currentPathName)
        .subscribe((response: any) => {
          console.log(response);
        });
    }
  }

  //=============Get Denial Type Drop dwn Data==============================
  getDenial_Type_DropDown() {
    let dropdownType = 'POSTOFFICE';
    this.systemService.Get_GropDown(dropdownType).subscribe((data: any) => {
      this.postOffice_DropDownData = data;
    });
  }

  //====================Get post office credentials List==============
  // get_PostOfficeCredencial_List() {
  //   this.systemService
  //     .get_PostOfficeCredencial_List()
  //     .subscribe((response: any) => {
  //       if (response) {
  //         this.dataSource = this.transformData(response);
  //       }
  //     });
  // }

  //===============Change the last modified data format =============
  formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    return date
      .toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .replace(',', '');
  }

  transformData(data: any) {
    return data.map((item: any) => ({
      ...item,
      LastModified_Time: this.formatDateTime(item.LastModified_Time),
    }));
  }

  //==================update data===================
  onRowUpdating(event: any) {
    const oldData = event.oldData;
    const newData = event.newData;
    const updatedData = { ...oldData, ...newData };
    let id = updatedData.ID;
    let FacilityID = updatedData.ID;
    let PostOfficeID = updatedData.PostOfficeID;
    let LoginName = updatedData.LoginName;
    let Password = updatedData.Password;
    this.systemService
      .update_PostOfficeCredencial_Data(
        FacilityID,
        PostOfficeID,
        LoginName,
        Password
      )
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();

          notify(
            {
              message: ` updated Successfully`,
              position: { at: 'top right', my: 'top right' },
              displayTime: 500,
            },
            'success'
          );
        } else {
          notify(
            {
              message: `Your Data Not Saved`,
              position: { at: 'top right', my: 'top right' },
              displayTime: 500,
            },
            'error'
          );
        }
        event.component.cancelEditData(); // Close the popup
        this.dataGrid.instance.refresh();
      });

    event.cancel = true; // Prevent the default update operation
  }

  // onRowRemoving(event: any) {}
  //=================== Page refreshing==========================
  refresh = () => {
    this.dataGrid.instance.refresh();
  };

  //========================Export data ==========================
  onExporting(event: any) {
    const fileName = 'Post-office-credentials';
    this.service.exportDataGrid(event, fileName);
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
  ],
  providers: [],
  exports: [],
  declarations: [PostOfficeCredentialsComponent],
})
export class PostOfficeCredentialsModule {}
