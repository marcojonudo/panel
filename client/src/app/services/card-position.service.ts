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
import {isNullOrUndefined} from "util";

@Injectable({
	providedIn: 'root'
})
export class CardPositionService {

	// private scrollLeftSubject;
	// scrollLeft$: Observable<number>;
	private _dragging: boolean;
	private _dropzone: DropzoneInfo;

	private _initialScrollLeft: number;
	private _initialScrollTop: number;
	private _scrollLeft: number;
	private _scrollTop: number;
	private _relativeScrollLeft: number;
	private _relativeScrollTop: number;

	private _position: Coordinates;
	private _helperCardsGroup: CardsGroup;

	private coordinatesSubject: BehaviorSubject<Coordinates>;
	private _coordinates$: Observable<Coordinates>;

	private helperCardsGroupSubject: BehaviorSubject<CardsGroup>;
	private _helperCardsGroup$: Observable<CardsGroup>;

	private draggingSubject: BehaviorSubject<boolean>;
	private _dragging$: Observable<boolean>;

	constructor(
		private timeService: TimeService,
		private daysService: DaysService
	) {
		this.initialScrollLeft = 0;
		this.initialScrollTop = 0;
		this.scrollLeft = 0;
		this.relativeScrollLeft = 0;
		this.relativeScrollTop = 0;

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

	get initialScrollTop(): number {
		return this._initialScrollTop;
	}

	set initialScrollTop(value: number) {
		this._initialScrollTop = value;
	}

	get initialScrollLeft(): number {
		return this._initialScrollLeft;
	}

	set initialScrollLeft(value: number) {
		this._initialScrollLeft = value;
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

	get relativeScrollLeft(): number {
		return this._relativeScrollLeft;
	}

	set relativeScrollLeft(value: number) {
		this._relativeScrollLeft = value;
	}

	get relativeScrollTop(): number {
		return this._relativeScrollTop;
	}

	set relativeScrollTop(value: number) {
		this._relativeScrollTop = value;
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

	handleLinePosition(
		lastPosition: Coordinates,
		intervalWidth: number,
		dayMechanicCardsGroups: CardsGroup[],
		cardsGroup: CardsGroup = this.helperCardsGroup
	): Coordinates {
		/* Para simplificar las operaciones, a medida que avanza el método se van actualizando propiedades como left.
		 * Se clona el objeto para evitar que, si en el último paso (fichas superpuestas) se determina que no se puede
		 * mover la ficha, se hayan actualizado erróneamente las propiedades del objeto original */
		const clonedCardsGroup = cardsGroup.clone();

		/* Se comprueba si los laterales del grupo están fuera de la dropzone */
		let position = this.handleGroupOutsideDropzone(lastPosition, clonedCardsGroup);
		/* Si la ficha no cabe en el horario, se devuelve undefined para retornar a la posición original*/
		if (!position) {
			return position;
		}
		/* La posición se redondea a los múltiplos de 5 minutos */
		position = this.roundLastPosition(lastPosition, this.dropzone.rect, intervalWidth);
		/* Se actualizan los datos relativos a la posicíon (left y topLine) en helperCardsGroup para que se tengan en
		*  cuenta a la hora de identificar las fichas solapadas */
		this.updateLeft(clonedCardsGroup, position);

		/* Se gestionan los movimientos de fichas solapadas */
		const groupOutsideDropzone = this.handleOverlappedMovements(position.line, clonedCardsGroup, dayMechanicCardsGroups);
		if (groupOutsideDropzone) {
			return undefined;
		}

		/* Se define la nueva posición, una vez tenidas en cuenta las fichas solapadas, para completar la transición
		*  en la directiva draggable */
		position.x = this.leftToAbsolutePosition(clonedCardsGroup.left);
		this.updatePositionProperties([cardsGroup], [clonedCardsGroup], position.line, this.dropzone.mechanic.day);
		return position;
	}

	private checkGroupOutsideDropzone(
		cardsGroups: CardsGroup[],
		dropzone: DropzoneInfo = this.dropzone
	): CardsGroup {
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(dropzone.rect.x);
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.rect.right);

		return cardsGroups.find(group => {
			const duration = this.timeService.calculateWidth(this.timeService.calcDuration(group));
			return this.checkOutsideLeft(group.left, dropzoneLeft) ||
				this.checkOutsideRight(group.left + duration, dropzoneRight)
		});
	}

	private handleGroupOutsideDropzone(
		position: Coordinates,
		cardsGroup: CardsGroup,
		dropzone: DropzoneInfo = this.dropzone
	): Coordinates {
		const leftX = this.absolutePositionToLeft(position.x);
		const duration = this.timeService.calculateWidth(this.timeService.calcDuration(cardsGroup));
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(dropzone.rect.x);
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.rect.right);

		let outsideLeft = this.checkOutsideLeft(leftX, dropzoneLeft);
		if (outsideLeft) {
			position.x = this.leftToAbsolutePosition(dropzoneLeft + 5);
		}
		let outsideRight = this.checkOutsideRight(leftX + duration, dropzoneRight);
		if (outsideRight) {
			position.x = this.leftToAbsolutePosition(dropzoneRight - duration);
		}
		return outsideLeft && outsideRight ? undefined : position;
	}

	private checkOutsideLeft(leftX: number, dropzoneLeft: number): boolean {
		/* Si la coordenada x está fuera de la dropzone, se le asigna el valor izquierdo de la misma, más una cifra.
		*  Esta cifra permite que a la hora de redondear en el método roundLastPosition, la ficha quede dentro de la
		*  dropzone, en lugar de justo a la izquierda */
		return leftX < dropzoneLeft;

	}

	private checkOutsideRight(rightX: number, dropzoneRight: number): boolean {
		return rightX > dropzoneRight;

	}

	private roundLastPosition(position: Coordinates, rect: any, intervalWidth: number): Coordinates {
		const leftIntervals = Math.floor(this.absolutePositionToLeft(position.x) / intervalWidth);
		const x = this.leftToAbsolutePosition(leftIntervals * intervalWidth);

		const line = Math.abs(
			Math.round(
				(this.absolutePositionToTop(position.y) - this.dropzoneAbsolutePositionToTop(rect.top)) / this.daysService.lineHeight
			)
		);
		const y = this.dropzoneTopToAbsolutePosition(rect.top) + line * this.daysService.lineHeight;
		return new Coordinates(x, y, line);
	}

	private updateLeft(cardsGroup: CardsGroup, position: Coordinates): void {
		cardsGroup.left = this.absolutePositionToLeft(position.x);
	}

	private handleOverlappedMovements(
		line: number,
		cardsGroup: CardsGroup,
		dayMechanicCardsGroups: CardsGroup[],
		dropzone: DropzoneInfo = this.dropzone
	): CardsGroup {
		/* Se obtienen los grupos solapados. Se clonan para evitar que se actualice el left de los grupos originales,
		 * ya que si al final se determina que la ficha no se puede mover, ya se habría actualizado este valor */
		const overlappedCardsGroups = this.findOverlappedCardsGroups(line, cardsGroup, dayMechanicCardsGroups);
		let groupOutsideDropzone = undefined;
		/* Se hacen los cálculos sólo si se encuentran fichas solapadas */
		if (overlappedCardsGroups.length) {
			const clonedOverlappedGroups = overlappedCardsGroups.map(group => group.clone());

			/* Para saber si la ficha soltada está a la izquierda, derecha o entre dos fichas, se ordenan según la
			*  propiedad 'left' */
			const allCardsGroups = UtilsService.sort(
				clonedOverlappedGroups.concat([cardsGroup]),
				(cardsGroup) => cardsGroup.left
			);
			/* Se actualiza la propiedad left de los grupos para comprobar si alguno queda fuera de la dropzone */
			this.calcLeft(allCardsGroups);

			groupOutsideDropzone = this.checkGroupOutsideDropzone(allCardsGroups, dropzone);
			if (groupOutsideDropzone) {
				return groupOutsideDropzone;
			}

			/* Si la ficha soltada desplaza otras hacia la derecha, también se debe comprobar si estas, a su vez, se
			*  solapan con otras. Para ello, de la lista completa se obtienen aquellas que estén a la derecha de la soltada,
			*  y se repite la gestión para fichas solapadas */
			const checkNewOverlapped = allCardsGroups.slice(allCardsGroups.indexOf(cardsGroup)+1);
			if (checkNewOverlapped.length) {
				groupOutsideDropzone = checkNewOverlapped.find(group =>
					this.handleOverlappedMovements(line, group, dayMechanicCardsGroups) != undefined
				);
			}

			/* Si no se encuentra ningún grupo que, después de gestionarse el solapamiento, esté fuera del horario,
			*  se actualizan las propiedades en los grupos originales */
			if (!groupOutsideDropzone) {
				console.log('UPDATING');
				/* Se actualizan los valores relacionados con la posicion (left y start) */
				this.updatePositionProperties(overlappedCardsGroups, clonedOverlappedGroups, line, dropzone.mechanic.day);
			}
		}

		return groupOutsideDropzone;
	}

	private findOverlappedCardsGroups(
		line: number,
		cardsGroup: CardsGroup,
		dayMechanicCardsGroups: CardsGroup[]
	): CardsGroup[] {
		dayMechanicCardsGroups = dayMechanicCardsGroups.filter(group =>
			group.cards[0].line == line && group.id != cardsGroup.id
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

	private calcLeft(cardsGroups: CardsGroup[]) {
		cardsGroups.forEach((cardsGroup, index) => {
			const width = this.findCardsGroupsWidth(cardsGroups.slice(0, index));
			cardsGroup.left = cardsGroups[0].left + width;
		});
	}

	private updatePositionProperties(groups: CardsGroup[], clonedGroups: CardsGroup[], line: number, day: Date) {
		groups.forEach((group, index) => {
			const clonedGroup = clonedGroups.find(g => g.id == group.id);
			group.left = clonedGroup.left;

			group.cards.forEach((card, index) => {
				card.line = line;
				card.start = this.timeService.calculateStartFromLeftDuration(
					group.left,
					UtilsService.sum(group.cards.slice(0, index), 'duration'),
					day
				);
			});
		});
	}

	// endregion

	// region Absolute / relative positions

	/* La posición del cursor en pantalla cuenta el eje de las X desde el inicio de la misma. Sin embargo, para hacer
	 * cálculos relativos al horario, se deben restar los 180px de ancho que tiene la info del
	 * mecánico */
	private absolutePositionToLeft(
		value: number,
		initialScrollLeft: number = this.initialScrollLeft,
		scrollLeft: number = this.scrollLeft,
		relativeScrollLeft: number = this.relativeScrollLeft
	): number {
		return value + (relativeScrollLeft != 0 ? initialScrollLeft + relativeScrollLeft : scrollLeft) - Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	private dropzoneAbsolutePositionToLeft(
		value: number,
		initialScrollLeft: number = this.initialScrollLeft
	): number {
		return value + initialScrollLeft - Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	private leftToAbsolutePosition(
		value: number,
		initialScrollLeft: number = this.initialScrollLeft,
		scrollLeft: number = this.scrollLeft,
		relativeScrollLeft: number = this.relativeScrollLeft
	): number {
		return value - (relativeScrollLeft != 0 ? initialScrollLeft + relativeScrollLeft : scrollLeft) + Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	private absolutePositionToTop(
		value: number,
		initialScrollTop: number = this.initialScrollTop,
		scrollTop: number = this.scrollTop,
		relativeScrollTop: number = this.relativeScrollTop
	): number {
		return value + (relativeScrollTop != 0 ? initialScrollTop + relativeScrollTop : scrollTop);
	}

	private dropzoneAbsolutePositionToTop(
		value: number,
		initialScrollTop: number = this.initialScrollTop
	): number {
		return value + initialScrollTop;
	}

	private dropzoneTopToAbsolutePosition(
		top: number,
		relativeScrollTop: number = this.relativeScrollTop
	) {
		return top - relativeScrollTop;
	}

	// endregion

}
