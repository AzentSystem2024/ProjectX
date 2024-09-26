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
import notify from 'devextreme/ui/notify';
import { ReportService } from 'src/app/services/Report-data.service';
import { MasterReportService } from '../master-report.service';
import { ClinicianCategoryNewFormModule } from '../../POP-UP_PAGES/clinician-category-new-form/clinician-category-new-form.component';
import { CommonModule } from '@angular/common';
import { ClinicianCategoryNewFormComponent } from '../../POP-UP_PAGES/clinician-category-new-form/clinician-category-new-form.component';
import { FormPopupModule } from 'src/app/components';
@Component({
  selector: 'app-clinician-category',
  templateUrl: './clinician-category.component.html',
  styleUrls: ['./clinician-category.component.scss'],
  providers: [ReportService],
})
export class ClinicianCategoryComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(ClinicianCategoryNewFormComponent, { static: false })
  ClinicianCategory: ClinicianCategoryNewFormComponent;

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
    this.get_clinicianCategory_List();
  }
  //=============Showing the new Facility Form===================
  show_new_InsuranceClassification_Form() {
    this.isAddFormPopupOpened = true;
  }
  //========================Get Datasource =======================
  get_clinicianCategory_List() {
    this.masterService
      .Get_ClinicianCategory_Data()
      .subscribe((response: any) => {
        this.dataSource = response.data;
      });
  }
  //========================Export data ==========================
  onExporting(event: any) {
    const fileName='Clinician Category'
    this.service.exportDataGrid(event,fileName);
  }
  //====================Add data ================================
  onClickSaveNewData = () => {
    const { CategoryValue, DescriptionValue } =
      this.ClinicianCategory.getNewclinicianCategory();
    this.masterService
      .Insert_ClinicianCategory_Data(CategoryValue, DescriptionValue)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.get_clinicianCategory_List();
          notify(
            {
              message: `New data saved Successfully`,
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
          this.ClinicianCategory.reset_newclinicianCategoryFormData();
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
      .remove_ClinicianCategory(SelectedRow.ID)
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
        this.get_clinicianCategory_List();
      });
  }
  //===================RTow Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    let id = combinedData.ID;
    let Category = combinedData.Category;
    let Description = combinedData.Description;

    this.masterService
      .update_ClinicianCategory_data(id, Category, Description)
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.get_clinicianCategory_List();
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
    ClinicianCategoryNewFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [ClinicianCategoryComponent],
})
export class ClinicianCategoryModule {}
