import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxSelectBoxModule,
  DxTagBoxModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxToolbarModule,
  DxTreeListComponent,
  DxTreeListModule,
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services';
import { DxTreeListTypes } from 'devextreme-angular/ui/tree-list';

@Component({
  selector: 'app-auto-download-settings',
  templateUrl: './auto-download-settings.component.html',
  styleUrls: ['./auto-download-settings.component.scss'],
})
export class AutoDownloadSettingsComponent {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  @ViewChild(DxTreeListComponent, { static: true })
  treelist: DxTreeListComponent;

  isDatabaseNameEditable = false;
  isXMLDirectoryEditable = false;

  // dataSource: any = [];
  dataSource: any = [
    {
      id: 1,
      parentId: null,
      Instance: 'Instance 1',
      Facility: null,
      ClaimTransactionDate: null,
      RemittanceTransactionDate: null,
    },
    {
      id: 2,
      parentId: 1,
      Instance: 'Instance 1',
      Facility: 12,
      ClaimTransactionDate: new Date(),
      RemittanceTransactionDate: new Date(),
    },
    {
      id: 3,
      parentId: 1,
      Instance: 'Instance 1',
      Facility: 14,
      ClaimTransactionDate: new Date(),
      RemittanceTransactionDate: new Date(),
    },
    {
      id: 4,
      parentId: 1,
      Instance: 'Instance 1',
      Facility: 14,
      ClaimTransactionDate: new Date(),
      RemittanceTransactionDate: new Date(),
    },
    {
      id: 5,
      parentId: null,
      Instance: 'Instance 3',
      Facility: null,
      ClaimTransactionDate: null,
      RemittanceTransactionDate: null,
    },
    {
      id: 6,
      parentId: 5,
      Instance: 'Instance 3',
      Facility: 16,
      ClaimTransactionDate: new Date(),
      RemittanceTransactionDate: new Date(),
    },
  ];

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
    // this.dataSource = [];
  }

  get_Facility_List() {
    this.dataService
      .get_UserWise_FacilityList_Data()
      .subscribe((response: any) => {
        this.FacilityDataSource = response.facilityDetails || [];
      });
  }

  //===================Adding Row to the DataSource====================
  validateRowInserting(event: any) {
    // Validate the row being added
    if (event.data.parentId === null || event.data.parentId === '') {
      console.warn('Adding rows without a parent is not allowed.');
      event.cancel = true; // Cancel the adding process
      return;
    }
    // Determine the new row ID
    const newId = this.dataSource.length + 1;
    // Create the new row data
    const newRow = {
      id: newId,
      parentId: event.data.parentId || null,
      Instance: event.data.Instance || `Instance ${newId}`,
      Facility: event.data.Facility || null,
      ClaimTransactionDate: event.data.ClaimTransactionDate || null,
      RemittanceTransactionDate: event.data.RemittanceTransactionDate || null,
    };
    // Add the new row to the data source
    this.dataSource.push(newRow);
    // Update the TreeList (if necessary)
    this.dataSource = [...this.dataSource]; // Trigger change detection
    console.log('Updated DataSource:', this.dataSource);
  }

  //=============== Add instance function ===================
  addInstance = () => {
    const newRow = {
      id: this.instanceCounter, // Unique identifier for the new row
      parentId: null,
      Instance: `Instance ${this.instanceCounter}`,
      Facility: [],
      ClaimTransactionDate: null,
      RemittanceTransactionDate: null,
    };

    this.dataSource = [...this.dataSource, newRow];
    // Increment instance counter for unique IDs
    this.instanceCounter++;
    this.updateTreeList();
  };

  // Update the TreeList instance after dataSource changes
  updateTreeList() {
    this.treelist?.instance.refresh();
  }
  //=====================update row data====================
  updateRow(event: any): void {
    const updatedRow = event.data;
    const index = this.dataSource.findIndex((row) => row.id === updatedRow.id);

    if (index !== -1) {
      this.dataSource[index] = { ...this.dataSource[index], ...updatedRow };
      console.log('Row updated:', this.dataSource);
    }
    console.log('updated datasource is =>:', this.dataSource);
  }

  allowAdding = ({ row }) => row.data.parentId === null;

  // ==============On new row initialization, set parentId if not a new instance===========
  editorPreparing(e: DxTreeListTypes.EditorPreparingEvent) {
    if (e.dataField === 'parentId' && e.row.data.ID === 1) {
      e.cancel = true;
      e.editorOptions.disabled = true;
      e.editorOptions.value = null;
    }
  }

  initNewRow(e: DxTreeListTypes.InitNewRowEvent) {
    e.data.parentId = 1;
  }
  // // ==================Reference to the DataGrid===================
  // duplicateRow = (): void => {
  //   const selectedRows = this.dataGrid.instance.getSelectedRowsData();
  //   if (selectedRows.length > 0) {
  //     selectedRows.forEach((row) => {
  //       const newRow = { ...row };
  //       newRow.Instance = `${row.Instance}`;
  //       this.dataSource = [...this.dataSource, newRow];
  //     });
  //     this.updateInstanceNumbers();
  //     this.dataGrid.instance.refresh();
  //   } else {
  //     alert('Please select a row to duplicate.');
  //   }
  // };

  // ==========Function to Delete the Selected Row================
  deleteRow(event: any): void {
    const rowId = event.data.id;
    this.dataSource = this.dataSource.filter((row) => row.id !== rowId);
    console.log('Row deleted:', rowId);
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
    DxTreeListModule,
  ],
  providers: [],
  exports: [],
  declarations: [AutoDownloadSettingsComponent],
})
export class AutoDownloadSettingsModule {}
