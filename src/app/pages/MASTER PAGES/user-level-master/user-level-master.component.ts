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

@Component({
  selector: 'app-user-level-master',
  templateUrl: './user-level-master.component.html',
  styleUrls: ['./user-level-master.component.scss'],
  providers: [MasterReportService, ReportService],
})
export class UserLevelMasterComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(UserLevelNewFormComponent, { static: false })
  userlevelNewForm: UserLevelNewFormComponent;
  @ViewChild(UserLevelEditFormComponent, { static: false })
  userlevelEditForm: UserLevelEditFormComponent;

  popup_width: any = '50%';
  isAddFormVisible: boolean = false;
  dataSource: any;
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

  constructor(
    private masterService: MasterReportService,
    private service: ReportService
  ) {}
  ngOnInit() {
    this.fetch_all_UserLevel_list();
  }

  show_new_Form() {
    this.isAddFormVisible = true;
  }
  //=================== Page refreshing==========================
  refresh = () => {
    this.dataGrid.instance.refresh();
  };
  //========================Export data ==========================
  onExporting(event: any) {
    this.service.exportDataGrid(event);
  }
  //===============Fetch All User Level List===================
  fetch_all_UserLevel_list() {
    this.masterService.get_userLevel_List().subscribe((response: any) => {
      this.dataSource = response.data;
    });
  }
  //=================OnClick save new data=======================
  onClickSaveNewData() {
    const menuData: any = this.userlevelNewForm.getNewUSerLevelData();
    this.masterService
      .insert_userLevel_Data(menuData)
      .subscribe((response: any) => {
        if (response) {
          this.dataGrid.instance.refresh();
          this.fetch_all_UserLevel_list();
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
              message:` Your Data Not Saved`,
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
          this.fetch_all_UserLevel_list();
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
        this.fetch_all_UserLevel_list();
      });
  }

  formatLastModifiedTime(rowData: any): string {
    const celldate = rowData.LastModifiedTime;
    if (!celldate) return '';
    
    const date = new Date(celldate);
  
    // Extract parts of the date
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
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