import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Coordinates} from "../objects/coordinates";

@Injectable({
  providedIn: 'root'
})
export class CardPositionService {

  private scrollLeftSubject;
  scrollLeft$: Observable<number>;

  private coordinatesSubject: BehaviorSubject<Coordinates>;
  private _coordinates$: Observable<Coordinates>;

  private helperCardSubject: BehaviorSubject<any>;
  helperCard$: Observable<any>;

  private _scrollLeft: number;

  constructor() {
    this.scrollLeftSubject = new BehaviorSubject<number>(0);
    this.scrollLeft$ = this.scrollLeftSubject.asObservable();

    this.coordinatesSubject = new BehaviorSubject<Coordinates>(new Coordinates(0, 0));
    this.coordinates$ = this.coordinatesSubject.asObservable();

    this.helperCardSubject = new BehaviorSubject<Coordinates>(undefined);
    this.helperCard$ = this.helperCardSubject.asObservable();
  }

  get coordinates$(): Observable<Coordinates> {
    return this._coordinates$;
  }

  set coordinates$(value: Observable<Coordinates>) {
    this._coordinates$ = value;
  }

  emitPosition(coordinates: Coordinates) {
    this.coordinatesSubject.next(coordinates);
  }

  emitHelperCard() {
    this.helperCardSubject.next({id: 1, width: 150})
  }

  get scrollLeft() {
    return this._scrollLeft;
  }

  set scrollLeft(value: number) {
    this._scrollLeft = value;
    console.log('scrolling');
    this.scrollLeftSubject.next(this.scrollLeft);
  }

}
