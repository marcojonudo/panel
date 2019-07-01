import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Card} from "../objects/card";
import {Mechanic} from "../objects/mechanic";
import {TimeService} from "./time.service";
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private cards: Card[];
  private unassignedCards: Card[];
  private assignedCards: Card[];
  private assignedDaysCards: any;

  private unassignedCardsSubject: BehaviorSubject<any>;
  private _unassignedCards$: Observable<any>;

  // private assignedDaysCardsSubject: BehaviorSubject<any>;
  // private _assignedDaysCards$: Observable<any>;

  private assignedDaysCardsSubjects: any;
  private _assignedDaysCards$: any;

  private widthSubscription: any;

  constructor(
    private timeService: TimeService
  ) {
    // this.cards = [{id: 1, width: 350}, {id: 1, width: 150}, {id: 1, width: 200}, {id: 1, width: 100}, {id: 1, width: 350}, {id: 1, width: 350, day: "2019-06-25", mechanic: "A"}, {id: 2, width: 150, day: "2019-06-25", mechanic: "A"}, {id: 3, width: 150, day: "2019-06-25", mechanic: "A"}, {id: 4, width: 150, day: "2019-06-25", mechanic: "A"}, {id: 5, width: 150, day: "2019-06-25", mechanic: "A"}, {id: 1, width: 350, day: "2019-06-25", mechanic: "B"}, {id: 2, width: 150, day: "2019-06-25", mechanic: "B"}, {id: 3, width: 150, day: "2019-06-25", mechanic: "B"}, {id: 4, width: 150, day: "2019-06-25", mechanic: "B"}, {id: 5, width: 150, day: "2019-06-25", mechanic: "B"}, {id: 1, width: 350, day: "2019-06-26", mechanic: "B"}, {id: 2, width: 150, day: "2019-06-26", mechanic: "B"}, {id: 3, width: 150, day: "2019-06-26", mechanic: "B"}, {id: 4, width: 150, day: "2019-06-26", mechanic: "B"}, {id: 5, width: 150, day: "2019-06-26", mechanic: "B"}, {id: 1, width: 350, day: "2019-06-26", mechanic: "C"}, {id: 2, width: 150, day: "2019-06-26", mechanic: "C"}, {id: 3, width: 150, day: "2019-06-26", mechanic: "C"}, {id: 4, width: 150, day: "2019-06-26", mechanic: "C"}, {id: 5, width: 150, day: "2019-06-26", mechanic: "C"}, {id: 1, width: 350, day: "2019-06-27", mechanic: "A"}, {id: 2, width: 150, day: "2019-06-27", mechanic: "A"}, {id: 3, width: 150, day: "2019-06-27", mechanic: "A"}, {id: 4, width: 150, day: "2019-06-27", mechanic: "A"}, {id: 5, width: 150, day: "2019-06-27", mechanic: "A"}, {id: 1, width: 350, day: "2019-06-27", mechanic: "D"}, {id: 2, width: 150, day: "2019-06-27", mechanic: "D"}, {id: 3, width: 150, day: "2019-06-27", mechanic: "D"}, {id: 4, width: 150, day: "2019-06-27", mechanic: "D"}, {id: 5, width: 150, day: "2019-06-27", mechanic: "D"}];
    this.cards = [new Card(1, undefined, undefined, undefined, undefined, undefined, 100), new Card(2, undefined, undefined, undefined, undefined, undefined, 150), new Card(3, undefined, undefined, undefined, undefined, undefined, 350), new Card(4, undefined, undefined, undefined, undefined, undefined, 200), new Card(1, "2019-06-25", "A", '09:00:00', 30, '09:30:00', 350), new Card(2, "2019-06-25", "A", '10:00:00', 15, '10:15:00', 150), new Card(3, "2019-06-25", "A", '11:00:00', 30, '11:30:00', 150), new Card(4, "2019-06-25", "A", '11:30:00', 15, '11:45:00', 150), new Card(5, "2019-06-25", "A", '12:00:00', 30, '12:30:00', 150), new Card(1, "2019-06-25", "B", '09:00:00', 30, '09:30:00', 350), new Card(2, "2019-06-25", "B", '09:00:00', 30, '09:30:00', 150), new Card(3, "2019-06-25", "B", '09:00:00', 30, '09:30:00', 150), new Card(4, "2019-06-25", "B", '09:00:00', 30, '09:30:00', 150), new Card(5, "2019-06-25", "B", '09:00:00', 30, '09:30:00', 150), new Card(1, "2019-06-26", "B", '09:00:00', 30, '09:30:00', 350), new Card(2, "2019-06-26", "B", '09:00:00', 30, '09:30:00', 150), new Card(3, "2019-06-26", "B", '09:00:00', 30, '09:30:00', 150), new Card(4, "2019-06-25", "B", '09:00:00', 30, '09:30:00', 150), new Card(5, "2019-06-25", "B", '09:00:00', 30, '09:30:00', 150), new Card(1, "2019-06-26", "C", '09:00:00', 30, '09:30:00', 350), new Card(2, "2019-06-26", "C", '09:00:00', 30, '09:30:00', 150), new Card(3, "2019-06-26", "C", '09:00:00', 30, '09:30:00', 150), new Card(4, "2019-06-25", "C", '09:00:00', 30, '09:30:00', 150), new Card(5, "2019-06-25", "C", '09:00:00', 30, '09:30:00', 150), new Card(1, "2019-06-27", "A", '09:00:00', 30, '09:30:00', 350), new Card(2, "2019-06-27", "A", '09:00:00', 30, '09:30:00', 150), new Card(3, "2019-06-27", "A", '09:00:00', 30, '09:30:00', 150), new Card(4, "2019-06-27", "A", '09:00:00', 30, '09:30:00', 150), new Card(5, "2019-06-27", "A", '09:00:00', 30, '09:30:00', 150), new Card(1, "2019-06-27", "D", '09:00:00', 30, '09:30:00', 350), new Card(2, "2019-06-27", "D", '09:00:00', 30, '09:30:00', 150), new Card(3, "2019-06-27", "D", '09:00:00', 30, '09:30:00', 150), new Card(4, "2019-06-27", "D", '09:00:00', 30, '09:30:00', 150), new Card(5, "2019-06-27", "D", '09:00:00', 30, '09:30:00', 150)];

    // this.unassignedCards = [{day: '2019-06-12', id: 6, width: 150, left: 180, top: 120}];
    // this.unassignedCards = this.cards.filter(card => card.mechanic);
    this.unassignedCards = this.cards.filter(card => !card.day);

    this.assignedCards = this.cards.filter(card => card.day);
    // for (let card of this.assignedCards) {
    //   card.left = this.calculateCardLeft(card.start);
    // }
    this.assignedDaysCards = this.initAssignedDaysCards(this.assignedCards);

    this.unassignedCardsSubject = new BehaviorSubject<any>(this.unassignedCards);
    this.unassignedCards$ = this.unassignedCardsSubject.asObservable();

    this.assignedDaysCardsSubjects = {};
    this.assignedDaysCards$ = {};

    this.initObservables(this.assignedDaysCards);

    this.widthSubscription = this.timeService.intervalWidth$.subscribe(intervalWidth => {
      // console.log('updated dropzone width in cards: ', intervalWidth);
      this.calculatePosition()
    });

    console.log('Unassigned cards', this.unassignedCards);
    console.log('Assigned days cards', this.assignedDaysCards);
  }

  // region Getters / setters

  get unassignedCards$(): Observable<any> {
    return this._unassignedCards$;
  }

  set unassignedCards$(value: Observable<any>) {
    this._unassignedCards$ = value;
  }

  get assignedDaysCards$(): any {
    return this._assignedDaysCards$;
  }

  set assignedDaysCards$(value: any) {
    this._assignedDaysCards$ = value;
  }

  // endregion

  initAssignedDaysCards(assignedCards: Card[]): any {
    let assignedDaysCards = {};

    for (let card of assignedCards) {
      if (!assignedDaysCards[card.day]) {
        assignedDaysCards[card.day] = {};
      }

      if (!assignedDaysCards[card.day][card.mechanicCode]) {
        assignedDaysCards[card.day][card.mechanicCode] = []
      }

      assignedDaysCards[card.day][card.mechanicCode].push(card);
    }

    return assignedDaysCards
  }

  initObservables(assignedDaysCards: any): void {
    for (let day in assignedDaysCards) {
      this.assignedDaysCardsSubjects[day] = {};
      this.assignedDaysCards$[day] = {};
      for (let mechanic in assignedDaysCards[day]) {
        const subject = new BehaviorSubject<any>(assignedDaysCards[day][mechanic]);
        const observable = subject.asObservable();

        this.assignedDaysCardsSubjects[day][mechanic] = subject;
        this.assignedDaysCards$[day][mechanic] = observable;
      }
    }
  }

  updateCard(newMechanic: Mechanic, card: Card) {
    // console.log('updating card', newMechanic, card);

    const assignedInfo = this.removeCardFromOrigin(card);
    this.addToDestiny(newMechanic, card);

    console.log(this.unassignedCards);
    console.log(this.assignedDaysCards);
    card.day = newMechanic.day;
    card.mechanicCode = newMechanic.position;
    this.notifyChanges(assignedInfo, newMechanic);
  }

  private removeCardFromOrigin(card: Card): any {
    if (card.mechanicCode) {
      const cardIndex = this.assignedDaysCards[card.day][card.mechanicCode].indexOf(card);
      this.assignedDaysCards[card.day][card.mechanicCode].splice(cardIndex, 1);
      return {day: card.day, mechanicCode: card.mechanicCode};
    } else {
      const cardIndex = this.unassignedCards.indexOf(card);
      this.unassignedCards.splice(cardIndex, 1);
    }
  }

  private addToDestiny(newMechanic: Mechanic, card: Card): void {
    if (!this.assignedDaysCards[newMechanic.day]) {
      this.assignedDaysCards[newMechanic.day] = {};
      this.assignedDaysCardsSubjects[newMechanic.day] = {};
      this.assignedDaysCards$[newMechanic.day] = {};
    }
    if (!this.assignedDaysCards[newMechanic.day][newMechanic.position]) {
      this.assignedDaysCards[newMechanic.day][newMechanic.position] = [card];
      this.assignedDaysCardsSubjects[newMechanic.day][newMechanic.position] = new BehaviorSubject<Card[]>(this.assignedDaysCards[newMechanic.day][newMechanic.position]);
      this.assignedDaysCards$[newMechanic.day][newMechanic.position] = this.assignedDaysCardsSubjects[newMechanic.day][newMechanic.position].asObservable();
    } else {
      this.assignedDaysCards[newMechanic.day][newMechanic.position].push(card);
    }
  }

  private notifyChanges(assignedInfo, newMechanic: Mechanic): void {
    if (assignedInfo) {
      this.assignedDaysCardsSubjects[assignedInfo.day][assignedInfo.mechanicCode].next(this.assignedDaysCards[assignedInfo.day][assignedInfo.mechanicCode]);
    } else {
      this.unassignedCardsSubject.next(this.unassignedCards);
    }
    this.assignedDaysCardsSubjects[newMechanic.day][newMechanic.position].next(this.assignedDaysCards[newMechanic.day][newMechanic.position]);
  }

  private calculatePosition() {
    for (let card of this.assignedCards) {
      const start = UtilsService.parseTime(card.start);
      card.left = this.calculateCardLeft(start);
      card.width = this.calculateCardWidth(card.duration);
      // console.log('width', card.duration, card.width);
    }
    for (let day in this.assignedDaysCardsSubjects) {
      for (let mechanic in this.assignedDaysCardsSubjects[day]) {
        this.assignedDaysCardsSubjects[day][mechanic].next(this.assignedDaysCards[day][mechanic])
      }
    }
  }

  private calculateCardLeft(start: Date) {
    const relativeMinutes = this.timeService.getRelativeMinutes(start);
    const relativeIntervals = this.timeService.getIntervalsNumber(relativeMinutes);

    return relativeIntervals * this.timeService.intervalWidth;
  }

  private calculateCardWidth(duration: number) {
    const intervalsNumber = this.timeService.getIntervalsNumber(duration);
    return intervalsNumber * this.timeService.intervalWidth;
  }

}
