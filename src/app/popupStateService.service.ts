import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupStateService {
  private popupOpenState = false;

  setPopupState(isOpen: boolean) {
    this.popupOpenState = isOpen;
  }

  getPopupState(): boolean {
    return this.popupOpenState;
  }
}
