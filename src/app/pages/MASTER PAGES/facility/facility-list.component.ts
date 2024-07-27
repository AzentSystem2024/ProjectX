import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDropDownButtonModule,
  DxLookupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { DataService } from 'src/app/services';
import { ReportService } from 'src/app/services/Report-data.service';
import { MasterReportService } from '../master-report.service';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.scss'],
  providers: [ReportService],
})
export class FacilityListComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  dataSource: any;
  FacilityType_DataSource: any;
  Facilitygroup_DataSource: any;
  postOffice_DataSource: any;
  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  constructor(
    private service: ReportService,
    private masterService: MasterReportService
  ) {}
  ngOnInit(): void {
    this.get_All_DropDown_Data();
    this.get_Facility_List();
  }
  get_All_DropDown_Data() {
    this.masterService
      .Get_GropDown('FACILITYTYPE')
      .subscribe((response: any) => {
        if (response) {
          this.FacilityType_DataSource = response;
        }
      });

    this.masterService
      .Get_GropDown('FACILITYGROUP')
      .subscribe((response: any) => {
        if (response) {
          this.Facilitygroup_DataSource = response;
        }
      });

    this.masterService.Get_GropDown('POSTOFFICE').subscribe((response: any) => {
      if (response) {
        this.postOffice_DataSource = response;
      }
    });
  }

  //========================Export data ==========================
  onExporting(event: any) {
    this.service.exportDataGrid(event);
  }

  //====================Get Facility List Datasource==============
  get_Facility_List() {
    this.masterService.Get_Facility_List_Data().subscribe((response: any) => {
      if (response) {
        this.dataSource = response.data;
      }
    });
  }

  //===================Row Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    console.log(event);
    const combinedData = { ...oldData, ...updataDate };
    let id = combinedData.ID;
    let FacilityLicense = combinedData.FacilityLicense;
    let FacilityName = combinedData.FacilityName;
    let Region = combinedData.Region;
    let FacilityTypeID = combinedData.FacilityTypeID;
    let FacilityGroupID = combinedData.FacilityGroupID;
    let FacilityAddress = combinedData.FacilityAddress;
    let PostOfficeID = combinedData.PostOfficeID;

    this.masterService
      .update_facility_data(
        id,
        FacilityLicense,
        FacilityName,
        Region,
        FacilityTypeID,
        FacilityGroupID,
        FacilityAddress,
        PostOfficeID
      )
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.get_Facility_List();
          notify(
            {
              message: `New Facility Group updated Successfully`,
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

  //====================Row Data Deleting=========================
  onRowRemoving(event: any) {
    event.cancel = true;
    let SelectedRow = event.key;
    this.masterService
      .Remove_Facility_Row_Data(SelectedRow.ID)
      .subscribe(() => {
        try {
          notify(
            {
              message: 'Delete operation successful',
              position: { at: 'top right', my: 'top right' },
              displayTime: 500,
            },
            'success'
          );
        } catch (error) {
          notify(
            {
              message: 'Delete operation failed',
              position: { at: 'top right', my: 'top right' },
              displayTime: 500,
            },
            'error'
          );
        }
        event.component.refresh();
        this.dataGrid.instance.refresh();
        this.get_Facility_List();
      });
  }
  //=================== Page refreshing==========================
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
  declarations: [FacilityListComponent],
})
export class FacilityListModule {}
