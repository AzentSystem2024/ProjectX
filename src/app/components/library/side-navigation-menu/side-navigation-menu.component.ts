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
// import { navigation } from '../../../app-navigation';

@Component({
  selector: 'side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
})
export class SideNavigationMenuComponent implements AfterViewInit, OnDestroy ,OnInit {
  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<DxTreeViewTypes.ItemClickEvent>();

  @Output()
  openMenu = new EventEmitter<any>();
  navigation: any;

  @Input()
  get compactMode() {
    return this._compactMode;
  }

  @Input()
  set selectedItem(value: String) {
    this._selectedItem = value;
    this.setSelectedItem();
  }
  get selectedItem(): String {
    return this._selectedItem;
  }

  set compactMode(val) {
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

  private _selectedItem!: String;

  private _items!: Record<string, unknown>[];

  get items() {
    if (!this._items) {
      this._items = this.navigation.map((item:any) => {
        if (item.path && !/^\//.test(item.path)) {
          item.path = `/${item.path}`;
        }
        return { ...item, expanded: !this._compactMode };
      });
    }
    return this._items;
  }

  private _compactMode = false;

  constructor(
    private elementRef: ElementRef,
    private AuthService: AuthService
  ) {

  }
  ngOnInit(): void {
      // this.items
       this.navigation =JSON.parse(localStorage.getItem('sidemenuItems'));
      console.log(this.items)
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
}

@NgModule({
  imports: [DxTreeViewModule,DxTabPanelModule],
  declarations: [SideNavigationMenuComponent],
  exports: [SideNavigationMenuComponent],
})
export class SideNavigationMenuModule {}
