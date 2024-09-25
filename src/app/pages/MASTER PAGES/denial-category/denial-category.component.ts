import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { DxButtonModule, DxDataGridComponent, DxDataGridModule, DxDropDownButtonModule, DxLookupModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { DenialCategoryNewFormComponent } from '../../POP-UP_PAGES/denial-category-new-form/denial-category-new-form.component';
import { DenialCategoryNewFormModule } from '../../POP-UP_PAGES/denial-category-new-form/denial-category-new-form.component';
import notify from 'devextreme/ui/notify';
import { ReportService } from 'src/app/services/Report-data.service';
import { MasterReportService } from '../master-report.service';
@Component({
  selector: 'app-denial-category',
  templateUrl: './denial-category.component.html',
  styleUrls: ['./denial-category.component.scss'],
  providers:[ReportService]
})
export class DenialCategoryComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(DenialCategoryNewFormComponent, { static: false })
  DenialCategoryNewForm: DenialCategoryNewFormComponent;


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
    this.DenialCategory_Data_List();
  }
//=========================show new popup=========================
  show_new_Form(){
    this.isAddFormPopupOpened = true;
  }

  //========================Get Datasource =======================
  DenialCategory_Data_List() {
    this.masterService.get_DenialCategory_List().subscribe((response: any) => {
      this.dataSource = response.data
    });
  }

  //====================Add data ================================
  onClickSaveNewDenialCategory = () => {
    const { DenialCategoryValue, DescriptionValue } =
      this.DenialCategoryNewForm.getNewDenialCategoryData();
    this.masterService
      .Insert_DenialCategory_Data(DenialCategoryValue, DescriptionValue)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.DenialCategoryNewForm.resetDenialCategoryData()
          this.DenialCategory_Data_List();
          notify(
            {
              message: `New Denial Category "${DenialCategoryValue} ${DescriptionValue}" saved Successfully`,
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
    const fileName='Denial Category'
    this.service.exportDataGrid(event,fileName);
  }

  //====================Row Data Deleting========================
  onRowRemoving(event: any) {
    event.cancel = true;
    let SelectedRow = event.key;
    this.masterService
      .Remove_DenialCategory_Row_Data(SelectedRow.ID)
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
        this.DenialCategory_Data_List();
      });
  }
  //===================RTow Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    // console.log('onrowUpdated Data getting ', combinedData);
    let id = combinedData.ID;
    let DenialCategoryValue = combinedData.DenialCategorys;
    let Description = combinedData.Description;

    this.masterService
      .update_DenialCategory_data(id, DenialCategoryValue, Description)
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.DenialCategory_Data_List();
          notify(
            {
              message: `New Denial Category updated Successfully`,
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
    DenialCategoryNewFormModule



  ],
  providers: [],
  exports: [],
  declarations: [DenialCategoryComponent],
})
export class DenialCategoryModule {}
