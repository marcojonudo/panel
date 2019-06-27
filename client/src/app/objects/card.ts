export class Card {

  id: number;
  day: string;
  mechanic: string;

  width: number;

  constructor(id: number, day: string, mechanic: string, width: number) {
    this.id = id;
    this.day = day;
    this.mechanic = mechanic;
    this.width = width;
  }

}
