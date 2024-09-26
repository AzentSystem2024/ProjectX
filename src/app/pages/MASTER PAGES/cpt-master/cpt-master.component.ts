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
import { CptMasterNewFormComponent } from '../../POP-UP_PAGES/cpt-master-new-form/cpt-master-new-form.component';
import { CptMasterNewFormModule } from '../../POP-UP_PAGES/cpt-master-new-form/cpt-master-new-form.component';
import { ReportService } from 'src/app/services/Report-data.service';
import notify from 'devextreme/ui/notify';
import { MasterReportService } from '../master-report.service';

@Component({
  selector: 'app-cpt-master',
  templateUrl: './cpt-master.component.html',
  styleUrls: ['./cpt-master.component.scss'],
  providers: [ReportService],
})
export class CPTMasterComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(CptMasterNewFormComponent, { static: false })
  CptNewFormComponent: CptMasterNewFormComponent;

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
    this.get_CptTMaster_Data_List();
  }
  //=========================show new popup=========================
  show_new_Form() {
    this.isAddFormPopupOpened = true;
  }

  //========================Get Datasource =======================
  get_CptTMaster_Data_List() {
    this.masterService.get_CptMaster_List().subscribe((response: any) => {
      this.dataSource = response.data;
    });
  }

  //====================Add data ================================
  onClickSaveNewCptType = () => {
    const { CPTTypeID, CPTCode, CPTShortName, CPTName, Description } =
      this.CptNewFormComponent.getNewCptMasterData();
    this.masterService
      .Insert_CptMaster_Data(
        CPTTypeID,
        CPTCode,
        CPTShortName,
        CPTName,
        Description
      )
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.get_CptTMaster_Data_List();
          notify(
            {
              message: `New Cpt Master saved Successfully`,
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

  //===================RTow Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    // console.log('onrowUpdated Data getting ', combinedData);
    let id = combinedData.ID;
    let CPTTypeID = combinedData.CPTTypeID;
    let CPTCode = combinedData.CPTCode;
    let CPTShortName = combinedData.CPTShortName;
    let CPTName = combinedData.CPTName;
    let Description = combinedData.Description;

    this.masterService
      .update_CptMaster_data(
        id,
        CPTTypeID,
        CPTCode,
        CPTShortName,
        CPTName,
        Description
      )
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.get_CptTMaster_Data_List();
          notify(
            {
              message: `New Cpt Master updated Successfully`,
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

  //====================Row Data Deleting========================
  onRowRemoving(event: any) {
    event.cancel = true;
    let SelectedRow = event.key;
    // console.log('selected row data :', SelectedRow);
    this.masterService
      .Remove_CptMaster_Row_Data(SelectedRow.ID)
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
        this.get_CptTMaster_Data_List();
      });
  }

  //========================Export data ==========================
  onExporting(event: any) {
    const fileName='CPT master'
    this.service.exportDataGrid(event,fileName);
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
    CptMasterNewFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [CPTMasterComponent],
})
export class CPTMasterModule {}
