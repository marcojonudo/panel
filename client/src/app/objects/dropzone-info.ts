import {Mechanic} from "./mechanic";

export class DropzoneInfo {

  mechanic: Mechanic;
  rect: any;

  constructor(mechanic: Mechanic, rect: any) {
    this.mechanic = mechanic;
    this.rect = rect;
  }

}
