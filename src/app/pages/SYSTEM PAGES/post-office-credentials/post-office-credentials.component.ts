import { MasterReportService } from './../../MASTER PAGES/master-report.service';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-post-office-credentials',
  templateUrl: './post-office-credentials.component.html',
  styleUrls: ['./post-office-credentials.component.scss'],
  providers: [ReportService],
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
  dataSource: any;
  isSearchPanelVisible = false;
  postOffice_DropDownData: any;

  constructor(
    private systemService: SystemServicesService,
    private service: ReportService
  ) {}
  ngOnInit(): void {
    this.getDenial_Type_DropDown();
    this.get_PostOfficeCredencial_List();
  }

  //=============Get Denial Type Drop dwn Data==============================
  getDenial_Type_DropDown() {
    let dropdownType = 'POSTOFFICE';
    this.systemService.Get_GropDown(dropdownType).subscribe((data: any) => {
      this.postOffice_DropDownData = data;
    });
  }

  //====================Get post office credentials List==============
  get_PostOfficeCredencial_List() {
    this.systemService
      .get_PostOfficeCredencial_List()
      .subscribe((response: any) => {
        if (response) {
          this.dataSource = this.transformData(response);
        }
      });
  }

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
          this.get_PostOfficeCredencial_List();
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
        // event.component.refresh();
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
    this.service.exportDataGrid(event);
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
