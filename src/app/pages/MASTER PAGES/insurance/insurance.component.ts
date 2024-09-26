import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { InsuranceNewFormComponent } from '../../POP-UP_PAGES/insurance-new-form/insurance-new-form.component';
import notify from 'devextreme/ui/notify';
import { ReportService } from 'src/app/services/Report-data.service';
import { MasterReportService } from '../master-report.service';
import { InsuranceNewFormModule } from '../../POP-UP_PAGES/insurance-new-form/insurance-new-form.component';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss'],
  providers: [ReportService],
})
export class InsuranceComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(InsuranceNewFormComponent, { static: false })
  InsuranceNewForm: InsuranceNewFormComponent;

  dataSource: any;
  showSearchBox = false;
  showSearchIcon = true;
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
    this.get_InsuranceCompany_Data_List();
  }

  ShowSearch = () => {
    this.showSearchIcon = !this.showSearchIcon;
    this.showSearchBox = !this.showSearchBox;
  };

  //=========================show new popup=========================
  show_new_Form() {
    this.isAddFormPopupOpened = true;
  }

  //========================Get Datasource =======================
  get_InsuranceCompany_Data_List() {
    this.masterService.get_Insurance_List().subscribe((response: any) => {
      this.dataSource = response.data;
    });
  }

  //====================Add data ================================
  onClickSaveNewData = () => {
    const { InsuranceID, InsuranceName, InsuranceShortName } =
      this.InsuranceNewForm.getNewInsuranceData();
    this.masterService
      .Insert_Insurance_Data(InsuranceID, InsuranceName, InsuranceShortName)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.get_InsuranceCompany_Data_List();
          notify(
            {
              message: `New Insurance "${InsuranceID} ${InsuranceName} ${InsuranceShortName}" saved Successfully`,
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
    const fileName='Insurance'
    this.service.exportDataGrid(event,fileName);
  }

  //====================Row Data Deleting========================
  onRowRemoving(event: any) {
    event.cancel = true;
    let SelectedRow = event.key;
    // console.log('selected row data :', SelectedRow);
    this.masterService
      .Remove_Insurance_Row_Data(SelectedRow.ID)
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
        this.get_InsuranceCompany_Data_List();
      });
  }

  //===================RTow Data Update==========================
  onRowUpdating(event: any) {
    const updataDate = event.newData;
    const oldData = event.oldData;
    const combinedData = { ...oldData, ...updataDate };
    let id = combinedData.ID;
    let Insuranceid = combinedData.InsuranceID;
    let InsuranceName = combinedData.InsuranceName;
    let InsuranceShortName = combinedData.InsuranceShortName;

    this.masterService
      .update_Insurance_data(id, Insuranceid, InsuranceName, InsuranceShortName)
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();
          this.get_InsuranceCompany_Data_List();
          notify(
            {
              message: `New Insurance updated Successfully`,
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
    InsuranceNewFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [InsuranceComponent],
})
export class InsuranceModule {}
