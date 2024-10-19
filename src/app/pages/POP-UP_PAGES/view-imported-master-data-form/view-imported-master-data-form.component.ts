import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, SimpleChanges } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxButtonModule, DxDataGridModule, DxProgressBarModule, DxTemplateModule, DxTextBoxModule, DxTooltipModule, DxValidatorModule } from 'devextreme-angular';
import { MasterReportService } from '../../MASTER PAGES/master-report.service';

@Component({
  selector: 'app-view-imported-master-data-form',
  templateUrl: './view-imported-master-data-form.component.html',
  styleUrls: ['./view-imported-master-data-form.component.scss']
})
export class ViewImportedMasterDataFormComponent {

  dataSource:any;
  selectedData:any;
  docNo:any;
  master:any;
  importedDate:any;
  user:any;
  constructor(private service:MasterReportService){}

  @Input() formdata: any;

  ngOnChanges(changes: SimpleChanges): void {
    // Check if formdata has changed and has a valid current value
    if (changes.formdata && changes.formdata.currentValue) {
    console.log(this.formdata,"id");
    this.service.get_Imported_Data_By_Id(this.formdata.ID).subscribe((res:any)=>{
      this.selectedData=res;
      this.docNo=res.DocNo;
      this.master=res.Master;
      this.importedDate=res.ImportTime;
      this.user=res.UserName;

      // Directly format the imported date
      const celldate = res.ImportTime; // Get the ImportTime from the response
      if (celldate) {
        const date = new Date(celldate);
        const formattedDate = date.toLocaleDateString(); // Format according to user's locale
        const formattedTime = date.toLocaleTimeString(); // Format according to user's locale

        // Combine date and time
        this.importedDate = `${formattedDate}, ${formattedTime}`;
      } else {
        this.importedDate = ''; // Set to empty if no date
      }

      switch (this.formdata.MasterID) {
        case 1: // Case for "Clinician" or relevant master
          this.dataSource = this.selectedData.import_clinician.map(({ ID, LogID, ...rest }) => rest);
          break;
        case 2: // Case for "Denial" or relevant master
          this.dataSource = this.selectedData.import_Denial.map(({ ID, LogID, ...rest }) => rest);
          break;
        case 3: // Case for "Insurance" or relevant master
          this.dataSource = this.selectedData.import_Insurance.map(({ ID, LogID, ...rest }) => rest);
          break;
        case 4: // Case for "CPT" or relevant master
          this.dataSource = this.selectedData.import_Cpt.map(({ ID, LogID, ...rest }) => rest);
          break;
        default:
          this.dataSource = [];
          break;
      }
    })
  }
  }


}
@NgModule({
  imports: [
    CommonModule,
    DxTemplateModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxValidatorModule,
    DxProgressBarModule,
    BrowserModule,
    DxTooltipModule,
  ],
  providers: [],
  declarations: [ViewImportedMasterDataFormComponent],
  exports: [ViewImportedMasterDataFormComponent],
})
export class  ViewImportedMasterDataFormModule {}
