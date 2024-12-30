import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDropDownBoxModule,
  DxFormModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-auto-download-settings',
  templateUrl: './auto-download-settings.component.html',
  styleUrls: ['./auto-download-settings.component.scss'],
})
export class AutoDownloadSettingsComponent {
  onClearClick: any;
  onAddClick: any;

  isDatabaseNameEditable = false;
  isXMLDirectoryEditable = false;

  options: any;

  dropdowns: any[] = [{ selectedValues: [] }];

  selectedValues:any

  constructor() {
    this.options = [
      { ID: 1, Name: 'Option 1' },
      { ID: 2, Name: 'Option 2' },
      { ID: 3, Name: 'Option 3' },
      { ID: 4, Name: 'Option 4' },
    ];
  }

  addDropdown() {
    this.dropdowns.push({ selectedValues: [] });
  }

  onDropdownValueChanged(event: any, index: number) {
    this.dropdowns[index].selectedValues = event.value;
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
    DxDropDownBoxModule,
  ],
  providers: [],
  exports: [],
  declarations: [AutoDownloadSettingsComponent],
})
export class AutoDownloadSettingsModule {}
