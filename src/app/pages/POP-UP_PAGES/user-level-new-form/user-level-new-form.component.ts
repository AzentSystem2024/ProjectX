import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  DxTabPanelModule,
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxTemplateModule,
  DxTabsModule,
  DxTextBoxModule,
  DxButtonModule,
  DxDataGridModule,
  DxTreeViewModule,
  DxValidatorModule,
  DxValidatorComponent,
  DxValidationSummaryModule,
} from 'devextreme-angular';
import { MasterReportService } from '../../MASTER PAGES/master-report.service';

@Component({
  selector: 'app-user-level-new-form',
  templateUrl: './user-level-new-form.component.html',
  styleUrls: ['./user-level-new-form.component.scss'],
  providers: [MasterReportService],
})
export class UserLevelNewFormComponent implements OnInit, OnChanges {
  @Input() sharedValue: any | false;

  width: any = '100%';
  rtlEnabled: boolean = false;
  scrollByContent: boolean = true;
  showNavButtons: boolean = true;
  orientations: any = 'horizontal';
  stylingMode: any = 'primary';
  iconPosition: any = 'left';
  selectedTabData: any[] = [];
  selectedRows: { [key: number]: any[] } = {};
  selectedTab: number = 0;
  allSelectedRows: any[] = [];
  MenuDatasource: any;
  UserLevelValue: any = '';
  isErrorVisible: boolean = false;
  constructor(private masterservice: MasterReportService) {}

  ngOnInit(): void {
    this.selectedTab = 0;
    this.UserLevelValue = '';
    this.get_All_MenuList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sharedValue'] && this.sharedValue) {
      this.selectedTab = 0;
      this.UserLevelValue = '';
      this.selectedTabData = [];

      //========Initialize selectedRows for each tab======
      this.MenuDatasource.forEach((tab, index) => {
        this.selectedRows[index] = [];
      });
      //==========Set the data for the initial tab========
      this.selectedTabData = this.MenuDatasource[this.selectedTab].Menus;
      // console.log('selected tab is :', this.selectedTabData);
    }
  }

  //==============All Menu List========================
  get_All_MenuList() {
    this.masterservice.get_userLevel_menuList().subscribe((response: any) => {
      this.MenuDatasource = response.Data;
    });
  }

  onTabClick(event: any): void {
    this.selectedTab = event.itemIndex;
    this.selectedTabData = this.MenuDatasource[this.selectedTab].Menus;
  }

  onSelectionChanged(event: any): void {
    if (this.UserLevelValue == '') {
      this.isErrorVisible = true;
    }
    this.selectedRows[this.selectedTab] = event.selectedRowsData;
    this.combineSelectedRows();
  }

  combineSelectedRows(): void {
    this.allSelectedRows = [];

    Object.keys(this.selectedRows)
      .filter((key) => this.selectedRows[key].length > 0)
      .forEach((key) => {
        const existingEntry = this.allSelectedRows.find(
          (row) => row.userLevelname === this.UserLevelValue
        );

        if (existingEntry) {
          existingEntry.Menus = [
            ...existingEntry.Menus,
            ...this.selectedRows[key].map((menu) => ({ MenuId: menu.MenuId })),
          ];
        } else {
          this.allSelectedRows.push({
            userLevelname: this.UserLevelValue,
            Menus: this.selectedRows[key].map((menu) => ({
              MenuId: menu.MenuId,
            })),
          });
        }
      });

    console.log('all selected row data :', this.allSelectedRows);
  }

  getNewUSerLevelData = () => ({ ...this.allSelectedRows });
}
@NgModule({
  imports: [
    CommonModule,
    DxTabPanelModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxTemplateModule,
    DxTabsModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxTreeViewModule,
    DxValidatorModule,
  ],
  providers: [],
  declarations: [UserLevelNewFormComponent],
  exports: [UserLevelNewFormComponent],
})
export class UserLevelNewFormModule {}
