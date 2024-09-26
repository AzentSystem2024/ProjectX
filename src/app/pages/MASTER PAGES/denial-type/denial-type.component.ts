import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { DxDataGridModule, DxButtonModule, DxDropDownButtonModule, DxSelectBoxModule, DxTextBoxModule, DxLookupModule, DxDataGridComponent } from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { DinialTypeNewFormComponent } from '../../POP-UP_PAGES/dinial-type-new-form/dinial-type-new-form.component';
import { DenialTypeNewFormModule } from '../../POP-UP_PAGES/dinial-type-new-form/dinial-type-new-form.component';
import { ReportService } from 'src/app/services/Report-data.service';
import notify from 'devextreme/ui/notify';
import { MasterReportService } from '../master-report.service';
@Component({
  selector: 'app-denial-type',
  templateUrl: './denial-type.component.html',
  styleUrls: ['./denial-type.component.scss'],
  providers:[ReportService]
})
export class DenialTypeComponent implements OnInit{
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(DinialTypeNewFormComponent, { static: false })
  DenialTypeNewForm: DinialTypeNewFormComponent;

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
    this.get_DenialType_Data_List();
  }
//=========================show new popup=========================
  show_new_Form(){
    this.isAddFormPopupOpened = true;
  }

  //========================Get Datasource =======================
  get_DenialType_Data_List() {
    this.masterService.get_DenialType_List().subscribe((response: any) => {
      this.dataSource = response.data
    });
  }

  //====================Add data ================================
  onClickSaveNewDenialType = () => {
    const { DenialTypeValue, DescriptionValue } =
      this.DenialTypeNewForm.getNewDenialTypeData();
    this.masterService
      .Insert_DenialType_Data(DenialTypeValue, DescriptionValue)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.DenialTypeNewForm.resetDenialTypeData()
          this.get_DenialType_Data_List();
          notify(
            {
              message: `New Denial Type "${DenialTypeValue} ${DescriptionValue}" saved Successfully`,
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
    const fileName='Denial Type'
    this.service.exportDataGrid(event,fileName);
  }

  //====================Row Data Deleting========================
  onRowRemoving(event: any) {
    event.cancel = true;
    let SelectedRow = event.key;
    this.masterService
      .Remove_DenialType_Row_Data(SelectedRow.ID)
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
        this.get_DenialType_Data_List();
      });
  }
  //===================RTow Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    // console.log('onrowUpdated Data getting ', combinedData);
    let id = combinedData.ID;
    let DenialTypeValue = combinedData.DenialType;
    let Description = combinedData.Description;

    this.masterService
      .update_DenialType_data(id, DenialTypeValue, Description)
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.get_DenialType_Data_List();
          notify(
            {
              message: `New Denial Type updated Successfully`,
              position: { at: 'top right', my: 'top right' },
              displayTime: 1000,
            },
            'success'
          );
        } else {
          notify(
            {
              message: `Your Data Not Saved`,
              position: { at: 'top right', my: 'top right' },
              displayTime: 1000,
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
    DenialTypeNewFormModule
  ],
  providers: [],
  exports: [],
  declarations: [DenialTypeComponent],
})
export class DENIALTypeModule {}
