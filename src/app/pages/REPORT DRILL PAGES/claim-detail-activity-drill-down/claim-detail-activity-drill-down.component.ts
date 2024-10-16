import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxLookupModule,
  DxNumberBoxModule
} from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';

@Component({
  selector: 'app-claim-detail-activity-drill-down',
  templateUrl: './claim-detail-activity-drill-down.component.html',
  styleUrls: ['./claim-detail-activity-drill-down.component.scss'],
})
export class ClaimDetailActivityDrillDownComponent {}
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
    DxNumberBoxModule,
    FormPopupModule,
  ],
  providers: [],
  exports: [ClaimDetailActivityDrillDownComponent],
  declarations: [ClaimDetailActivityDrillDownComponent],
})
export class ClaimDetailActivityDrillDownModule {}
