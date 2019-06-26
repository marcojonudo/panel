import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private cards: any[];
  private unassignedCards: any[];
  private unassignedCardsDays: any;

  private unassignedCardsSubject: BehaviorSubject<any>;
  private _unassignedCards$: Observable<any>;

  private unassignedCardsDaysSubject: BehaviorSubject<any>;
  private _unassignedCardsDays$: Observable<any>;

  constructor() {
    this.cards = [{id: 1, width: 350, mechanic: 'A'}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}];
    // this.unassignedCards = [{day: '2019-06-12', id: 6, width: 150, left: 180, top: 120}];
    this.unassignedCards = this.cards.filter(card => card.mechanic);

    this.unassignedCardsSubject = new BehaviorSubject<any>(undefined);
    this.unassignedCards$ = this.unassignedCardsSubject.asObservable();

    this.unassignedCardsDays = {
      '2019-06-25': {
        'A': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
        'B': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
      },
      '2019-06-26': {
        'B': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
        'C': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
      },
      '2019-06-27': {
        'A': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
        'C': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
      },
    };
    this.unassignedCardsDaysSubject = new BehaviorSubject<any>(this.unassignedCardsDays);
    this.unassignedCardsDays$ = this.unassignedCardsDaysSubject.asObservable();

    // this.unassignedCardsDays = {
    //   '2019-06-25': {
    //     'A': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
    //     'B': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
    //   },
    //   '2019-06-26': {
    //     'B': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
    //     'C': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
    //   },
    //   '2019-06-27': {
    //     'A': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
    //     'C': [{id: 1, width: 350}, {id: 2, width: 150}, {id: 3, width: 150}, {id: 4, width: 150}, {id: 5, width: 150}],
    //   },
    // };
  }

  get unassignedCards$(): Observable<any> {
    return this._unassignedCards$;
  }

  set unassignedCards$(value: Observable<any>) {
    this._unassignedCards$ = value;
  }

  get unassignedCardsDays$(): Observable<any> {
    return this._unassignedCardsDays$;
  }

  set unassignedCardsDays$(value: Observable<any>) {
    this._unassignedCardsDays$ = value;
  }

  addCard(): void {
    this.unassignedCardsDays['2019-06-25']['A'].push({id: 1234, width: 150});
    console.log(this.unassignedCardsDays);
    this.unassignedCardsDaysSubject.next(this.unassignedCardsDays);
  }

}
