import { Component, ViewChild, NgModule } from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDataGridComponent,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportDataGridToXLSX } from 'devextreme/excel_exporter';
// import { CardActivitiesModule, ContactStatusModule } from 'src/app/components';
import DataSource from 'devextreme/data/data_source';
import { CommonModule } from '@angular/common';
import { DataService } from 'src/app/services';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { jsPDF } from 'jspdf';
import notify from 'devextreme/ui/notify';
import { FormPopupModule } from 'src/app/components';
import { ContactPanelModule } from 'src/app/components/library/contact-panel/contact-panel.component';
import {
  DenialNewFormComponent,
  DenialNewFormModule,
} from 'src/app/pages/POP-UP_PAGES/denial-new-form/denial-new-form.component';
import { DxLookupModule } from 'devextreme-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/services/Report-data.service';

interface dropdownData {
  ID: string;
  Description: string;
}

@Component({
  templateUrl: './denial-list.component.html',
  styleUrls: ['./denial-list.component.scss'],
  providers: [DataService, ReportService],
})
export class DenialListComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  @ViewChild(DenialNewFormComponent, { static: false })
  denialComponent: DenialNewFormComponent;

  isPanelOpened = false;

  isAddContactPopupOpened = false;

  selectedItemKeys: any[] = [];
  Denial_Type_DropDownData: dropdownData[];
  Denial_category_DropDownData: dropdownData[];
  ID: any;

  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  //=================Fetchiong DataSource=====================
  dataSource = new DataSource<any>({
    load: () =>
      new Promise((resolve, reject) => {
        this.service.getDenialsData().subscribe({
          next: (data: any) => resolve(data),
          error: ({ message }) => reject(message),
        });
      }),
  });

  constructor(
    private service: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private reportservice: ReportService
  ) {
    this.getDenial_Type_DropDown();
    this.getDenial_Category_DropDown();
  }

  addDenial() {
    this.isAddContactPopupOpened = true;
  }

  refresh = () => {
    this.dataGrid.instance.refresh();
  };

  //================Exporting Function=====================
  onExporting(e: any) {
    this.reportservice.exportDataGrid(e);
  }

  //============ADD NEW DENIALS======================

  onClickSaveNewDenial = () => {
    const { DenialCode, Description, DenialTypeID, DenialCategoryID } =
      this.denialComponent.getNewDenialData();
    this.service
      .addDenial(DenialCode, Description, DenialTypeID, DenialCategoryID)
      .subscribe((result: any) => {
        if (result) {
          this.dataGrid.instance.refresh();
          notify(
            {
              message: `New Denial "${DenialCode} ${Description} ${DenialTypeID} ${DenialCategoryID}" saved Successfully`,
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

  //====================Update Denial Row Data==============

  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    console.log('onrowUpdated Data getting ', combinedData);
    let id = combinedData.ID;
    let code = combinedData.DenialCode;
    let Description = combinedData.Description;
    let DenialTypeID = combinedData.DenialTypeID;
    let DenialCategoryID = combinedData.DenialCategoryID;

    this.service
      .updateDenial(id, code, Description, DenialTypeID, DenialCategoryID)
      .subscribe((data: any) => {
        if (data) {
          notify(
            {
              message: `New Denial updated Successfully`,
              position: { at: 'top center', my: 'top center' },
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

  // =================Remove Denial=========================
  onRowRemoving(event: any) {
    event.cancel = true;
    var SelectedRow = event.key;
    console.log('selected row data :', SelectedRow);
    this.service.removeDenial(SelectedRow.ID).subscribe(() => {
      try {
        notify(
          {
            message: 'Delete operation successful',
            position: { at: 'top right', my: 'top right' },
            displayTime: 500,
          },
          'success'
        );

        // window.location.reload();
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

  //=============Get Denial Type Drop dwn Data==============================
  getDenial_Type_DropDown() {
    let dropdownType = 'DENIALTYPE';
    this.service
      .get_Denial_Dropdown_Data(dropdownType)
      .subscribe((data: any) => {
        this.Denial_Type_DropDownData = data;
        // console.log('drop down dataaaaaaaaa', this.Denial_Type_DropDownData);
      });
  }

  //=============Get Denial Type Drop dwn Data==============================
  getDenial_Category_DropDown() {
    let dropdownType = 'DENIALCATEGORY';
    this.service
      .get_Denial_Dropdown_Data(dropdownType)
      .subscribe((data: any) => {
        this.Denial_category_DropDownData = data;
      });
  }
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxLookupModule,
    ContactPanelModule,
    DenialNewFormModule,
    FormPopupModule,
    CommonModule,
  ],
  providers: [],
  exports: [],
  declarations: [DenialListComponent],
})
export class DenialListModule {}
