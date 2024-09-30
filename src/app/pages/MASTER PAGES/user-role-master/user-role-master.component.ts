import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DxTabPanelModule,
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxTemplateModule,
  DxButtonModule,
  DxDataGridModule,
  DxDataGridComponent,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { DxTabsModule } from 'devextreme-angular/ui/tabs';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxTreeViewModule } from 'devextreme-angular';
import { UserLevelNewFormModule } from '../../POP-UP_PAGES/user-level-new-form/user-level-new-form.component';
import { UserLevelNewFormComponent } from '../../POP-UP_PAGES/user-level-new-form/user-level-new-form.component';
import { UserLevelEditFormComponent } from '../../POP-UP_PAGES/user-level-edit-form/user-level-edit-form.component';
import { UserLevelEditFormModule } from '../../POP-UP_PAGES/user-level-edit-form/user-level-edit-form.component';
import { FormPopupModule } from 'src/app/components';
import { MasterReportService } from '../master-report.service';
import { ReportService } from 'src/app/services/Report-data.service';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-user-role-master',
  templateUrl: './user-role-master.component.html',
  styleUrls: ['./user-role-master.component.scss'],
  providers: [MasterReportService, ReportService],
})
export class UserLevelMasterComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(UserLevelNewFormComponent, { static: false })
  userlevelNewForm: UserLevelNewFormComponent;
  @ViewChild(UserLevelEditFormComponent, { static: false })
  userlevelEditForm: UserLevelEditFormComponent;

  popup_width: any = '60%';
  isAddFormVisible: boolean = false;

  //========Variables for Pagination ====================
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  facilityGroupDatasource: any;
  isAddFormPopupOpened: boolean = false;
  iseditFormVisible: boolean = false;
  clickedRowData: any;

  dataSource = new DataSource<any>({
    load: () =>
      new Promise((resolve, reject) => {
        this.masterService.get_userLevel_List().subscribe({
          next: (response: any) => {
            resolve(response.data);
          },
          error: (error) => reject(error.message),
        });
      }),
  });

  constructor(
    private masterService: MasterReportService,
    private service: ReportService
  ) {}

  show_new_Form() {
    this.isAddFormVisible = true;
  }

  onPopupClose(): void {
    this.isAddFormVisible = false;
  }
  onEditPopupClose() {
    this.iseditFormVisible = false;
    this.userlevelEditForm.resetUserChanges();
  }
  //=================== Page refreshing==========================
  refresh = () => {
    this.dataGrid.instance.refresh();
  };
  //========================Export data ==========================
  onExporting(event: any) {
    const fileName = 'userRole';
    this.service.exportDataGrid(event, fileName);
  }
  //=================OnClick save new data=======================
  onClickSaveNewData() {
    const menuData: any = this.userlevelNewForm.getNewUSerLevelData();
    this.masterService
      .insert_userLevel_Data(menuData)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();

          notify(
            {
              message: `New User Level  saved Successfully`,
              position: { at: 'top right', my: 'top right' },
            },
            'success'
          );
        } else {
          notify(
            {
              message: ` Your Data Not Saved`,
              position: { at: 'top right', my: 'top right' },
            },
            'error'
          );
        }
      });
  }

  onEditingStart(event: any) {
    event.cancel = true; // Cancel the editing if a certain condition is met
    this.clickedRowData = event.data;
    event.cancel = true;
    this.iseditFormVisible = true;
  }
  //=======================row data update=======================
  onRowUpdating() {
    const editedData: any = this.userlevelEditForm.getNewUSerLevelEditedData();
    this.masterService
      .update_userLevel_Data(editedData)
      .subscribe((data: any) => {
        if (data) {
          this.dataGrid.instance.refresh();

          notify(
            {
              message: `User Level updated Successfully`,
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
        this.dataGrid.instance.refresh();
      });
  }

  //=======================row data removing ====================
  onRowRemoving(event: any) {
    event.cancel = true;
    let SelectedRow = event.key;
    this.masterService
      .Remove_userLevel_Row_Data(SelectedRow.ID)
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

  formatLastModifiedTime(rowData: any): string {
    const celldate = rowData.LastModifiedTime;
    if (!celldate) return '';

    const date = new Date(celldate);

    // Extract parts of the date
    const day = date.getDate().toString().padStart(2, '0');
    const month = date
      .toLocaleString('en-US', { month: 'short' })
      .toUpperCase();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour format to 12-hour format
    const hour12 = hours % 12 || 12;

    // Construct the formatted string
    return `${day} ${month} ${year}, ${hour12}:${minutes} ${ampm}`;
  }
}
@NgModule({
  imports: [
    CommonModule,
    DxTabPanelModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxTemplateModule,
    DxTabsModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxTreeViewModule,
    FormPopupModule,
    UserLevelNewFormModule,
    UserLevelEditFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [UserLevelMasterComponent],
})
export class UserLevelMasterModule {}
