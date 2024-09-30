import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
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
  DxPopupModule,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import notify from 'devextreme/ui/notify';
import { ReportService } from 'src/app/services/Report-data.service';
import { MasterReportService } from '../master-report.service';
import {
  UserNewFormComponent,
  UserNewFormModule,
} from '../../POP-UP_PAGES/user-new-form/user-new-form.component';
import {
  UserEditFormComponent,
  UserEditFormModule,
} from '../../POP-UP_PAGES/user-edit-form/user-edit-form.component';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [MasterReportService, ReportService],
})
export class UserComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(UserNewFormComponent, { static: false })
  userNewForm: UserNewFormComponent;
  popupwidth: any = '65%';

  isAddFormPopupOpened: boolean = false;
  isEditPopupOpened: boolean = false;
  selectedRowData: any;
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;

  datasource = new DataSource<any>({
    load: () =>
      new Promise((resolve, reject) => {
        this.service.get_User_data().subscribe({
          next: (data: any) => {
            resolve(data);
          },
          error: (error) => reject(error.message),
        });
      }),
  });

  constructor(
    private service: MasterReportService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  onEditingRow(event): void {
    console.log(event, 'event');
    event.cancel = true;
    const Id = event.data.UserID;
    console.log(Id, 'id');
    this.isEditPopupOpened = true;
    this.service.get_User_Data_By_Id(Id).subscribe((res) => {
      this.selectedRowData = res;
      this.cdr.detectChanges(); // Ensure Angular picks up the change
    });
  }

  show_new_Form() {
    this.isAddFormPopupOpened = true;
  }

  onClickSaveNewData() {
    const data = this.userNewForm.getNewUserData();
    console.log('inserted data', data);
    this.service.insert_User_Data(data).subscribe((res: any) => {
      try {
        if (res.message === 'Success') {
          notify(
            {
              message: 'data saved successfully',
              position: { at: 'top right', my: 'top right' },
              displayTime: 500,
            },
            'success'
          );
          // this.getUSerData();
          this.dataGrid.instance.refresh();
        }
      } catch (error) {
        notify(
          {
            message: 'save operation failed',
            position: { at: 'top right', my: 'top right' },
            displayTime: 500,
          },
          'error'
        );
      }
    });
  }

  closeNewForm() {
    this.userNewForm.newUserData = {};
    console.log('hai...');
  }

  onRowRemoving(event: any) {
    console.log(event);
    event.cancel = true;
    let SelectedRow = event.key;
    // console.log('selected row data :', SelectedRow);
    this.service.remove_User_Data(SelectedRow.UserID).subscribe(() => {
      try {
        notify(
          {
            message: 'Delete operation successful',
            position: { at: 'top right', my: 'top right' },
            displayTime: 500,
          },
          'success'
        );
        this.dataGrid.instance.refresh();
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

  //========================Export data ==========================
  onExporting(event: any) {
    const fileName = 'Speciality';
    this.reportService.exportDataGrid(event, fileName);
  }

  CloseEditForm() {
    this.isEditPopupOpened = false;
    // this.getUSerData();
    this.dataGrid.instance.refresh();
  }

  // ngOnInit(): void {
  //   this.getUSerData();
  // }
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
    UserNewFormModule,
    DxPopupModule,
    UserEditFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [UserComponent],
})
export class UserModule {}
