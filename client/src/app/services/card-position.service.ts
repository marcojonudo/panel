import {ChangeDetectorRef, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Coordinates} from "../objects/coordinates";

@Injectable({
  providedIn: 'root'
})
export class CardPositionService {

  // private scrollLeftSubject;
  // scrollLeft$: Observable<number>;

  private coordinatesSubject: BehaviorSubject<Coordinates>;
  private _coordinates$: Observable<Coordinates>;

  private helperCardSubject: BehaviorSubject<any>;
  private _helperCard$: Observable<any>;

  private draggingSubject: BehaviorSubject<boolean>;
  private _dragging$: Observable<boolean>;

  private dropzonePositionSubject: BehaviorSubject<any>;
  private _dropzonePosition$: Observable<any>;

  // private _scrollLeft: number;

  constructor() {
    // this.scrollLeftSubject = new BehaviorSubject<number>(0);
    // this.scrollLeft$ = this.scrollLeftSubject.asObservable();

    this.coordinatesSubject = new BehaviorSubject<Coordinates>(new Coordinates(0, 0));
    this.coordinates$ = this.coordinatesSubject.asObservable();

    this.helperCardSubject = new BehaviorSubject<Coordinates>(undefined);
    this.helperCard$ = this.helperCardSubject.asObservable();

    this.draggingSubject = new BehaviorSubject<boolean>(false);
    this.dragging$ = this.draggingSubject.asObservable();

    this.dropzonePositionSubject = new BehaviorSubject<any>(undefined);
    this.dropzonePosition$ = this.dropzonePositionSubject.asObservable();
  }

  get coordinates$(): Observable<Coordinates> {
    return this._coordinates$;
  }

  set coordinates$(value: Observable<Coordinates>) {
    this._coordinates$ = value;
  }

  get helperCard$(): Observable<any> {
    return this._helperCard$;
  }

  set helperCard$(value: Observable<any>) {
    this._helperCard$ = value;
  }

  get dragging$(): Observable<any> {
    return this._dragging$;
  }

  set dragging$(value: Observable<any>) {
    this._dragging$ = value;
  }

  get dropzonePosition$(): Observable<any> {
    return this._dropzonePosition$;
  }

  set dropzonePosition$(value: Observable<any>) {
    this._dropzonePosition$ = value;
  }

  emitPosition(coordinates: Coordinates) {
    // console.log('emitting coordinates', coordinates);
    this.coordinatesSubject.next(coordinates);
  }

  emitHelperCard(card: any) {
    this.helperCardSubject.next(card)
  }

  emitDragging(value: boolean) {
    this.draggingSubject.next(value);
  }

  emitDropzonePosition(clientRect: any) {
    this.dropzonePositionSubject.next(clientRect);
  }

  // get scrollLeft() {
  //   return this._scrollLeft;
  // }

  // set scrollLeft(value: number) {
  //   this._scrollLeft = value;
  //   console.log('scrolling');
  //   this.scrollLeftSubject.next(this.scrollLeft);
  // }

}
