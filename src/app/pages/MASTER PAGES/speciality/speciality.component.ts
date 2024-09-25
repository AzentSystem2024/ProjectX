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
import { FormPopupModule } from 'src/app/components';
import { InsuranceNewFormModule } from '../../POP-UP_PAGES/insurance-new-form/insurance-new-form.component';
import notify from 'devextreme/ui/notify';
import { ReportService } from 'src/app/services/Report-data.service';
import { MasterReportService } from '../master-report.service';
import { SpecialityNewFormComponent } from '../../POP-UP_PAGES/speciality-new-form/speciality-new-form.component';
import { SpecialityNewFormModule } from '../../POP-UP_PAGES/speciality-new-form/speciality-new-form.component';
@Component({
  selector: 'app-speciality',
  templateUrl: './speciality.component.html',
  styleUrls: ['./speciality.component.scss'],
  providers:[ReportService]
})
export class SpecialityComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(SpecialityNewFormComponent, { static: false })
  SpecialityNewForm: SpecialityNewFormComponent;

  dataSource: any;
  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  facilityGroupDatasource: any;
  isAddFormPopupOpened: boolean = false;

  constructor(
    private service: ReportService,
    private masterService: MasterReportService
  ) {}

  ngOnInit(): void {
    this.get_Speciality_Data_List();
  }
  //=========================show new popup=========================
  show_new_Form() {
    this.isAddFormPopupOpened = true;
  }

  //========================Get Datasource =======================
  get_Speciality_Data_List() {
    this.masterService.get_Speciality_List().subscribe((response: any) => {
      this.dataSource = response.data;
    });
  }

  //====================Add data ================================
  onClickSaveNewData = () => {
    const { SpecialityCode, SpecialityName, SpecialityShortName, Description } =
      this.SpecialityNewForm.getNewSpecialityData();
    this.masterService
      .Insert_Speciality_Data(
        SpecialityCode,
        SpecialityName,
        SpecialityShortName,
        Description
      )
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.get_Speciality_Data_List();
          notify(
            {
              message: `New speciality  saved Successfully`,
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
    const fileName='Speciality'
    this.service.exportDataGrid(event,fileName);
  }

  //====================Row Data Deleting========================
  onRowRemoving(event: any) {
    event.cancel = true;
    let SelectedRow = event.key;
    // console.log('selected row data :', SelectedRow);
    this.masterService
      .Remove_Speciality_Row_Data(SelectedRow.ID)
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
        this.get_Speciality_Data_List();
      });
  }

  //===================RTow Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    // console.log('onrowUpdated Data getting ', combinedData);
    let id = combinedData.ID;
    let SpecialityCode = combinedData.SpecialityCode;
    let SpecialityName = combinedData.SpecialityName;
    let SpecialityShortName = combinedData.SpecialityShortName;
    let Description = combinedData.Description;

    this.masterService
      .update_Speciality_data(
        id,
        SpecialityCode,
        SpecialityName,
        SpecialityShortName,
        Description
      )
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.get_Speciality_Data_List();
          notify(
            {
              message: `New speciality updated Successfully`,
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
    SpecialityNewFormModule
  ],
  providers: [],
  exports: [],
  declarations: [SpecialityComponent],
})
export class SpecialityModule {}
