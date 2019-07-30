import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Coordinates} from "../objects/coordinates";
import {Card} from "../objects/card";
import {DropzoneInfo} from "../objects/dropzone-info";
import {CardsGroup} from "../objects/cards-group";
import {UtilsService} from "./utils.service";
import {TimeService} from "./time.service";
import {DaysService} from "./days.service";
import {Constants} from "../objects/constants";

@Injectable({
	providedIn: 'root'
})
export class CardPositionService {

	// private scrollLeftSubject;
	// scrollLeft$: Observable<number>;
	private _dragging: boolean;
	private _dropzone: DropzoneInfo;
	private _scrollLeft: number;
	private _scrollTop: number;
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

	constructor(
		private timeService: TimeService,
		private daysService: DaysService
	) {
		// this.scrollLeftSubject = new BehaviorSubject<number>(0);
		// this.scrollLeft$ = this.scrollLeftSubject.asObservable();
		this.scrollLeft = 0;
		this.scrollTop = 0;

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

	get scrollLeft(): number {
		return this._scrollLeft;
	}

	set scrollLeft(value: number) {
		this._scrollLeft = value;
	}

	get scrollTop(): number {
		return this._scrollTop;
	}

	set scrollTop(value: number) {
		this._scrollTop = value;
	}

	// endregion

	// region Emitters

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

	// endregion

	// region Handle position updates

	handleLinePosition(lastPosition: Coordinates, intervalWidth: number, daysMechanicCardsGroups: CardsGroup[]): Coordinates {
		/* La posición se redondea a los múltiplos de 5 minutos */
		let position = this.roundLastPosition(lastPosition, this.dropzone.rect, intervalWidth, this.scrollLeft);
		/* Se actualizan los datos relativos a la posicíon (left y topLine) en helperCardsGroup para que se tengan en
		*  cuenta a la hora de identificar las fichas solapadas */
		this.updateDimensionsProperties(this.helperCardsGroup, position, this.scrollLeft);

		/* Se gestionan los movimientos de fichas solapadas */
		this.handleOverlappedMovements(this.helperCardsGroup, daysMechanicCardsGroups, this.scrollLeft);

		/* Se define la nueva posición, una vez tenidas en cuenta las fichas solapadas, para completar la transición
		*  en la directiva draggable */
		position.x = this.leftToAbsolutePosition(this.helperCardsGroup.left);
		return position;
	}

	private roundLastPosition(position: Coordinates, rect: any, intervalWidth: number, scrollLeft: number): Coordinates {
		const leftIntervals = Math.floor(this.absolutePositionToLeft(position.x) / intervalWidth);
		const x = this.leftToAbsolutePosition(leftIntervals * intervalWidth);

		const line = Math.round((position.y - rect.top) / this.daysService.lineHeight);
		const y = rect.top + line * this.daysService.lineHeight;
		return new Coordinates(x, y, line);
	}

	private updateDimensionsProperties(cardsGroup: CardsGroup, position: Coordinates, scrollLeft: number): void {
		cardsGroup.left = this.absolutePositionToLeft(position.x);
		cardsGroup.cards.forEach(card => card.line = position.line);
	}

	private handleOverlappedMovements(cardsGroup: CardsGroup, daysMechanicCardsGroups: CardsGroup[], scrollLeft: number): void {
		/* Se obtienen las fichas solapadas */
		const overlappedCardsGroups = this.findOverlappedCardsGroups(cardsGroup, daysMechanicCardsGroups);

		/* Para saber si la ficha soltada está a la izquierda, derecha o entre dos fichas, se ordenan según la
		*  propiedad 'left' */
		const allCardsGroups = UtilsService.sort(
			overlappedCardsGroups.concat([cardsGroup]),
			(cardsGroup) => cardsGroup.left
		);
		/* Se actualizan los valores relacionados con la posicion (left y start) */
		this.updatePositionProperties(allCardsGroups, this.dropzone.mechanic.day, scrollLeft);

		/* Si la ficha soltada desplaza otras hacia la derecha, también se debe comprobar si estas, a su vez, se
		*  solapan con otras. Para ello, de la lista completa se obtienen aquellas que estén a la derecha de la soltada,
		*  y se repite la gestión para fichas solapadas */
		const checkNewOverlapped = allCardsGroups.slice(allCardsGroups.indexOf(cardsGroup)+1);
		if (checkNewOverlapped.length) {
			checkNewOverlapped.forEach(group => this.handleOverlappedMovements(group, daysMechanicCardsGroups, scrollLeft));
		}
	}

	private findOverlappedCardsGroups(cardsGroup: CardsGroup, dayMechanicCardsGroups: CardsGroup[]): CardsGroup[] {
		dayMechanicCardsGroups = dayMechanicCardsGroups.filter(group =>
			group.cards[0].line == cardsGroup.cards[0].line && group != cardsGroup
		);
		let newCardsMinutes = this.getDurationArray(
			this.timeService.calculateStart(cardsGroup.left, new Date()),
			cardsGroup.cards
		);
		newCardsMinutes = newCardsMinutes.slice(1, newCardsMinutes.length-1);

		return dayMechanicCardsGroups.filter(cardsGroup => {
			const minutesArray = this.getDurationArray(cardsGroup.cards[0].start, cardsGroup.cards);
			return minutesArray.find(minutes => newCardsMinutes.indexOf(minutes) >= 0);
		});
	}

	private getDurationArray(start: Date, cards: Card[]) {
		return UtilsService.createMinutesArray(
			UtilsService.getTotalMinutes(start),
			UtilsService.getTotalMinutes(UtilsService.addMinutes(start, UtilsService.sum(cards, 'duration')))
		);
	}

	private findCardsGroupsWidth(cardsGroups: CardsGroup[]): number {
		let cards = [];
		cardsGroups.forEach(cardsGroup => cards.push(...cardsGroup.cards));
		return cards.map(card => card.width).reduce((a, b) => a + b, 0);
	}

	private updatePositionProperties(cardsGroups: CardsGroup[], day: Date, scrollLeft: number) {
		cardsGroups.forEach((cardsGroup, index) => {
			const width = this.findCardsGroupsWidth(cardsGroups.slice(0, index));
			cardsGroup.left = cardsGroups[0].left + width;

			cardsGroup.cards.forEach((card, index) => {
				card.start = this.timeService.calculateStart(
					cardsGroup.left + UtilsService.sum(cardsGroup.cards.slice(0, index), 'duration'),
					day
				);
			});

		});
	}

	// endregion

	/* La posición del cursor en pantalla cuenta el eje de las X desde el inicio de la misma. Sin embargo, para hacer
	 * cálculos relativos al horario (con comienzo a las 8), se deben restar los 180px de ancho que tiene la info del
	 * mecánico */
	absolutePositionToLeft(value: number, scrollLeft: number = this.scrollLeft): number {
		return value + scrollLeft - Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	leftToAbsolutePosition(value: number, scrollLeft: number = this.scrollLeft): number {
		return value - scrollLeft + Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

}
