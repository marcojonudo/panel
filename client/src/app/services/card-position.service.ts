import {ChangeDetectorRef, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Coordinates} from "../objects/coordinates";
import {Card} from "../objects/card";
import {DropzoneInfo} from "../objects/dropzone-info";

@Injectable({
  providedIn: 'root'
})
export class CardPositionService {

  // private scrollLeftSubject;
  // scrollLeft$: Observable<number>;
  private _dragging: boolean;
  private _dropzone: DropzoneInfo;

  private coordinatesSubject: BehaviorSubject<Coordinates>;
  private _coordinates$: Observable<Coordinates>;

  private helperCardSubject: BehaviorSubject<Card>;
  private _helperCard$: Observable<Card>;

  private draggingSubject: BehaviorSubject<boolean>;
  private _dragging$: Observable<boolean>;

  // private dropzoneSubject: BehaviorSubject<DropzoneInfo>;
  // private _dropzone$: Observable<DropzoneInfo>;

  // private _scrollLeft: number;

  constructor() {
    // this.scrollLeftSubject = new BehaviorSubject<number>(0);
    // this.scrollLeft$ = this.scrollLeftSubject.asObservable();

    this.coordinatesSubject = new BehaviorSubject<Coordinates>(new Coordinates(0, 0));
    this.coordinates$ = this.coordinatesSubject.asObservable();

    this.helperCardSubject = new BehaviorSubject<Card>(undefined);
    this.helperCard$ = this.helperCardSubject.asObservable();

    this.draggingSubject = new BehaviorSubject<boolean>(false);
    this.dragging$ = this.draggingSubject.asObservable();

    // this.dropzoneSubject = new BehaviorSubject<DropzoneInfo>(undefined);
    // this.dropzone$ = this.dropzoneSubject.asObservable();
  }

  // region Getters / setters

  get dragging(): boolean {
    return this._dragging;
  }

  set dragging(value: boolean) {
    this._dragging = value;
  }

  get dropzone(): DropzoneInfo {
    return this._dropzone;
  }

  set dropzone(value: DropzoneInfo) {
    this._dropzone = value;
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

  // get dropzone$(): Observable<DropzoneInfo> {
  //   return this._dropzone$;
  // }
  //
  // set dropzone$(value: Observable<DropzoneInfo>) {
  //   this._dropzone$ = value;
  // }

  // endregion

  emitPosition(coordinates: Coordinates) {
    // console.log('emitting coordinates', coordinates);
    this.coordinatesSubject.next(coordinates);
  }

  emitHelperCard(card: Card) {
    // console.log('card position service: emit helper card');
    this.helperCardSubject.next(card)
  }

  emitDragging(value: boolean) {
    this.dragging = value;
    this.draggingSubject.next(this.dragging);
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
