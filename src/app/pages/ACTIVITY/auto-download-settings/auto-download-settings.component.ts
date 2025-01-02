import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxSelectBoxModule,
  DxTagBoxModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-auto-download-settings',
  templateUrl: './auto-download-settings.component.html',
  styleUrls: ['./auto-download-settings.component.scss'],
})
export class AutoDownloadSettingsComponent {
  isDatabaseNameEditable = false;
  isXMLDirectoryEditable = false;

  dataSource: any;
  originalDataSource: any;

  dropdowns: any[] = [
    {
      selectedValues: [],
    },
  ];

  selectedValues: number[] = [];

  selectedFacilities: any[] = [];

  formModel: any = {
    DatabaseName: '',
    XMLDirectory: '',
    ServiceRestartTime: '',
    ProcessClaimsAutomtically: '',
    ServiceInterval: '',
    ClaimTransactionStartDate: null,
    RemittanceTransactionStartDate: null,
    DownlaodPriorInterval: '',
    DownlaodPriorIntervalRestart: '',
  };

  constructor(private dataService: DataService) {
    this.get_Facility_List();
  }

  get_Facility_List() {
    this.dataService
      .get_DashbOard_SyncData_Details()
      .subscribe((response: any) => {
        this.originalDataSource = response.data || [];
        this.updateDataSource();
      });
  }

  // Add a new dropdown instance
  addDropdown(): void {
    this.dropdowns.push({
      selectedValues: [],
    });
    this.updateDataSource();
  }

  // Remove a specific dropdown
  removeDropdown(index: number): void {
    this.dropdowns.splice(index, 1);
    this.updateDataSource();
  }

  // Handle value change in a tag box
  onTagBoxValueChanged(event: any, index: number): void {
    const newlySelectedValues = event.value;
    this.dropdowns[index].selectedValues = newlySelectedValues;
    this.updateSelectedFacilities();
    // this.updateDataSource();
  }

  // Update the selectedFacilities array to store values in the required format
  updateSelectedFacilities() {
    this.selectedFacilities = this.dropdowns
      .map((dropdown, index) =>
        dropdown.selectedValues.map((facilityId: any) => ({
          InstanceNo: index + 1,
          FacilityID: facilityId,
        }))
      )
      .flat();
  }

  // Update the main dataSource to exclude selected values
  updateDataSource(): void {
    const selectedValuesInAllTagBoxes = this.dropdowns
      .flatMap((dropdown) => dropdown.selectedValues)
      .filter((value, index, self) => self.indexOf(value) === index);

    this.dataSource = this.originalDataSource.filter(
      (item) => !selectedValuesInAllTagBoxes.includes(item.ID)
    );
  }

  onAddClick() {
    let formdata = this.formModel;
    console.log('form data ;=>', formdata);
    console.log('selected facilities are =>', this.selectedFacilities);
  }

  onClearClick() {
    this.formModel = {
      DatabaseName: '',
      XMLDirectory: '',
      ServiceRestartTime: '',
      ProcessClaimsAutomtically: '',
      ServiceInterval: '',
      ClaimTransactionStartDate: null,
      RemittanceTransactionStartDate: null,
      DownlaodPriorInterval: '',
      DownlaodPriorIntervalRestart: '',
    };
    this.dropdowns = [{ selectedValues: [] }];
  }
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
  ],
  providers: [],
  exports: [],
  declarations: [AutoDownloadSettingsComponent],
})
export class AutoDownloadSettingsModule {}
