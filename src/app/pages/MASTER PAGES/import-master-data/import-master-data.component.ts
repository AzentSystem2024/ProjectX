import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxPopupModule,
  DxValidationGroupComponent,
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import {
  ImportMasterDataFormComponent,
  ImportMasterDataFormModule,
} from '../../POP-UP_PAGES/import-master-data-form/import-master-data-form.component';
import notify from 'devextreme/ui/notify';
import { MasterReportService } from '../master-report.service';
import {
  ViewImportedMasterDataFormComponent,
  ViewImportedMasterDataFormModule,
} from '../../POP-UP_PAGES/view-imported-master-data-form/view-imported-master-data-form.component';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-import-master-data',
  templateUrl: './import-master-data.component.html',
  styleUrls: ['./import-master-data.component.scss'],
  providers: [DataService],
})
export class ImportMasterDataComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @ViewChild(ImportMasterDataFormComponent, { static: false })
  importMasterDataForm: ImportMasterDataFormComponent;
  @ViewChild(ViewImportedMasterDataFormComponent, { static: false })
  viewImportedMasterDataForm: ViewImportedMasterDataFormComponent;
  @ViewChild('validationGroup', { static: true })
  validationGroup: DxValidationGroupComponent;
  isNewFormPopupOpened: boolean = false;
  readonly allowedPageSizes: any = [5, 10, 'all'];
  displayMode: any = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  popupwidth: any = '65%';
  UserID: any;
  dataSource: any;
  selectedData: any;
  ViewImportDataPopup: any;
  currentPathName: string;
  initialized: boolean;

  constructor(
    private service: MasterReportService,
    private router: Router,
    private dataService: DataService
  ) {
    this.UserID = sessionStorage.getItem('UserID');
  }

  ngOnInit(): void {
    this.getImportMasterLog();

  }


  CloseEditForm() {
    this.isNewFormPopupOpened = false;
    this.dataGrid.instance.refresh();
    this.getImportMasterLog();
  }

  show_new_Form() {
    this.isNewFormPopupOpened = true;
  }

  viewDetails = (e) => {
    this.selectedData = e.row.key;
    this.ViewImportDataPopup = true;
    
  };

  getImportMasterLog() {
    this.service.get_Importing_Master_Log_List().subscribe((res: any) => {
      this.dataSource = res.data;
    });
  }

  // formatImportTime(rowData: any): string {
  //   const celldate = rowData.ImportTime;
  //   if (!celldate) return '';

  //   const date = new Date(celldate);

  //   // Extract parts of the date
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = date
  //     .toLocaleString('en-US', { month: 'short' })
  //     .toUpperCase();
  //   const year = date.getFullYear();
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   const ampm = hours >= 12 ? 'PM' : 'AM';

  //   // Convert hours from 24-hour format to 12-hour format
  //   const hour12 = hours % 12 || 12;

  //   // Construct the formatted string
  //   return `${day} ${month} ${year}, ${hour12}:${minutes} ${ampm}`;
  // }

  formatImportTime(rowData: any): string {
    const celldate = rowData.ImportTime;
    if (!celldate) return '';

    const date = new Date(celldate);

    // Format the date and time using the user's system locale
    const formattedDate = date.toLocaleDateString(); // Formats according to the user's system date format
    const formattedTime = date.toLocaleTimeString(); // Formats according to the user's system time format

    // Combine date and time
    return `${formattedDate}, ${formattedTime}`;
  }

  onClearData() {
    this.importMasterDataForm.clearData();
  }
  onClearViewData() {
    this.viewImportedMasterDataForm.clearData();
  }
}

@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    FormPopupModule,
    DxPopupModule,
    ImportMasterDataFormModule,
    ViewImportedMasterDataFormModule,
  ],
  providers: [],
  exports: [],
  declarations: [ImportMasterDataComponent],
})
export class ImportMasterDataModule {}
