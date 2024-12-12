import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupStateService {
  private popupStates: { [key: string]: boolean } = {};

  setPopupState(popupId: string, isOpen: boolean) {
    this.popupStates[popupId] = isOpen;
  }

  getPopupState(popupId: string): boolean {
    return this.popupStates[popupId] || false;
  }
}

