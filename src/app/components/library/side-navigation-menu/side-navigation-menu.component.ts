import { AuthService } from 'src/app/services';
import {
  Component,
  NgModule,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  DxTreeViewModule,
  DxTreeViewComponent,
  DxTreeViewTypes,
} from 'devextreme-angular/ui/tree-view';
import { DxTabPanelModule } from 'devextreme-angular';
import * as events from 'devextreme/events';

@Component({
  selector: 'side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
})
export class SideNavigationMenuComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output() selectedItemChanged =
    new EventEmitter<DxTreeViewTypes.ItemClickEvent>();
  @Output() openMenu = new EventEmitter<any>();

  private _selectedItem!: String;
  private _compactMode = false;
  private _items!: Record<string, unknown>[];
  navigation: any;

  @Input()
  set selectedItem(value: String) {
    this._selectedItem = value;
    this.setSelectedItem();
  }

  get selectedItem(): String {
    return this._selectedItem;
  }

  @Input()
  set compactMode(val: boolean) {
    this._compactMode = val;

    if (!this.menu.instance) {
      return;
    }

    if (val) {
      this.menu.instance.collapseAll();
    } else {
      this.menu.instance.expandItem(this._selectedItem);
    }
  }

  get items() {
    if (!this._items) {
      // Transform the flat data to hierarchical structure
      this._items = this.transformMenuData(this.navigation);
    }
    return this._items;
  }

  constructor(
    private elementRef: ElementRef,
    private AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    // Load the navigation data from localStorage
    this.navigation = JSON.parse(localStorage.getItem('sidemenuItems') || '[]');
  }

  setSelectedItem() {
    if (!this.menu.instance) {
      return;
    }
    this.menu.instance.selectItem(this.selectedItem);
  }

  onItemClick(event: DxTreeViewTypes.ItemClickEvent) {
    this.selectedItemChanged.emit(event);
  }

  ngAfterViewInit() {
    this.setSelectedItem();
    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.next(e);
    });
  }

  ngOnDestroy() {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }

  // Transform the flat JSON data into a nested structure
  private transformMenuData(menuItems: any[]): any[] {
    const lookup: { [key: string]: any } = {};
    const rootMenus: any[] = [];

    menuItems.forEach((item) => {
      lookup[item.id] = { ...item, items: [] }; // Initialize with items as an empty array

      if (item.GroupID === '0') {
        rootMenus.push(lookup[item.id]);
      } else {
        if (lookup[item.GroupID]) {
          lookup[item.GroupID].items.push(lookup[item.id]);
        }
      }
    });

    return rootMenus;
  }
}

@NgModule({
  imports: [DxTreeViewModule, DxTabPanelModule],
  declarations: [SideNavigationMenuComponent],
  exports: [SideNavigationMenuComponent],
})
export class SideNavigationMenuModule {}
