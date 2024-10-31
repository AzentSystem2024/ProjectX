import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { DxButtonModule, DxDataGridComponent, DxDataGridModule, DxPopupModule, DxValidationGroupComponent } from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { ImportMasterDataFormComponent,ImportMasterDataFormModule } from '../../POP-UP_PAGES/import-master-data-form/import-master-data-form.component';
import notify from 'devextreme/ui/notify';
import { MasterReportService } from '../master-report.service';
import { ViewImportedMasterDataFormComponent,ViewImportedMasterDataFormModule } from '../../POP-UP_PAGES/view-imported-master-data-form/view-imported-master-data-form.component';

@Component({
  selector: 'app-import-master-data',
  templateUrl: './import-master-data.component.html',
  styleUrls: ['./import-master-data.component.scss']
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
  UserID:any;
  dataSource:any;
  selectedData:any;
  ViewImportDataPopup:any;

  constructor(private service:MasterReportService){
    this.UserID=sessionStorage.getItem('UserID');
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

  // onClickSaveimportedData() {
  //   // Check for validation errors before proceeding
  //   if (this.importMasterDataForm.hasError) {
  //     notify({
  //       message: 'Please fix the validation errors before saving.',
  //       position: { at: 'top right', my: 'top right' }
  //     }, 'error');
  //     this.importMasterDataForm.resetFileInput();
  //     return; // Stop execution if there are validation errors
  //   }
  
  //   // Get the master ID and grid data
  //   const masterid = this.importMasterDataForm.newImportData.masters;
  //   const gridData = this.importMasterDataForm.gridData;
  
  //   // Prepare the data object to be sent
  //   let data: any = {
  //     MasterID: masterid,
  //     UserID: this.UserID,
  //     NewRecordOnly: this.importMasterDataForm.selectedImportOption
  //   };
  
  //   // Switch case to assign the correct import key
  //   switch (masterid) {
  //     case 1:
  //       data.import_clinician = gridData;
  //       break;
  //     case 2:
  //       data.import_Denial = gridData;
  //       break;
  //       case 3:
  //         data.import_insurance = gridData;
  //         break;
  //       case 4:
  //         data.import_cpt = gridData;
  //         break;
  //     default:
  //       notify({
  //         message: 'Invalid master ID selected.',
  //         position: { at: 'top right', my: 'top right' }
  //       }, 'error');
  //       return; // Exit if an invalid master ID is selected
  //   }
  
  //   // Log the final data object
  //   console.log(data);
  
  //   // Call the service to insert the imported data
  //   this.service.Insert_Imported_Data(data).subscribe(
  //     (res: any) => {
  //       console.log(res)
  //       try {
  //         if (res.flag===1) {
  //           console.log("success")
  //           notify({
  //             message: 'Data imported successfully.',
  //             position: { at: 'top right', my: 'top right' },
  //             displayTime: 2000,
  //           }, 'success');
  //         }
  //         if (res.flag===0){
  //           console.log("failed")
  //           notify({
  //             message: 'Data import failed.',
  //             position: { at: 'top right', my: 'top right' },
  //             displayTime: 2000,
  //           }, 'error');
  //         }
  //       } catch (error) {
  //         notify({
  //           message: 'Data Import failed.',
  //           position: { at: 'top right', my: 'top right' },
  //           displayTime: 2000,
  //         }, 'error');
  //       }
  //     },
  //     (error) => {
  //       // Handle the error case if service call fails
  //       notify({
  //         message: 'Failed to import data. Please try again.',
  //         position: { at: 'top right', my: 'top right' },
  //         displayTime: 2000,
  //       }, 'error');
  //       console.error('Error during data import:', error);
  //     }
  //   );
  // }

  viewDetails = (e)=> {
    console.log(e,"event")
    this.selectedData=e.row.key;
    this.ViewImportDataPopup=true;
    console.log("selected data",this.selectedData)
    console.log(e,".....")
    console.log(e.row.key.ID,"ID")
  
  }

  getImportMasterLog(){
    this.service.get_Importing_Master_Log_List().subscribe((res:any)=>{
      this.dataSource=res.data;
    })
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
    ViewImportedMasterDataFormModule
  ],
  providers: [],
  exports: [],
  declarations: [ImportMasterDataComponent],
})
export class ImportMasterDataModule {}


