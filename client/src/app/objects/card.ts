export class Card {

  id: number;
  day: string;
  mechanicCode: string;

  start: string;
  duration: number;
  end: string;

  left: number;
  width: number;

  constructor(id: number, day: string, mechanicCode: string, start: string, duration: number, end: string, width: number) {
    this.id = id;
    this.day = day;
    this.mechanicCode = mechanicCode;
    this.start = start;
    this.duration = duration;
    this.end = end;
    this.width = width;
  }

}
