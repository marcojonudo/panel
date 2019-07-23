import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Coordinates} from "../objects/coordinates";
import {Card} from "../objects/card";
import {DropzoneInfo} from "../objects/dropzone-info";
import {CardsGroup} from "../objects/cards-group";

@Injectable({
	providedIn: 'root'
})
export class CardPositionService {

	// private scrollLeftSubject;
	// scrollLeft$: Observable<number>;
	private _dragging: boolean;
	private _dropzone: DropzoneInfo;
	private _position: Coordinates;
	private _helperCardsGroup: CardsGroup;

	private coordinatesSubject: BehaviorSubject<Coordinates>;
	private _coordinates$: Observable<Coordinates>;

	private helperCardsGroupSubject: BehaviorSubject<CardsGroup>;
	private _helperCardsGroup$: Observable<CardsGroup>;

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

		this.helperCardsGroupSubject = new BehaviorSubject<CardsGroup>(undefined);
		this.helperCardsGroup$ = this.helperCardsGroupSubject.asObservable();

		this.draggingSubject = new BehaviorSubject<boolean>(false);
		this.dragging$ = this.draggingSubject.asObservable();
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

	get position(): Coordinates {
		return this._position;
	}

	set position(value: Coordinates) {
		this._position = value;
	}

	get helperCardsGroup(): CardsGroup {
		return this._helperCardsGroup;
	}

	set helperCardsGroup(value: CardsGroup) {
		this._helperCardsGroup = value;
	}

	get coordinates$(): Observable<Coordinates> {
		return this._coordinates$;
	}

	set coordinates$(value: Observable<Coordinates>) {
		this._coordinates$ = value;
	}

	get helperCardsGroup$(): Observable<any> {
		return this._helperCardsGroup$;
	}

	set helperCardsGroup$(value: Observable<any>) {
		this._helperCardsGroup$ = value;
	}

	get dragging$(): Observable<any> {
		return this._dragging$;
	}

	set dragging$(value: Observable<any>) {
		this._dragging$ = value;
	}

	// endregion

	emitPosition(coordinates: Coordinates) {
		this.position = coordinates;
		this.coordinatesSubject.next(coordinates);
	}

	emitHelperCardsGroup(cardsGroup: CardsGroup) {
		this.helperCardsGroup = cardsGroup;
		this.helperCardsGroupSubject.next(this.helperCardsGroup);
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
