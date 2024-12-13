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
export class PostOfficeCredentialsComponent implements OnInit {
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
              const transformedData = this.transformData(response.data); // Transform the data
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

  columns: any;
  constructor(
    private systemService: SystemServicesService,
    private service: ReportService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getDenial_Type_DropDown();

    this.dataGrid.instance.refresh();
  }

  //=============Get Denial Type Drop dwn Data==============================
  getDenial_Type_DropDown() {
    let dropdownType = 'POSTOFFICE';
    this.systemService.Get_GropDown(dropdownType).subscribe((data: any) => {
      this.postOffice_DropDownData = data;
      this.columns = [
        {
          dataField: 'FacilityLicense',
          caption: 'Facility License',
          allowEditing: false,
          allowReordering: false,
          allowHiding: false,
        },
        {
          dataField: 'FacilityName',
          caption: 'Facility Name',
          allowEditing: false,
          allowReordering: false,
          allowHiding: false,
          width: '150',
        },
        {
          dataField: 'PostOfficeID',
          caption: 'Post Office',

          lookup: {
            dataSource: this.postOffice_DropDownData,
            displayExpr: 'DESCRIPTION',
            valueExpr: 'ID',
          },
        },
        {
          dataField: 'LoginName',
          caption: 'Login Name',
        },
        {
          dataField: 'Password',
          caption: 'Password',
          editorOptions: {
            mode: 'password',
          },
          cellTemplate: (container: any, options: any) => {
            const maskedPassword = '*'.repeat(options.value?.length || 0);
            container.textContent = maskedPassword;
          },
        },
        {
          caption: 'Status',
          dataField: 'IsVerified',
          allowEditing: false,
          cellTemplate: (container: any, options: any) => {
            const button = document.createElement('button');
            button.textContent = options.value ? 'Verified' : 'Not Verified';
            button.style.backgroundColor = options.value ? '#00a1e0' : 'red';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            container.appendChild(button);
          },
        },
        {
          dataField: 'LastModifiedTime',
          caption: 'Last Verified Time',
          width: 'auto',
        },
      ];
    });
  }

  //===============Change the last modified data format =============
  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    // Adjust for 5 hours and 30 minutes
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    // Return formatted date and time
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
      LastModifiedTime: this.formatDateTime(item.LastModifiedTime),
    }));
  }

  //==================update data===================
  onRowUpdating(event: any) {
    const oldData = event.oldData;
    const newData = event.newData;
    const updatedData = { ...oldData, ...newData };
    const { FacilityID, PostOfficeID, LoginName, Password } = updatedData;

    this.systemService
      .verify_update_PostOfficeCredencial_Data(
        FacilityID,
        PostOfficeID,
        LoginName,
        Password
      )
      .subscribe(
        (verifyResponse: any) => {
          if (verifyResponse.flag === 1) {
            notify(
              {
                message: `Verification successful! Proceeding to update.`,
                position: { at: 'top right', my: 'top right' },
                displayTime: 5000,
              },
              'success'
            );
            // If verification is successful, proceed to update the data
            this.systemService
              .update_PostOfficeCredencial_Data(
                FacilityID,
                PostOfficeID,
                LoginName,
                Password
              )
              .subscribe(
                (updateResponse: any) => {
                  if (updateResponse) {
                    notify(
                      {
                        message: `${updateResponse.message}`,
                        position: { at: 'top right', my: 'top right' },
                        displayTime: 1000,
                      },
                      'success'
                    );
                    this.dataGrid.instance.refresh(); // Refresh the grid after update
                  } else {
                    notify(
                      {
                        message: `Failed to update data.`,
                        position: { at: 'top right', my: 'top right' },
                        displayTime: 1000,
                      },
                      'error'
                    );
                  }
                  event.component.cancelEditData(); // Close the edit popup
                },
                (error: any) => {
                  console.error('Update error:', error);
                  notify(
                    {
                      message: `Error updating data: ${error.message}`,
                      position: { at: 'top right', my: 'top right' },
                      displayTime: 1000,
                    },
                    'error'
                  );
                  event.component.cancelEditData();
                }
              );
          } else {
            notify(
              {
                message: `Verification failed. Update not performed.`,
                position: { at: 'top right', my: 'top right' },
                displayTime: 1000,
              },
              'error'
            );
            event.component.cancelEditData(); // Close the edit popup
          }
        },
        (error: any) => {
          console.error('Verification error:', error);
          notify(
            {
              message: `Error verifying data: ${error.message}`,
              position: { at: 'top right', my: 'top right' },
              displayTime: 1000,
            },
            'error'
          );
          event.component.cancelEditData();
        }
      );

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
