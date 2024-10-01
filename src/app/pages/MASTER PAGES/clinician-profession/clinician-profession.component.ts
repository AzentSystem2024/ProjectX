import { Component, NgModule, ViewChild } from '@angular/core';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDropDownButtonModule,
  DxLookupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { ClinicianProfessionNewFormModule } from '../../POP-UP_PAGES/clinician-profession-new-form/clinician-profession-new-form.component';
import { CommonModule } from '@angular/common';
import { FormPopupModule } from 'src/app/components';
import { ReportService } from 'src/app/services/Report-data.service';
import { MasterReportService } from '../master-report.service';
import { ClinicianProfessionNewFormComponent } from '../../POP-UP_PAGES/clinician-profession-new-form/clinician-profession-new-form.component';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-clinician-profession',
  templateUrl: './clinician-profession.component.html',
  styleUrls: ['./clinician-profession.component.scss'],
  providers: [ReportService],
})
export class ClinicianProfessionComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(ClinicianProfessionNewFormComponent, { static: false })
  ClinicianProfession: ClinicianProfessionNewFormComponent;

  isAddFormPopupOpened: any = false;
  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  facilityGroupDatasource: any;

  dataSource = new DataSource<any>({
    load: () =>
      new Promise((resolve, reject) => {
        this.masterService.Get_ClinicianProfession_Data().subscribe({
          next: (response: any) => resolve(response.data), // Resolve with the data
          error: (error) => reject(error.message), // Reject with the error message
        });
      }),
  });

  constructor(
    private service: ReportService,
    private masterService: MasterReportService
  ) {}

  //=============Showing the new Facility Form===================
  show_new_InsuranceClassification_Form() {
    this.isAddFormPopupOpened = true;
  }
  //========================Get Datasource =======================

  //========================Export data ==========================
  onExporting(event: any) {
    const fileName = 'clinician Profession';
    this.service.exportDataGrid(event, fileName);
  }
  //====================Add data ================================
  onClickSaveNewData = () => {
    const { ProfessionValue, DescriptionValue } =
      this.ClinicianProfession.getNewclinicianProfession();
    this.masterService
      .Insert_ClinicianProfession_Data(ProfessionValue, DescriptionValue)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          notify(
            {
              message: `New Insurance Classification saved Successfully`,
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
          this.ClinicianProfession.reset_newclinicianProfessionFormData();
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
      .remove_ClinicianProfession(SelectedRow.ID)
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
      });
  }
  //===================RTow Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    let id = combinedData.ID;
    let Profession = combinedData.Profession;
    let Description = combinedData.Description;

    this.masterService
      .update_ClinicianProfession_data(id, Profession, Description)
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          notify(
            {
              message: `Insurance classification updated Successfully`,
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
    ClinicianProfessionNewFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [ClinicianProfessionComponent],
})
export class ClinicianProfessionModule {}
