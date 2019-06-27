import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Card} from "../objects/card";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private cards: Card[];
  private unassignedCards: Card[];
  private assignedCards: Card[];

  private unassignedCardsSubject: BehaviorSubject<any>;
  private _unassignedCards$: Observable<any>;

  // private assignedDaysCardsSubject: BehaviorSubject<any>;
  // private _assignedDaysCards$: Observable<any>;

  private assignedDaysCardsSubjects: any;
  private _assignedDaysCards$: any;

  constructor() {
    // this.cards = [{id: 1, width: 350}, {id: 1, width: 150}, {id: 1, width: 200}, {id: 1, width: 100}, {id: 1, width: 350}, {id: 1, width: 350, day: "2019-06-25", mechanic: "A"}, {id: 2, width: 150, day: "2019-06-25", mechanic: "A"}, {id: 3, width: 150, day: "2019-06-25", mechanic: "A"}, {id: 4, width: 150, day: "2019-06-25", mechanic: "A"}, {id: 5, width: 150, day: "2019-06-25", mechanic: "A"}, {id: 1, width: 350, day: "2019-06-25", mechanic: "B"}, {id: 2, width: 150, day: "2019-06-25", mechanic: "B"}, {id: 3, width: 150, day: "2019-06-25", mechanic: "B"}, {id: 4, width: 150, day: "2019-06-25", mechanic: "B"}, {id: 5, width: 150, day: "2019-06-25", mechanic: "B"}, {id: 1, width: 350, day: "2019-06-26", mechanic: "B"}, {id: 2, width: 150, day: "2019-06-26", mechanic: "B"}, {id: 3, width: 150, day: "2019-06-26", mechanic: "B"}, {id: 4, width: 150, day: "2019-06-26", mechanic: "B"}, {id: 5, width: 150, day: "2019-06-26", mechanic: "B"}, {id: 1, width: 350, day: "2019-06-26", mechanic: "C"}, {id: 2, width: 150, day: "2019-06-26", mechanic: "C"}, {id: 3, width: 150, day: "2019-06-26", mechanic: "C"}, {id: 4, width: 150, day: "2019-06-26", mechanic: "C"}, {id: 5, width: 150, day: "2019-06-26", mechanic: "C"}, {id: 1, width: 350, day: "2019-06-27", mechanic: "A"}, {id: 2, width: 150, day: "2019-06-27", mechanic: "A"}, {id: 3, width: 150, day: "2019-06-27", mechanic: "A"}, {id: 4, width: 150, day: "2019-06-27", mechanic: "A"}, {id: 5, width: 150, day: "2019-06-27", mechanic: "A"}, {id: 1, width: 350, day: "2019-06-27", mechanic: "D"}, {id: 2, width: 150, day: "2019-06-27", mechanic: "D"}, {id: 3, width: 150, day: "2019-06-27", mechanic: "D"}, {id: 4, width: 150, day: "2019-06-27", mechanic: "D"}, {id: 5, width: 150, day: "2019-06-27", mechanic: "D"}];
    this.cards = [new Card(1, undefined, undefined, 350), new Card(1, undefined, undefined, 350), new Card(1, undefined, undefined, 350), new Card(1, undefined, undefined, 350), new Card(1, "2019-06-25", "A", 350), new Card(2, "2019-06-25", "A", 150), new Card(3, "2019-06-25", "A", 150), new Card(4, "2019-06-25", "A", 150), new Card(5, "2019-06-25", "A", 150), new Card(1, "2019-06-25", "B", 350), new Card(2, "2019-06-25", "B", 150), new Card(3, "2019-06-25", "B", 150), new Card(4, "2019-06-25", "B", 150), new Card(5, "2019-06-25", "B", 150), new Card(1, "2019-06-26", "B", 350), new Card(2, "2019-06-26", "B", 150), new Card(3, "2019-06-26", "B", 150), new Card(4, "2019-06-25", "B", 150), new Card(5, "2019-06-25", "B", 150), new Card(1, "2019-06-26", "C", 350), new Card(2, "2019-06-26", "C", 150), new Card(3, "2019-06-26", "C", 150), new Card(4, "2019-06-25", "C", 150), new Card(5, "2019-06-25", "C", 150), new Card(1, "2019-06-27", "A", 350), new Card(2, "2019-06-27", "A", 150), new Card(3, "2019-06-27", "A", 150), new Card(4, "2019-06-27", "A", 150), new Card(5, "2019-06-27", "A", 150), new Card(1, "2019-06-27", "D", 350), new Card(2, "2019-06-27", "D", 150), new Card(3, "2019-06-27", "D", 150), new Card(4, "2019-06-27", "D", 150), new Card(5, "2019-06-27", "D", 150)];
    // this.unassignedCards = [{day: '2019-06-12', id: 6, width: 150, left: 180, top: 120}];
    // this.unassignedCards = this.cards.filter(card => card.mechanic);
    this.unassignedCards = this.cards.filter(card => !card.day);

    this.assignedCards = this.cards.filter(card => card.day);
    const assignedDaysCards = this.initAssignedDaysCards(this.assignedCards);

    this.unassignedCardsSubject = new BehaviorSubject<any>(this.unassignedCards);
    this.unassignedCards$ = this.unassignedCardsSubject.asObservable();

    this.assignedDaysCardsSubjects = {};
    this.assignedDaysCards$ = {};

    this.initObservables(assignedDaysCards);
  }

  initAssignedDaysCards(assignedCards: Card[]): any {
    let assignedDaysCards = {};

    for (let card of assignedCards) {
      if (!assignedDaysCards[card.day]) {
        assignedDaysCards[card.day] = {};
      }

      if (!assignedDaysCards[card.day][card.mechanic]) {
        assignedDaysCards[card.day][card.mechanic] = []
      }

      assignedDaysCards[card.day][card.mechanic].push(card);
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

  // addCard(): void {
  //   this.assignedDaysCards['2019-06-25']['A'].push({id: 1234, width: 150});
  //   console.log(this.assignedDaysCards);
  //   this.assignedDaysCardsSubjects['2019-06-25']['A'].next(this.assignedDaysCards['2019-06-25']['A']);
  //   // this.assignedDaysCardsSubject.next(this.assignedDaysCards);
  // }

}
