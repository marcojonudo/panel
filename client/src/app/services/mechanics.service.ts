import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MechanicsService {

  private _mechanics: string[];

  constructor() {
    this.mechanics = ['A', 'B', 'C', 'D'];
    // this.mechanics = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  }

  get mechanics() {
    return this._mechanics;
  }

  set mechanics(mechanics: string[]) {
    this._mechanics = mechanics
  }

}
