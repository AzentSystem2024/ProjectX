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

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [MasterReportService, ReportService],
})
export class UserComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(UserNewFormComponent, { static: false })
  userNewForm: UserNewFormComponent;
  popupwidth: any = '65%';
  datasource: any;

  isAddFormPopupOpened: boolean = false;
  isEditPopupOpened: boolean = false;
  selectedRowData: any;

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
      console.log(this.selectedRowData);
    });
  }

  show_new_Form() {
    this.isAddFormPopupOpened = true;
  }
  getUSerData() {
    this.service.get_User_data().subscribe((data) => {
      this.datasource = data;
      console.log('datasource', this.datasource);
    });
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
          this.getUSerData();
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
      this.getUSerData();
    });
  }

  //========================Export data ==========================
  onExporting(event: any) {
    const fileName = 'Speciality';
    this.reportService.exportDataGrid(event, fileName);
  }

  CloseEditForm() {
    this.isEditPopupOpened = false;
    this.getUSerData();
  }

  ngOnInit(): void {
    this.getUSerData();
  }
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
