import { Message } from 'src/app/types/messages';
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
import {
  FacilityGroupNewFormComponent,
  FacilityGroupNewFormModule,
} from '../../POP-UP_PAGES/facility-group-new-form/facility-group-new-form.component';
import { FormPopupModule } from 'src/app/components';

@Component({
  selector: 'app-facility-group-list',
  templateUrl: './facility-group-list.component.html',
  styleUrls: ['./facility-group-list.component.scss'],
  providers: [DataService, ReportService],
})
export class FacilityGroupListComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(FacilityGroupNewFormComponent, { static: false })
  facilityGroupComponent: FacilityGroupNewFormComponent;

  isAddFormPopupOpened: any = false;
  dataSource: any;
  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  facilityGroupDatasource: any;

  constructor(
    private service: ReportService,
    private masterService: MasterReportService
  ) {}

  ngOnInit(): void {
    this.get_Facility_Group_Data_List();
  }
  //=============Showing the new Facility Form===================
  show_new_FacilityGroup_Form() {
    this.isAddFormPopupOpened = true;
  }
  //====================get Facility group dropdown ==============
  get_FacilityGroup_DropDown() {
    this.masterService
      .Get_GropDown('FACILITYGROUP')
      .subscribe((response: any) => {
        this.facilityGroupDatasource = response;
      });
  }
  //========================Get Datasource =======================
  get_Facility_Group_Data_List() {
    this.masterService.Get_Facility_Group_Data().subscribe((response: any) => {
      this.dataSource = response.data;
    });
  }
  //========================Export data ==========================
  onExporting(event: any) {
    const fileName='Facility Group'
    this.service.exportDataGrid(event,fileName);
  }
  //====================Add data ================================
  onClickSaveNewFacilityGroup = () => {
    const { FacilityGroupValue, DescriptionValue } =
      this.facilityGroupComponent.getNewFacilityGroupData();
    this.masterService
      .Insert_FacilityGroup_Data(FacilityGroupValue, DescriptionValue)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.get_Facility_Group_Data_List();
          notify(
            {
              message: `New Facility Group "${FacilityGroupValue} ${DescriptionValue}" saved Successfully`,
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
        } else {
          notify(
            {
              message: `Your Data Not Saved`,
              position: { at: 'top right', my: 'top right' },
            },
            'error'
          );
        }
      });
  };

  //====================Row Data Deleting========================
  onRowRemoving(event: any) {
    event.cancel = true;
    let SelectedRow = event.key;
    this.masterService
      .Remove_Facility_Group_Data(SelectedRow.ID)
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
        this.get_Facility_Group_Data_List();
      });
  }
  //===================RTow Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    // console.log('onrowUpdated Data getting ', combinedData);
    let id = combinedData.ID;
    let facilityGroup = combinedData.FacilityGroup;
    let Description = combinedData.Description;

    this.masterService
      .update_facilityGroup_data(id, facilityGroup, Description)
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.get_Facility_Group_Data_List();
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
    FormPopupModule,
    FacilityGroupNewFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [FacilityGroupListComponent],
})
export class FacilityGroupListModule {}
