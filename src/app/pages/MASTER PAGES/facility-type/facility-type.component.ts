import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { DxButtonModule, DxDataGridComponent, DxDataGridModule, DxDropDownButtonModule, DxLookupModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import notify from 'devextreme/ui/notify';
import { ReportService } from 'src/app/services/Report-data.service';
import { MasterReportService } from '../master-report.service';
import { DataService } from 'src/app/services';
import {
  FacilityTypeNewFormComponent,
  FacilityTypeNewFormModule,
} from '../../POP-UP_PAGES/facility-type-new-form/facility-type-new-form.component';
@Component({
  selector: 'app-facility-type',
  templateUrl: './facility-type.component.html',
  styleUrls: ['./facility-type.component.scss'],
  providers: [DataService, ReportService],
})
export class FacilityTypeComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(FacilityTypeNewFormComponent, { static: false })
  facilityTypeComponent: FacilityTypeNewFormComponent;

  dataSource: any;
  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  facilityGroupDatasource: any;
  isAddFormPopupOpened: boolean=false;

  constructor(
    private service: ReportService,
    private masterService: MasterReportService
  ) {}

  ngOnInit(): void {
    this.get_FacilityType_Data_List();
  }
//=========================show new popup=========================
  show_new_Form(){
    this.isAddFormPopupOpened = true;
  }

  //========================Get Datasource =======================
  get_FacilityType_Data_List() {
    this.masterService.Get_Facility_Type_Data().subscribe((response: any) => {
      this.dataSource = response.data
    });
  }

  //====================Add data ================================
  onClickSaveNewFacilityType = () => {
    const { FacilityTypeValue, DescriptionValue } =
      this.facilityTypeComponent.getNewFacilityTypeData();
    this.masterService
      .Insert_FacilityType_Data(FacilityTypeValue, DescriptionValue)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.get_FacilityType_Data_List();
          notify(
            {
              message: `New Facility type "${FacilityTypeValue} ${DescriptionValue}" saved Successfully`,
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

  //========================Export data ==========================
  onExporting(event: any) {
    this.service.exportDataGrid(event);
  }

  //====================Row Data Deleting========================
  onRowRemoving(event: any) {
    event.cancel = true;
    let SelectedRow = event.key;
    console.log('selected row data :', SelectedRow);
    this.masterService
      .Remove_FacilityType_Row_Data(SelectedRow.ID)
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
        this.get_FacilityType_Data_List();
      });
  }
  //===================RTow Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    // console.log('onrowUpdated Data getting ', combinedData);
    let id = combinedData.ID;
    let FacilityType = combinedData.FacilityType;
    let Description = combinedData.Description;

    this.masterService
      .update_facilityTYPE_data(id, FacilityType, Description)
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.get_FacilityType_Data_List();
          notify(
            {
              message: `New Facility type updated Successfully`,
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
    FacilityTypeNewFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [FacilityTypeComponent],
})
export class FacilityTypeModule {}
