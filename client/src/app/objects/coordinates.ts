export class Coordinates {
  x: number;
  y: number;
  topLine: boolean;

  constructor(x: number, y: number, topLine: boolean = undefined) {
    this.x = x;
    this.y = y;
    this.topLine = topLine;
  }

}
