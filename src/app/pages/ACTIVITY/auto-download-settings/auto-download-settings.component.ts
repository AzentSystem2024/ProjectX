import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxRadioGroupModule,
  DxSelectBoxModule,
  DxTagBoxModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-auto-download-settings',
  templateUrl: './auto-download-settings.component.html',
  styleUrls: ['./auto-download-settings.component.scss'],
})
export class AutoDownloadSettingsComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  isDatabaseNameEditable = false;
  isXMLDirectoryEditable = false;

  dataSource: any = [];

  FacilityDataSource: any;

  instanceCounter: number = 1;

  DatabaseName: any;
  XMLDirectory: any;
  ServiceRestartTime: any;
  ProcessClaimsAutomtically: any;
  ServiceInterval: any;
  ClaimTransactionStartDate: any = new Date();
  RemittanceTransactionStartDate: any = new Date();
  DownlaodPriorInterval: any;
  DownlaodPriorIntervalRestart: any;

  checkBox1: boolean = false;
  checkBox2: boolean = false;
  checkBox3: boolean = false;

  constructor(private dataService: DataService) {
    this.get_Facility_List();
    this.dataSource = [];
  }

  get_Facility_List() {
    this.dataService
      .get_UserWise_FacilityList_Data()
      .subscribe((response: any) => {
        this.FacilityDataSource = response.facilityDetails || [];
      });
  }

  //===============Add instance function===================
  addInstance = () => {
    const newRow = {
      Instance: `Instance ${this.instanceCounter}`,
      Facility: [],
      'Date 1': null,
      'Date 2': null,
    };
    this.dataSource = [...this.dataSource, newRow];
    this.instanceCounter++;
    this.updateInstanceNumbers();
  };

  // ==========Function to Delete the Selected Row================
  deleteRow(event) {
    const rowIndex = event.rowIndex;
    const rowData = this.dataSource[rowIndex];
    if (confirm(`Are you sure you want to delete ${rowData.Instance}?`)) {
      this.dataSource.splice(rowIndex, 1);
    }
    this.updateInstanceNumbers();
  }

  // =======Function to Update Instance Numbers After Deletion or Addition=========
  updateInstanceNumbers() {
    this.dataSource.forEach((item, index) => {
      item.Instance = `Instance ${index + 1}`;
    });
  }

  //=========================onclick of save button ==========================
  onAddClick = () => {
    const formData = {
      isDatabaseNameEditable: this.isDatabaseNameEditable,
      DatabaseName: this.DatabaseName,
      isXMLDirectoryEditable: this.isXMLDirectoryEditable,
      XMLDirectory: this.XMLDirectory,
      ClaimTransactionStartDate: this.ClaimTransactionStartDate,
      RemittanceTransactionStartDate: this.RemittanceTransactionStartDate,
      ServiceInterval: this.ServiceInterval,
      // dataSource: this.dataSource,
    };

    console.log('Form Data:', formData);
  };

  //=========================onclick of clear button ==========================

  onClearClick = () => {
    // Reset form-bound properties
    // this.isDatabaseNameEditable = false;
    // this.isXMLDirectoryEditable = true;
    this.DatabaseName = '';
    this.XMLDirectory = '';
    this.ClaimTransactionStartDate = null;
    this.RemittanceTransactionStartDate = null;
    this.ServiceInterval = '';
  };
}
@NgModule({
  imports: [
    CommonModule,
    DxToolbarModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxFormModule,
    DxCheckBoxModule,
    DxButtonModule,
    DxTagBoxModule,
    DxDateBoxModule,
    DxTextBoxModule,
    DxDataGridModule,
    DxRadioGroupModule,
  ],
  providers: [],
  exports: [],
  declarations: [AutoDownloadSettingsComponent],
})
export class AutoDownloadSettingsModule {}
