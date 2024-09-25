import { Component, NgModule, ViewChild } from '@angular/core';
import { ClinicianMajorNewFormModule } from '../../POP-UP_PAGES/clinician-major-new-form/clinician-major-new-form.component';
import notify from 'devextreme/ui/notify';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDropDownButtonModule,
  DxLookupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { ClinicianMajorNewFormComponent } from '../../POP-UP_PAGES/clinician-major-new-form/clinician-major-new-form.component';
import { ReportService } from 'src/app/services/Report-data.service';
import { MasterReportService } from '../master-report.service';
import { CommonModule } from '@angular/common';
import { FormPopupModule } from 'src/app/components';
@Component({
  selector: 'app-clinician-major',
  templateUrl: './clinician-major.component.html',
  styleUrls: ['./clinician-major.component.scss'],
  providers: [ReportService],
})
export class ClinicianMajorComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(ClinicianMajorNewFormComponent, { static: false })
  ClinicianMajor: ClinicianMajorNewFormComponent;

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
    this.get_clinicianMajor_List();
  }
  //=============Showing the new Facility Form===================
  show_new_InsuranceClassification_Form() {
    this.isAddFormPopupOpened = true;
  }
  //========================Get Datasource =======================
  get_clinicianMajor_List() {
    this.masterService.Get_ClinicianMajor_Data().subscribe((response: any) => {
      this.dataSource = response.data;
    });
  }
  //========================Export data ==========================
  onExporting(event: any) {
    const fileName='clinician Major'
    this.service.exportDataGrid(event,fileName);
  }
  //====================Add data ================================
  onClickSaveNewData = () => {
    const { MajorValue, DescriptionValue } =
      this.ClinicianMajor.getNewclinicianMajor();
    this.masterService
      .Insert_ClinicianMajor_Data(MajorValue, DescriptionValue)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.get_clinicianMajor_List();
          notify(
            {
              message: `New data saved Successfully`,
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
          this.ClinicianMajor.reset_newclinicianMajorFormData();
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
    this.masterService.remove_ClinicianMajor(SelectedRow.ID).subscribe(() => {
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
      this.get_clinicianMajor_List();
    });
  }
  //===================Row Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    let id = combinedData.ID;
    let Major = combinedData.Major;
    let Description = combinedData.Description;

    this.masterService
      .update_ClinicianMajor_data(id, Major, Description)
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.get_clinicianMajor_List();
          notify(
            {
              message: `Data updated Successfully`,
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

        event.component.cancelEditData();
        this.dataGrid.instance.refresh();
      });

    event.cancel = true;
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
    ClinicianMajorNewFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [ClinicianMajorComponent],
})
export class ClinicianMajorModule {}
