import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDateBoxModule,
  DxDropDownBoxModule,
  DxFormModule,
  DxNumberBoxModule,
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

  dataSource: any[] = [];

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

  Update_InstanceValue: any;
  Update_Facility_Value: any[] = [];
  update_instanceClaimDownloadStartDate: any;
  update_instanceRemittanceDownloadStartDate: any;

  isAddPopupVisible: boolean = false;
  is_EditFormVisible: boolean = false;
  updatenodeId: any;
  isChildNodeData: boolean = false;
  private currentMaxId = Math.max(...this.dataSource.map(item => item.id), 0);

  constructor(private dataService: DataService) {
    this.get_Facility_List();
    this.get_settingsData_List();
  }
  //======used to enable add button only parent nodes of the tree view=======
  // allowAdding = ({ row }) => row.data.parentId === null;
  allowAdding = ({ row }) => false;

  get_Facility_List() {
    this.dataService
      .get_UserWise_FacilityList_Data()
      .subscribe((response: any) => {
        this.FacilityDataSource = response.facilityDetails || [];
      });
  }

  //===============fetch settings annd instance data from API==============
  get_settingsData_List() {
    this.dataService
      .get_AutoDownload_Instance_Settings()
      .subscribe((response: any) => {
        const { Settings: settingsData, InstanceFacility } = response;

        // Extract settings data
        this.DatabaseName = settingsData.LogDatabase;
        this.ServiceInterval = settingsData.ServiceInterval;
        this.XMLDirectory = settingsData.SaveXMLDirectory;
        this.isDatabaseNameEditable = !!this.DatabaseName;
        this.isXMLDirectoryEditable = !!this.XMLDirectory;

        // Transform and assign instance facility data
        this.dataSource = InstanceFacility.map(
          ({
            ID,
            ParentID,
            InstanceNo,
            FacilityID,
            ClaimTransactionDate,
            RemittanceTransactionDate,
          }) => ({
            id: ID,
            parentId: ParentID,
            Instance: InstanceNo,
            Facility: FacilityID,
            ClaimTransactionDate: ClaimTransactionDate
              ? new Date(ClaimTransactionDate)
              : null,
            RemittanceTransactionDate: RemittanceTransactionDate
              ? new Date(RemittanceTransactionDate)
              : null,
          })
        );
      });
  }

  //======================row drag and reordering ==========================
  onDragChange(e: DxTreeListTypes.RowDraggingChangeEvent) {
    const sourceNode = e.component.getNodeByKey(e.itemData.id);
    // Prevent dragging for root-level rows (parentId === null)
    if (sourceNode.data.parentId === null) {
      e.event.preventDefault(); // Prevent the drag action
    }
  }

  //====================row drag and reordering completed===================
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

  //====================New instance add button click event================
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
    if (e.event && e.event.target && e.event.target.classList.contains('add-button')) {
      e.preventDefault();  // Prevent default behavior for Add button click
      e.stopPropagation(); // Stop event propagation for Add button click
  
      // Manually call the Add Instance function
      this.on_Add_New_Instance(e); 
  
      return;  // Skip the edit form logic
    }

    this.updatenodeId = e.data.id;
    // Fetch the current parent node's ID
    const selectedNodeId = e.data.id;
    const parentId = e.data.parentId;
    if (!parentId) {
      e.cancel = true;
      // Fetch all child nodes of the current parent
      const childNodes = this.dataSource.filter(
        (item) => item.parentId === selectedNodeId
      );
      // Collect all facility IDs used by the current parent's children
      const currentParentFacilityIds = new Set(
        childNodes.map((item) => item.Facility)
      );
      // Collect all facility IDs used across the entire dataSource
      const allUsedFacilityIds = new Set(
        this.dataSource
          .filter((item) => item.Facility !== null)
          .map((item) => item.Facility)
      );
      this.filteredFacilityDataSource = this.FacilityDataSource.filter(
        (facility) =>
          currentParentFacilityIds.has(facility.FacilityID) || // Keep facilities assigned to the current parent
          !allUsedFacilityIds.has(facility.FacilityID) // Include facilities not present in the dataSource
      );
      console.log(this.filteredFacilityDataSource,"FILTEREDFACILITY")
      // Initialize popup fields
      this.Update_InstanceValue = e.data.Instance;
      this.update_instanceClaimDownloadStartDate = null;
      this.update_instanceRemittanceDownloadStartDate = null;
      this.Update_Facility_Value = Array.from(currentParentFacilityIds);
      // Show the popup
      this.is_EditFormVisible = true;
      this.isAddPopupVisible = false;
    } else {
      e.cancel = false;
      this.isChildNodeData = true;
    }
  }

  //=========================onclick of save button ==========================
  onAddClick = () => {
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
    this.resetForm();
  };

  //=====================update row data====================
  // On_Update_DataSource(): void {
  //   const parentId = this.updatenodeId;
  //   console.log(parentId,"PARENTID")
  //   // Find the parent node in the dataSource
  //   const parentNode = this.dataSource.find((item) => item.id === parentId);
  //   if (!parentNode) {
  //     console.error('Parent node not found!');
  //     return;
  //   }
  //   console.log(parentNode,"PARENTNODEEEEEEEEE")
  //   // Update the parent node's Instance name
  //   parentNode.Instance = this.Update_InstanceValue;
  //   console.log(parentNode.Instance,"INSTANCEEEEEE")
  //   // Get current child nodes for the parent
  //   const currentChildNodes = this.dataSource.filter(
  //     (item) => item.parentId === parentId
  //   );
  //   console.log(currentChildNodes,"CURRENTCHILDNODES")
  //   // Create a set of existing facility IDs for the current parent
  //   const existingFacilityIds = new Set(
  //     currentChildNodes.map((child) => child.Facility)
  //   );
  //   // Prepare updated child nodes based on selected facilities
  //   const selectedFacilities = this.Update_Facility_Value;
  //   console.log(selectedFacilities,"SELECTEDFACILITIES")
  //   const updatedChildNodes: any[] = selectedFacilities.map((facilityId) => {
  //     const existingChildNode = currentChildNodes.find(
  //       (child) => child.Facility === facilityId
  //     );
  //     if (existingChildNode) {
  //       // If the child node already exists, return it with updated values
  //       return {
  //         ...existingChildNode,
  //         Instance: this.Update_InstanceValue,
  //         ClaimTransactionDate: this.update_instanceClaimDownloadStartDate,
  //         RemittanceTransactionDate:
  //           this.update_instanceRemittanceDownloadStartDate,
  //       };
  //     } else {
  //       // Create a new child node for the selected facility
  //       return {
  //         id: this.generateUniqueId(),
  //         parentId: parentId,
  //         Instance: this.Update_InstanceValue,
  //         Facility: facilityId,
  //         ClaimTransactionDate: this.update_instanceClaimDownloadStartDate,
  //         RemittanceTransactionDate:
  //           this.update_instanceRemittanceDownloadStartDate,
  //       };
  //     }
  //   });

  //   // Remove existing child nodes for the parent and add the updated ones
  //   this.dataSource = [
  //     ...this.dataSource.filter((item) => item.parentId !== parentId),
  //     ...updatedChildNodes,
  //   ];

  //   // Reset the form and log the updated dataSource
  //   this.resetForm();
  //   console.log('Updated dataSource:', this.dataSource);
  // }

On_Update_DataSource() {
  const newFacilities = this.Update_Facility_Value; // Facilities to add
  const parentId = this.updatenodeId; // Parent node ID

  // Update parent node
  const parentNode = this.dataSource.find((node) => node.id === parentId);
  if (parentNode) {
    parentNode.Instance = this.Update_InstanceValue;
  }

  // Add or update child nodes for each facility
  newFacilities.forEach((facility) => {
    // Check if the facility already exists as a child of the parent
    const existingChild = this.dataSource.find(
      (node) => node.parentId === parentId && node.Facility === facility
    );

    if (!existingChild) {
      // Create a new child node if it doesn't exist
      const newId = this.generateUniqueId();
      const newChild = {
        id: newId,
        parentId: parentId,
        Instance: this.Update_InstanceValue,
        Facility: facility,
        ClaimTransactionDate: this.update_instanceClaimDownloadStartDate,
        RemittanceTransactionDate: this.update_instanceRemittanceDownloadStartDate,
      };

      console.log('Adding new child:', newChild);

      // Add the new child node to the dataSource
      this.dataSource.push(newChild);
    } else {
      // Update existing child node
      existingChild.Instance = this.Update_InstanceValue;
      existingChild.ClaimTransactionDate = this.update_instanceClaimDownloadStartDate;
      existingChild.RemittanceTransactionDate = this.update_instanceRemittanceDownloadStartDate;

      console.log('Updated existing child:', existingChild);
    }
  });

  console.log('Updated dataSource:', this.dataSource);
}






  

  onFacilitySelectionChange(event: any): void {
  console.log('Facilities changed:', event.value);
  this.Update_Facility_Value = event.value;
}




  

  //=======find the next available id of dataSource Object==========
  // generateUniqueId(): number {
  //   // Find the highest existing ID in the dataSource
  //   const maxId = this.dataSource.reduce(
  //     (max, item) => (item.id > max ? item.id : max),
  //     0
  //   );
  //   return maxId + 1;
  // }
generateUniqueId(): number {
  const allIds = this.dataSource.map((item) => item.id).filter((id) => id !== null && id !== undefined);
  const nextId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;

  console.log('Generated unique ID:', nextId, 'from IDs:', allIds);
  return nextId;
}






  // ==========Function to Delete the Selected Row================
  deleteRow(event: any) {
    const deletedId = event.data.id;
    const isParent = this.dataSource.some(
      (item) => item.parentId === deletedId
    );
    if (isParent) {
      // Remove the parent and all its children
      this.dataSource = this.dataSource.filter(
        (item) => item.id !== deletedId && item.parentId !== deletedId
      );
    } else {
      // Remove only the child
      this.dataSource = this.dataSource.filter((item) => item.id !== deletedId);
    }
    // Refresh the TreeList (if necessary)
    event.component.refresh();
  }
  //====================Reset the add popup form===================
  resetForm(): void {
    this.isAddPopupVisible = false;
    this.InstanceValue = '';
    this.Facility_Value = [];
    this.instanceClaimDownloadStartDate = null;
    this.instanceRemittanceDownloadStartDate = null;

    this.is_EditFormVisible = false;
    this.Update_InstanceValue = '';
    this.update_instanceClaimDownloadStartDate = null;
    this.update_instanceRemittanceDownloadStartDate = null;
    this.Update_Facility_Value = [];
  }

  //======================on click event of save button =======================
  on_Click_Save_Settings = () => {
    const userId = parseInt(sessionStorage.getItem('UserID') || '0', 10);

    const formatDate = (date: Date | null) =>
      date ? date.toISOString().split('T')[0] : null; // Format the date correctly

    const downloadInstance = this.dataSource
      .filter((item: any) => item.parentId !== null)
      .map((item: any) => ({
        InstanceNo: parseInt(item.Instance),
        FacilityID: item.Facility,
        ClaimTransactionDate: formatDate(item.ClaimTransactionDate), // Use formatted date
        RemittanceTransactionDate: formatDate(item.RemittanceTransactionDate), // Use formatted date
      }));

    const finalData = {
      UserID: userId,
      LogDatabase: this.DatabaseName,
      ServiceInterval: this.ServiceInterval,
      SaveXMLDirectory: this.XMLDirectory,
      download_instance: downloadInstance,
    };

    console.log('Final data to insert:', finalData);

    this.dataService.autoDownload_Instance_Settings_insert(finalData).subscribe(
      (response) => {
        console.log('Insert successful:', response);
        notify(
          {
            message: 'Download settings saved successfully',
            position: { at: 'top right', my: 'top right' },
            hideDuration: 3000,
          },
          'success'
        );
      },
      (error) => {
        notify(
          {
            message: 'Save Download settings failed',
            position: { at: 'top right', my: 'top right' },
            hideDuration: 3000,
          },
          'error'
        );
      }
    );
  };

  //=========================onclick of clear button ==========================
  onClearClick = () => {
    // Reset form-bound properties
    this.isDatabaseNameEditable = false;
    this.isXMLDirectoryEditable = false;
    this.DatabaseName = '';
    this.XMLDirectory = '';
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
    DxNumberBoxModule
  ],
  providers: [],
  exports: [],
  declarations: [AutoDownloadSettingsComponent],
})
export class AutoDownloadSettingsModule {}
