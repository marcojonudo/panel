import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Coordinates} from "../objects/coordinates";
import {Card} from "../objects/card";
import {CardsGroup} from "../objects/cards-group";
import {UtilsService} from "./utils.service";
import {TimeService} from "./time.service";
import {DaysService} from "./days.service";
import {Constants} from "../objects/constants";
import {isNullOrUndefined} from "util";
import {CardsService} from "./cards.service";
import {Dropzone} from "../objects/dropzone-type/dropzone";
import {Subscription} from "rxjs/internal/Subscription";
import {GroupedTypeCards} from "../objects/grouped-type-cards";
import {UnassignedSection} from "../objects/unassigned-sections/unassigned-section";
import {NotificationService} from "./notification.service";

@Injectable({
	providedIn: 'root'
})
export class CardPositionService {

	private readonly GROUP_ROUND_POSITION_OFFSET: number = 5;
	// private scrollLeftSubject;
	// scrollLeft$: Observable<number>;
	private _dragging: boolean;
	private _hiddenGroup: CardsGroup;
	private _dropzone: Dropzone;
	private _destinyDropzone: Dropzone;
	private _originDropzone: Dropzone;

	private _unassignedCardTop: number;

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

	private maxScheduleWidthSubscription: Subscription;

	constructor(
		private cardsService: CardsService,
		private timeService: TimeService,
		private daysService: DaysService
	) {
		/* Este valor se utiliza para llevar a cabo una transición al soltar una ficha en la cinta. El top de una ficha
		*  no asignada siempre es el mismo, y se toma como referencia window.innerHeight porque la transicíon se llevará
		*  a cabo sobre la ficha auxiliar dentro del overlay (que ocupa toda la pantalla) */
		const unassignedCardRelativeTop = (Constants.VALUE.UNASSIGNED_BAR_HEIGHT - Constants.VALUE.LINE_HEIGHT_DEFAULT) / 2;
		this.unassignedCardTop = window.innerHeight - unassignedCardRelativeTop - Constants.VALUE.LINE_HEIGHT_DEFAULT;

		this.initialScrollLeft = 0;
		this.initialScrollTop = 0;
		this.scrollLeft = 0;
		this.scrollTop = 0;
		this.relativeScrollLeft = 0;
		this.relativeScrollTop = 0;

		this.coordinatesSubject = new BehaviorSubject<Coordinates>(new Coordinates(0, 0));
		this.coordinates$ = this.coordinatesSubject.asObservable();

		this.helperCardsGroupSubject = new BehaviorSubject<CardsGroup>(undefined);
		this.helperCardsGroup$ = this.helperCardsGroupSubject.asObservable();

		this.draggingSubject = new BehaviorSubject<boolean>(false);
		this.dragging$ = this.draggingSubject.asObservable();
	}

	init(unassignedSections: UnassignedSection[], assignedDaysGroups: any): void {
		this.maxScheduleWidthSubscription = this.timeService.maxScheduleWidth$.subscribe(() => {
			this.updateDimensions(unassignedSections, assignedDaysGroups);
			NotificationService.notifyAll();
		});
	}

	// region Getters / setters

	get dragging(): boolean {
		return this._dragging;
	}

	set dragging(value: boolean) {
		this._dragging = value;
	}

	get hiddenGroup(): CardsGroup {
		return this._hiddenGroup;
	}

	set hiddenGroup(value: CardsGroup) {
		this._hiddenGroup = value;
	}

	get dropzone(): Dropzone {
		return this._dropzone;
	}

	set dropzone(value: Dropzone) {
		this._dropzone = value;
	}

	get originDropzone(): Dropzone {
		return this._originDropzone;
	}

	set originDropzone(value: Dropzone) {
		this._originDropzone = value;
	}

	get destinyDropzone(): Dropzone {
		return this._destinyDropzone;
	}

	set destinyDropzone(value: Dropzone) {
		this._destinyDropzone = value;
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

	get unassignedCardTop(): number {
		return this._unassignedCardTop;
	}

	set unassignedCardTop(value: number) {
		this._unassignedCardTop = value;
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

	// region Update dimensions

	private updateDimensions(unassignedSections: UnassignedSection[], daysGroups: any) {
		this.updateUnassignedDimensions(unassignedSections);
		this.updateAssignedDimensions(daysGroups);
	}

	updateUnassignedDimensions(unassignedSections: UnassignedSection[]): void {
		for (const section of unassignedSections) {
			const groups = section.findGroups();
			groups.forEach((cardsGroup: CardsGroup, i: number) => {
				cardsGroup.cards.forEach((card) => {
					card.width = this.timeService.calcWidthFromDuration(card.duration);
				});
				cardsGroup.left = this.timeService.calcLeftFromCardsGroups(i, groups);
			});
		}
	}

	updateUnassignedLeft(
		unassignedTypesCardsGroups: GroupedTypeCards = this.cardsService.unassignedTypesCardsGroups
	): void {
		for (const groups of Object.values(unassignedTypesCardsGroups)) {
			groups.forEach((cardsGroup: CardsGroup, i: number) => {
				cardsGroup.left = this.timeService.calcLeftFromCardsGroups(i, groups);
			});
		}
	}

	updateUnassignedGroupsLeft(groups: CardsGroup[]): void {
		groups.forEach((group: CardsGroup, i: number) => {
			group.left = i == 0 ? 0 : this.timeService.calcLeftFromCardsGroups(i, groups);
		});
	}

	updateAssignedDimensions(daysGroups: any): void {
		for (let dayTime in daysGroups) {
			for (let mechanic in daysGroups[dayTime]) {
				daysGroups[dayTime][mechanic].forEach((cardsGroup: CardsGroup) => {
					cardsGroup.cards.forEach((card: Card) => {
						card.width = this.timeService.calcWidthFromDuration(card.duration);
					});
					cardsGroup.left = this.timeService.calcLeftFromStart(cardsGroup.cards[0].start);
				});
			}
		}
	}

	// endregion

	// region Handle position updates

	handleDestinyPosition(
		position: Coordinates,
		startPosition: Coordinates,
		group: CardsGroup = this.helperCardsGroup
	): Coordinates {
		if (this.destinyDropzone) {
			/* Se valida si el grupo encaja en la posición de destino (podría no caber en el horario, por ejemplo) */
			const groupsToUpdate = this.destinyDropzone.validateMovement(position);
			/* Se elimina el grupo del dropzone de origen. En el siguiente paso, en función de si el movimiento había
			*  validado o no, se añadirá al de destino o volverá de nuevo al de origen */
			this.originDropzone.removeGroup(group, groupsToUpdate != undefined, this.destinyDropzone);

			if (groupsToUpdate) { /* Si el movimiento es válido */
				const lastPosition = this.destinyDropzone.findLastPosition(groupsToUpdate, group, position);
				/* Se añade el grupo al dropzone de destino */
				this.destinyDropzone.addGroup(groupsToUpdate, group, this.originDropzone);
				return lastPosition;
			} else {
				this.originDropzone.handleNotValidatedMovement(group);
			}
		} else {
			this.originDropzone.removeGroup(group, false, this.destinyDropzone);
			this.originDropzone.handleNotValidatedMovement(group);
		}
		return startPosition;
	}

	handleUnassignedPosition(
		group: CardsGroup,
		typeGroups: GroupedTypeCards = this.cardsService.unassignedTypesCardsGroups
	): Coordinates {
		this.updateUnassignedGroupsLeft(typeGroups[group.type]);
		const groupIndex = typeGroups[group.cards[0].type].indexOf(group);
		return new Coordinates(
			group.left + (groupIndex + 1) * Constants.VALUE.UNASSIGNED_MARGIN_BETWEEN_GROUPS,
			this.unassignedCardTop
		);
	}

	validateAssignedPosition(
		position: Coordinates,
		dayMechanicCardsGroups: CardsGroup[],
		destinyDropzone: Dropzone = this.destinyDropzone,
		intervalWidth: number = this.timeService.intervalWidth,
		group: CardsGroup = this.helperCardsGroup
	): CardsGroup[] {
		/* Se comprueba si los laterales del grupo están fuera de la dropzone. Si lo están, se actualiza la posición
		 * para ajustar a los límites */
		position = this.fixGroupOutsideDropzonePosition(position, group);
		/* Si la ficha no cabe en el horario, se devuelve undefined para retornar a la posición original*/
		if (!position) {
			return undefined;
		}

		/* La posición se redondea a los múltiplos de 5 minutos */
		position = this.roundLastPosition(position, destinyDropzone.rect, intervalWidth);

		/* Se comprueba si, una vez arreglada y redondeada la posición, el intervalo que ocupa el grupo sigue saliéndose
		*  del horario. Si es así, se retorna undefined para volver a la posición original */
		const positionOutsideDropzone = this.checkPositionOutsideDropzone(position, group);
		if (positionOutsideDropzone) {
			return undefined;
		}

		/* En este punto, modificar las propiedades reales del grupo puede ser problemático, ya que no se han completado
		*  todas las validaciones; todavía faltan aquellas relativas a los grupos solapados. Por lo tanto, se clona para
		*  poder modificarlo sin hacerlo en el objeto original */
		const clonedGroup = group.clone();

		/* Se gestionan los movimientos de fichas solapadas. La lista que se retorna contiene tanto los grupos
		 * solapados, como el grupo original; es decir, todos los que se deben actualizar tras completar el movimiento */
		const groupsToUpdate = this.handleOverlappedMovements(dayMechanicCardsGroups, clonedGroup, position);

		/* Se comprueba si alguno de los grupos solapados se sale del horario */
		const groupsOutsideDropzone = this.checkGroupsOutsideDropzone(groupsToUpdate);
		/* Si es así, se retorna undefined para voler a la posición original */
		if (groupsOutsideDropzone) {
			return undefined;
		}

		/* Si todas las validaciones finalizan con éxito, se devuelve la posición redondeada que tendrá el grupo */
		return groupsToUpdate;
	}

	updateAssignedGroupsPosition(
		position: Coordinates,
		clonedGroups: CardsGroup[],
		dayMechanicCardsGroups: CardsGroup[],
		helperGroup: CardsGroup = this.helperCardsGroup
	): Coordinates {
		const allOriginalGroups = dayMechanicCardsGroups.concat(helperGroup);
		/* Si no se encuentra ningún grupo que, después de gestionarse el solapamiento, esté fuera del horario,
		*  se actualizan las propiedades en los grupos originales */
		clonedGroups.forEach(clonedGroup => {
			/* Se obtiene el grupo de todos los del día, en lugar de sólo los de la línea, porque la ficha que se está
			*  moviendo puede provenir de otra línea. Además, se añade cardsGroup porque si se mueve desde otra línea de
			*  mecánico, no va a estar en dayMechanicsCardsGroups */
			const group = allOriginalGroups.find(group => group.id == clonedGroup.id);
			/* Se actualizan los valores relacionados con la posicion (left y start) */
			this.cardsService.updatePosition(group, this.destinyDropzone.mechanic.day, position.line, clonedGroup.left);
		});
		this.cardsService.overlappedGroups = clonedGroups;

		/* Se define la nueva posición, una vez tenidas en cuenta las fichas solapadas, para completar la transición
		*  en la directiva draggable */
		position.x = this.leftToAbsolutePosition(helperGroup.left);
		return position;
	}

	private checkGroupsOutsideDropzone(
		groups: CardsGroup[],
		dropzone: Dropzone = this.destinyDropzone
	): boolean {
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(UtilsService.roundToDecimal(dropzone.rect.x, 2));
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.rect.right);

		return groups.find(group => {
			const duration = this.timeService.calcWidthFromDuration(this.timeService.calcDurationFromCardsGroup(group));
			return this.checkOutsideLeft(group.left, dropzoneLeft) ||
				this.checkOutsideRight(group.left + duration, dropzoneRight)
		}) != undefined;
	}

	private fixGroupOutsideDropzonePosition(
		position: Coordinates,
		cardsGroup: CardsGroup,
		dropzone: Dropzone = this.destinyDropzone
	): Coordinates {
		const leftX = this.absolutePositionToLeft(position.x);
		const durationWidth = this.timeService.calcWidthFromDuration(
			this.timeService.calcDurationFromCardsGroup(cardsGroup)
		);
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(dropzone.rect.x);
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.rect.right);

		let outsideLeft = this.checkOutsideLeft(leftX, dropzoneLeft);
		if (outsideLeft) {
			position.x = this.leftToAbsolutePosition(dropzoneLeft + this.GROUP_ROUND_POSITION_OFFSET);
		}
		let outsideRight = this.checkOutsideRight(leftX + durationWidth, dropzoneRight);
		if (outsideRight) {
			position.x = this.leftToAbsolutePosition(dropzoneRight - durationWidth + this.GROUP_ROUND_POSITION_OFFSET);
		}

		return outsideLeft && outsideRight ? undefined : position;
	}

	private checkPositionOutsideDropzone(
		position: Coordinates,
		cardsGroup: CardsGroup,
		dropzone: Dropzone = this.destinyDropzone
	): boolean {
		const leftX = this.absolutePositionToLeft(position.x);
		const duration = this.timeService.calcWidthFromDuration(this.timeService.calcDurationFromCardsGroup(cardsGroup));
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(UtilsService.roundToDecimal(dropzone.rect.x, 2));
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.rect.right);

		return this.checkOutsideLeft(leftX, dropzoneLeft)
			|| this.checkOutsideRight(leftX + duration, dropzoneRight, this.GROUP_ROUND_POSITION_OFFSET);
	}

	private checkOutsideLeft(leftX: number, dropzoneLeft: number): boolean {
		/* Si la coordenada x está fuera de la dropzone, se le asigna el valor izquierdo de la misma, más una cifra.
		*  Esta cifra permite que a la hora de redondear en el método roundLastPosition, la ficha quede dentro de la
		*  dropzone, en lugar de justo a la izquierda */
		return dropzoneLeft - leftX > 2;
	}

	private checkOutsideRight(rightX: number, dropzoneRight: number, offset: number = 0): boolean {
		return rightX - dropzoneRight > 2;
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
		[position.x, position.y, position.line] = [x, y, line];
		return position;
	}

	private updateLeft(cardsGroup: CardsGroup, position: Coordinates): void {
		cardsGroup.left = this.absolutePositionToLeft(position.x);
	}

	private handleOverlappedMovements(
		dayMechanicsGroups: CardsGroup[],
		clonedGroup: CardsGroup,
		position: Coordinates
	): CardsGroup[] {
		/* Se actualizan los datos relativos a la posicíon (left y topLine) en helperCardsGroup para que se tengan en
		*  cuenta a la hora de identificar las fichas solapadas */
		this.updateLeft(clonedGroup, position);

		const lineGroups = dayMechanicsGroups.filter(group => group.line == position.line);
		const overlappedGroups = this.iterateSuccessiveMovements(clonedGroup, lineGroups);
		return overlappedGroups.includes(clonedGroup) ? overlappedGroups : overlappedGroups.concat(clonedGroup);
	}

	private iterateSuccessiveMovements(
		clonedGroup: CardsGroup,
		lineGroups: CardsGroup[],
		groupsToUpdate: CardsGroup[] = []
	): CardsGroup[] {
		/* Se obtienen los grupos solapados. Se clonan para evitar que se actualice el left de los grupos originales,
		 * ya que si al final se determina que la ficha no se puede mover, ya se habría actualizado este valor */
		const overlappedCardsGroups = this.findOverlappedCardsGroups(clonedGroup, lineGroups);
		/* Se hacen los cálculos sólo si se encuentran fichas solapadas */
		if (overlappedCardsGroups.length) {
			const clonedOverlappedGroups = overlappedCardsGroups.map(group => group.clone());

			/* Para saber si la ficha soltada está a la izquierda, derecha o entre dos fichas, se ordenan según la
			*  propiedad 'left' */
			const allCardsGroups = UtilsService.sort(
				clonedOverlappedGroups.concat([clonedGroup]),
				(cardsGroup) => cardsGroup.left
			);

			/* Se actualiza la propiedad left de los grupos para comprobar si alguno queda fuera de la dropzone */
			this.calcLeft(allCardsGroups);

			/* Si la ficha soltada desplaza otras hacia la derecha, también se debe comprobar si estas, a su vez, se
			*  solapan con otras. Para ello, de la lista completa se obtienen aquellas que estén a la derecha de la soltada,
			*  y se repite la gestión para fichas solapadas */
			const movedGroupIndex = allCardsGroups.indexOf(clonedGroup);
			const checkNewOverlappedIndex = movedGroupIndex == allCardsGroups.length - 1
				? allCardsGroups.length - 1
				: movedGroupIndex + 1;
			const checkNewOverlapped = allCardsGroups.slice(checkNewOverlappedIndex);

			if (checkNewOverlapped.length) {
				return groupsToUpdate.concat(
					...checkNewOverlapped.map(group =>
						this.iterateSuccessiveMovements(group, lineGroups, [group])
					)
				);
			}
		}
		return groupsToUpdate;
	}

	private findOverlappedCardsGroups(
		cardsGroup: CardsGroup,
		lineGroups: CardsGroup[]
	): CardsGroup[] {
		lineGroups = lineGroups.filter(group => group.id != cardsGroup.id);
		let newCardsMinutes = this.getDurationArray(
			this.timeService.calcStart(cardsGroup.left, new Date()),
			cardsGroup.cards
		);
		newCardsMinutes = newCardsMinutes.slice(1, newCardsMinutes.length-1);

		return lineGroups.filter(cardsGroup => {
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

	private calcLeft(cardsGroups: CardsGroup[]) {
		cardsGroups.forEach((cardsGroup, index) => {
			const width = this.findCardsGroupsWidth(cardsGroups.slice(0, index));
			cardsGroup.left = cardsGroups[0].left + width;
		});
	}

	private findCardsGroupsWidth(cardsGroups: CardsGroup[]): number {
		let cards = [];
		cardsGroups.forEach(cardsGroup => cards.push(...cardsGroup.cards));
		return cards.map(card => card.width).reduce((a, b) => a + b, 0);
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
