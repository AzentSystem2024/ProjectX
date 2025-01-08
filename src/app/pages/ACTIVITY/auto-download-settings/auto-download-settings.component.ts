import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDateBoxModule,
  DxDropDownBoxModule,
  DxFormModule,
  DxPopupModule,
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
import notify from 'devextreme/ui/notify';

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
  filteredFacilityDataSource: any;
  instanceCounter: number = 1;

  DatabaseName: any;
  XMLDirectory: any;
  ServiceInterval: any;
  ClaimTransactionStartDate: any = new Date();
  RemittanceTransactionStartDate: any = new Date();
  editingRowData: any;

  Facility_Value: any[] = [];
  InstanceValue: any;
  instanceClaimDownloadStartDate: any;
  instanceRemittanceDownloadStartDate: any;

  isAddPopupVisible: boolean = false;

  constructor(private dataService: DataService) {
    this.get_Facility_List();
    this.get_settingsData_List();
  }
  //======used to enable add button only parent nodes of the tree view=======
  allowAdding = ({ row }) => row.data.parentId === null;

  get_Facility_List() {
    this.dataService
      .get_UserWise_FacilityList_Data()
      .subscribe((response: any) => {
        this.FacilityDataSource = response.facilityDetails || [];
      });
  }

  //=============fetch settings annd instance data from API============
  get_settingsData_List() {
    this.dataService
      .get_AutoDownload_Instance_Settings()
      .subscribe((response: any) => {
        const settingsData = response.Settings;
        const instanceData = response.Instance;
        const facilityData = response.InstanceFacility;
        const dataSource = this.convertToDataSource(instanceData, facilityData);
        console.log('api data converted successfully :=>', dataSource);
      });
  }

  //=========convert the api response to datasourse format ========
  convertToDataSource(instances: any[], instanceFacilities: any[]): any[] {
    const dataSource = [];
    instances.forEach((instance) => {
      // Find all facilities related to the current instance
      const relatedFacilities = instanceFacilities.filter(
        (facility) => facility.InstanceNo === instance.InstanceNo
      );
      relatedFacilities.forEach((facility) => {
        // Create a new data source entry combining instance and facility
        dataSource.push({
          id: facility.ID || instance.ID,
          parentId: facility.ParentID,
          Instance: instance.InstanceNo,
          Facility: facility.FacilityID,
          FacilityLicense: facility.FacilityLicense,
          FacilityName: facility.FacilityName,
          ClaimTransactionDate: facility.ClaimTransactionDate || null,
          RemittanceTransactionDate: facility.RemittanceTransactionDate || null,
        });
      });

      // For facilities that don't have related instance data, we create a parent entry
      if (relatedFacilities.length === 0 && instance.ID !== 0) {
        dataSource.push({
          id: instance.ID,
          parentId: null,
          Instance: instance.InstanceNo,
          Facility: null,
          FacilityLicense: null,
          FacilityName: null,
          ClaimTransactionDate: null,
          RemittanceTransactionDate: null,
        });
      }
    });

    return dataSource;
  }

  //====================row drag and reordering ====================
  onDragChange(e: DxTreeListTypes.RowDraggingChangeEvent) {
    const sourceNode = e.component.getNodeByKey(e.itemData.id);
    // Prevent dragging for root-level rows (parentId === null)
    if (sourceNode.data.parentId === null) {
      e.event.preventDefault(); // Prevent the drag action
    }
  }

  //====================row drag and reordering completed====================
  onReorder = (e: DxTreeListTypes.RowDraggingReorderEvent) => {
    const visibleRows = e.component.getVisibleRows();
    const sourceData = e.itemData;
    // Prevent reordering if the sourceData is a root-level row
    if (sourceData.parentId === null) {
      e.event.preventDefault();
      return;
    }
    if (e.dropInsideItem) {
      const targetNode = visibleRows[e.toIndex].node;
      if (targetNode && targetNode.data.parentId === null) {
        sourceData.parentId = targetNode.key;
      } else {
        e.event.preventDefault();
      }
    } else {
      const toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex;
      const targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null;
      // Allow reordering among valid siblings
      if (targetData && targetData.parentId === sourceData.parentId) {
        const sourceIndex = this.dataSource.indexOf(sourceData);
        this.dataSource.splice(sourceIndex, 1);
        const targetIndex = this.dataSource.indexOf(targetData) + 1;
        this.dataSource.splice(targetIndex, 0, sourceData);
      } else {
        e.event.preventDefault(); // Prevent invalid reordering
      }
    }
    console.log(
      'datasource after instance row dragging eneded ==>>',
      this.dataSource
    );
    e.component.refresh();
  };

  //=====================update row data====================
  updateRow(event: any): void {
    const updatedRow = event.data;
    const index = this.dataSource.findIndex((row) => row.id === updatedRow.id);
    if (index !== -1) {
      this.dataSource[index] = { ...this.dataSource[index], ...updatedRow };
      console.log('Row updated:', this.dataSource);
    }
    // console.log('updated datasource is =>:', this.dataSource);
  }

  //=================New instance add button click event=============
  on_Add_New_Instance(e: any) {
    const usedFacilityIds = new Set(
      this.dataSource.map((item) => item.Facility)
    );
    this.filteredFacilityDataSource = this.FacilityDataSource.filter(
      (facility) => !usedFacilityIds.has(facility.FacilityID)
    );

    if (this.filteredFacilityDataSource.length === 0) {
      notify(
        {
          message:
            'All facilities are already assigned to existing instances. No facilities available to add at this time.',
          position: { at: 'top right', my: 'top right' },
          hideDuration: 3000,
        },
        'error'
      );
    } else {
      this.isAddPopupVisible = true;
    }
  }

  //==================editing start event =============================
  onEditingStart(e: any): void {
    // e.cancel = true;
    this.editingRowData = { ...e.data };
  }

  // ==========Function to Delete the Selected Row================
  deleteRow(event: any): void {
    const rowId = event.data.id;
    this.dataSource = this.dataSource.filter((row) => row.id !== rowId);
    console.log('Row deleted:', rowId);
  }

  //=========================onclick of save button ==========================
  onAddClick = () => {
    // Generate the next available ID
    const maxId = Math.max(...this.dataSource.map((item) => item.id), 0);
    // Add a parent entry
    const parentEntry = {
      id: maxId + 1,
      parentId: null,
      Instance: this.InstanceValue,
      Facility: null,
      ClaimTransactionDate: null,
      RemittanceTransactionDate: null,
    };
    this.dataSource.push(parentEntry);

    // Add child entries for each selected facility
    this.Facility_Value.forEach((facilityId, index) => {
      const childEntry = {
        id: maxId + 2 + index, // Ensure unique IDs
        parentId: parentEntry.id,
        Instance: this.InstanceValue,
        Facility: facilityId,
        ClaimTransactionDate: this.instanceClaimDownloadStartDate,
        RemittanceTransactionDate: this.instanceRemittanceDownloadStartDate,
      };
      this.dataSource.push(childEntry);
    });
    console.log('datasource after add instance ==>>', this.dataSource);
    this.resetForm();
  };
  //====================Reset the add popup form===================
  resetForm(): void {
    this.isAddPopupVisible = false;
    this.InstanceValue = '';
    this.Facility_Value = [];
    this.instanceClaimDownloadStartDate = null;
    this.instanceRemittanceDownloadStartDate = null;
  }

  //=========================onclick of clear button ==========================

  onClearClick = () => {
    // Reset form-bound properties
    this.isDatabaseNameEditable = false;
    this.isXMLDirectoryEditable = true;
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
    DxPopupModule,
    DxDropDownBoxModule,
  ],
  providers: [],
  exports: [],
  declarations: [AutoDownloadSettingsComponent],
})
export class AutoDownloadSettingsModule {}
