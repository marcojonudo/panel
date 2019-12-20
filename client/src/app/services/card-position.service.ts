import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Coordinates} from "../objects/coordinates";
import {Card} from "../objects/card";
import {CardsGroup} from "../objects/cards-group";
import {UtilsService} from "./utils.service";
import {Constants} from "../objects/constants";
import {CardsService} from "./cards.service";
import {Dropzone} from "../objects/dropzone-type/dropzone";
import {GroupedTypeCards} from "../objects/grouped-type-cards";
import {UnassignedSection} from "../objects/unassigned-sections/unassigned-section";
import {DimensionsService} from "./dimensions.service";
import {DaysAssignedGroups} from "../objects/days-assigned-groups";
import {NotificationService} from "./notification.service";

@Injectable({
	providedIn: 'root'
})
export class CardPositionService {

	private static readonly GROUP_ROUND_POSITION_OFFSET: number = 5;
	// private scrollLeftSubject;
	// scrollLeft$: Observable<number>;
	private static _dragging: boolean;
	private static _hiddenGroup: CardsGroup;
	private static _dropzone: Dropzone;
	private static _destinyDropzone: Dropzone;
	private static _originDropzone: Dropzone;

	private static _unassignedCardTop: number;

	private static _initialScrollLeft: number;
	private static _initialScrollTop: number;
	private static _scrollLeft: number;
	private static _scrollTop: number;
	private static _relativeScrollLeft: number;
	private static _relativeScrollTop: number;

	private static _position: Coordinates;
	private static _helperGroup: CardsGroup;

	// region Getters / setters

	static get dragging(): boolean {
		return this._dragging;
	}

	static set dragging(value: boolean) {
		this._dragging = value;
	}

	static get hiddenGroup(): CardsGroup {
		return this._hiddenGroup;
	}

	static set hiddenGroup(value: CardsGroup) {
		this._hiddenGroup = value;
	}

	static get originDropzone(): Dropzone {
		return this._originDropzone;
	}

	static set originDropzone(value: Dropzone) {
		this._originDropzone = value;
	}

	static get destinyDropzone(): Dropzone {
		return this._destinyDropzone;
	}

	static set destinyDropzone(value: Dropzone) {
		this._destinyDropzone = value;
	}

	static get position(): Coordinates {
		return this._position;
	}

	static set position(value: Coordinates) {
		this._position = value;
	}

	static get helperGroup(): CardsGroup {
		return this._helperGroup;
	}

	static set helperGroup(value: CardsGroup) {
		this._helperGroup = value;
	}

	static get initialScrollTop(): number {
		return this._initialScrollTop;
	}

	static set initialScrollTop(value: number) {
		this._initialScrollTop = value;
	}

	static get initialScrollLeft(): number {
		return this._initialScrollLeft;
	}

	static set initialScrollLeft(value: number) {
		this._initialScrollLeft = value;
	}

	static get scrollLeft(): number {
		return this._scrollLeft;
	}

	static set scrollLeft(value: number) {
		this._scrollLeft = value;
	}

	static get scrollTop(): number {
		return this._scrollTop;
	}

	static set scrollTop(value: number) {
		this._scrollTop = value;
	}

	static get relativeScrollLeft(): number {
		return this._relativeScrollLeft;
	}

	static set relativeScrollLeft(value: number) {
		this._relativeScrollLeft = value;
	}

	static get relativeScrollTop(): number {
		return this._relativeScrollTop;
	}

	static set relativeScrollTop(value: number) {
		this._relativeScrollTop = value;
	}

	static get unassignedCardTop(): number {
		return this._unassignedCardTop;
	}

	static set unassignedCardTop(value: number) {
		this._unassignedCardTop = value;
	}

	// endregion

	// region Init

	static init(): void {
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
	}

	// endregion

	// region Emitters

	static setHelperGroup(cardsGroup: CardsGroup) {
		this.helperGroup = cardsGroup;
		NotificationService.notifyHelperGroup(this.helperGroup);
	}

	// endregion

	// region Update dimensions

	static updateDimensions(unassignedSections: UnassignedSection[], daysGroups: DaysAssignedGroups) {
		this.updateUnassignedDimensions(unassignedSections);
		this.updateAssignedDimensions(daysGroups);
	}

	private static updateUnassignedDimensions(unassignedSections: UnassignedSection[]): void {
		for (const section of unassignedSections) {
			const groups = section.findGroups();
			groups.forEach((cardsGroup: CardsGroup, i: number) => {
				cardsGroup.cards.forEach((card) => {
					card.width = DimensionsService.calcWidthFromDuration(card.duration);
				});
				cardsGroup.left = DimensionsService.calcLeftFromCardsGroups(i, groups);
			});
		}
	}

	static updateUnassignedLeft(
		unassignedTypesCardsGroups: GroupedTypeCards
	): void {
		for (const groups of Object.values(unassignedTypesCardsGroups)) {
			groups.forEach((cardsGroup: CardsGroup, i: number) => {
				cardsGroup.left = DimensionsService.calcLeftFromCardsGroups(i, groups);
			});
		}
	}

	static updateUnassignedGroupsLeft(groups: CardsGroup[]): void {
		groups.forEach((group: CardsGroup, i: number) => {
			group.left = i == 0 ? 0 : DimensionsService.calcLeftFromCardsGroups(i, groups);
		});
	}

	private static updateAssignedDimensions(daysGroups: any): void {
		for (let dayTime in daysGroups) {
			for (let mechanic in daysGroups[dayTime]) {
				daysGroups[dayTime][mechanic].forEach((cardsGroup: CardsGroup) => {
					cardsGroup.cards.forEach((card: Card) => {
						card.width = DimensionsService.calcWidthFromDuration(card.duration);
					});
					cardsGroup.left = DimensionsService.calcLeftFromStart(cardsGroup.cards[0].start);
				});
			}
		}
	}

	// endregion

	// region Handle position updates

	static handleDestinyPosition(
		position: Coordinates,
		startPosition: Coordinates,
		group: CardsGroup = this.helperGroup
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
				this.destinyDropzone.addGroup(groupsToUpdate, group, this.originDropzone, lastPosition);
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

	static handleUnassignedPosition(
		group: CardsGroup,
		typeGroups: GroupedTypeCards
	): Coordinates {
		this.updateUnassignedGroupsLeft(typeGroups[group.type]);
		const groupIndex = typeGroups[group.cards[0].type].indexOf(group);
		return new Coordinates(
			group.left + (groupIndex + 1) * Constants.VALUE.UNASSIGNED_MARGIN_BETWEEN_GROUPS,
			this.unassignedCardTop
		);
	}

	static validateAssignedPosition(
		position: Coordinates,
		dayMechanicCardsGroups: CardsGroup[],
		destinyDropzone: Dropzone = this.destinyDropzone,
		intervalWidth: number = DimensionsService.intervalWidth,
		helperGroup: CardsGroup = this.helperGroup
	): CardsGroup[] {
		/* Se comprueba si los laterales del grupo están fuera de la dropzone. Si lo están, se actualiza la posición
		 * para ajustar a los límites */
		position = this.fixGroupOutsideDropzonePosition(position, helperGroup);
		/* Si la ficha no cabe en el horario, se devuelve undefined para retornar a la posición original*/
		if (!position) {
			return undefined;
		}

		/* La posición se redondea a los múltiplos de 5 minutos */
		position = this.roundLastPosition(position, destinyDropzone.rect, intervalWidth);

		/* Se comprueba si, una vez arreglada y redondeada la posición, el intervalo que ocupa el grupo sigue saliéndose
		*  del horario. Si es así, se retorna undefined para volver a la posición original */
		const positionOutsideDropzone = this.checkPositionOutsideDropzone(position, helperGroup);
		if (positionOutsideDropzone) {
			return undefined;
		}

		/* En este punto, modificar las propiedades reales del grupo puede ser problemático, ya que no se han completado
		*  todas las validaciones; todavía faltan aquellas relativas a los grupos solapados. Por lo tanto, se clona para
		*  poder modificarlo sin hacerlo en el objeto original */
		const clonedGroup = helperGroup.clone();

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

	static updateAssignedGroupsPosition(
		position: Coordinates,
		clonedGroups: CardsGroup[],
		// dayMechanicCardsGroups: CardsGroup[],
		helperGroup: CardsGroup = this.helperGroup
	): Coordinates {
		const helperClonedGroup = clonedGroups.find(group => group.id == helperGroup.id);

		position.x = this.leftToAbsolutePosition(helperClonedGroup.left);
		return position;
	}

	private static checkGroupsOutsideDropzone(
		groups: CardsGroup[],
		dropzone: Dropzone = this.destinyDropzone
	): boolean {
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(UtilsService.roundToDecimal(dropzone.rect.x, 2));
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.rect.right);

		return groups.find(group => {
			const duration = DimensionsService.calcWidthFromDuration(group.findDuration());
			return this.checkOutsideLeft(group.left, dropzoneLeft) ||
				this.checkOutsideRight(group.left + duration, dropzoneRight)
		}) != undefined;
	}

	private static fixGroupOutsideDropzonePosition(
		position: Coordinates,
		cardsGroup: CardsGroup,
		dropzone: Dropzone = this.destinyDropzone
	): Coordinates {
		const leftX = this.absolutePositionToLeft(position.x);
		const durationWidth = DimensionsService.calcWidthFromDuration(cardsGroup.findDuration());
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

	private static checkPositionOutsideDropzone(
		position: Coordinates,
		cardsGroup: CardsGroup,
		dropzone: Dropzone = this.destinyDropzone
	): boolean {
		const leftX = this.absolutePositionToLeft(position.x);
		const duration = DimensionsService.calcWidthFromDuration(cardsGroup.findDuration());
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(UtilsService.roundToDecimal(dropzone.rect.x, 2));
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.rect.right);

		return this.checkOutsideLeft(leftX, dropzoneLeft)
			|| this.checkOutsideRight(leftX + duration, dropzoneRight, this.GROUP_ROUND_POSITION_OFFSET);
	}

	private static checkOutsideLeft(leftX: number, dropzoneLeft: number): boolean {
		/* Si la coordenada x está fuera de la dropzone, se le asigna el valor izquierdo de la misma, más una cifra.
		*  Esta cifra permite que a la hora de redondear en el método roundLastPosition, la ficha quede dentro de la
		*  dropzone, en lugar de justo a la izquierda */
		return dropzoneLeft - leftX > 2;
	}

	private static checkOutsideRight(rightX: number, dropzoneRight: number, offset: number = 0): boolean {
		return rightX - dropzoneRight > 2;
	}

	private static roundLastPosition(position: Coordinates, rect: any, intervalWidth: number): Coordinates {
		const leftIntervals = Math.floor(this.absolutePositionToLeft(position.x) / intervalWidth);
		const x = this.leftToAbsolutePosition(leftIntervals * intervalWidth);

		const line = Math.abs(
			Math.round(
				(this.absolutePositionToTop(position.y) - this.dropzoneAbsolutePositionToTop(rect.top)) / DimensionsService.lineHeight
			)
		);
		const y = this.dropzoneTopToAbsolutePosition(rect.top) + line * DimensionsService.lineHeight;
		[position.x, position.y, position.line] = [x, y, line];
		return position;
	}

	private static updateLeft(cardsGroup: CardsGroup, position: Coordinates): void {
		cardsGroup.left = this.absolutePositionToLeft(position.x);
	}

	private static handleOverlappedMovements(
		dayMechanicsGroups: CardsGroup[],
		clonedGroup: CardsGroup,
		position: Coordinates
	): CardsGroup[] {
		/* Se actualizan los datos relativos a la posicíon (left y topLine) en helperGroup para que se tengan en
		*  cuenta a la hora de identificar las fichas solapadas */
		this.updateLeft(clonedGroup, position);

		const lineGroups = dayMechanicsGroups.filter(group => group.line == position.line);
		const overlappedGroups = this.iterateSuccessiveMovements(clonedGroup, lineGroups);
		return overlappedGroups.includes(clonedGroup) ? overlappedGroups : overlappedGroups.concat(clonedGroup);
	}

	private static iterateSuccessiveMovements(
		clonedGroup: CardsGroup,
		lineGroups: CardsGroup[],
		groupsToUpdate: CardsGroup[] = [],
		alreadyProcessedGroups: CardsGroup[] = [],
	): CardsGroup[] {
		/* Se obtienen los grupos solapados. Se clonan para evitar que se actualice el left de los grupos originales,
		 * ya que si al final se determina que la ficha no se puede mover, ya se habría actualizado este valor */
		const overlappedCardsGroups = this.findOverlappedCardsGroups(clonedGroup, lineGroups, alreadyProcessedGroups);
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
						this.iterateSuccessiveMovements(group, lineGroups, [group], allCardsGroups)
					)
				);
			}
		}
		return groupsToUpdate;
	}

	private static findOverlappedCardsGroups(
		clonedGroup: CardsGroup,
		lineGroups: CardsGroup[],
		alreadyProcessedGroups: CardsGroup[]
	): CardsGroup[] {
		/* Para calcular solapamientos, sólo se tienen en cuenta grupos que no hayan sido procesados con anterioridad.
		*  Si, por ejmeplo, en la primera iteración se procesa el grupo 7 y se actualiza su left, no debe tenerse en
		*  cuenta en la siguiente, ya que todas las operaciones que se le tenían que realizar finalizaron en su
		*  iteración */
		lineGroups = lineGroups.filter(group =>
			alreadyProcessedGroups.find(g => g.id == group.id) == undefined && group.id != clonedGroup.id
		);

		let newCardsMinutes = this.getDurationArray(
			DimensionsService.calcStartFromLeft(clonedGroup.left, new Date()),
			clonedGroup.cards
		);
		newCardsMinutes = newCardsMinutes.slice(1, newCardsMinutes.length-1);

		return lineGroups.filter(group => {
			const minutesArray = this.getDurationArray(group.cards[0].start, group.cards);
			return minutesArray.find(minutes => newCardsMinutes.indexOf(minutes) >= 0);
		});
	}

	private static getDurationArray(start: Date, cards: Card[]) {
		return UtilsService.createMinutesArray(
			UtilsService.getTotalMinutes(start),
			UtilsService.getTotalMinutes(UtilsService.addMinutes(start, UtilsService.sum(cards, 'duration')))
		);
	}

	private static calcLeft(cardsGroups: CardsGroup[]) {
		cardsGroups.forEach((cardsGroup, index) => {
			const width = this.findCardsGroupsWidth(cardsGroups.slice(0, index));
			cardsGroup.left = cardsGroups[0].left + width;
		});
	}

	private static findCardsGroupsWidth(cardsGroups: CardsGroup[]): number {
		let cards = [];
		cardsGroups.forEach(cardsGroup => cards.push(...cardsGroup.cards));
		return cards.map(card => card.width).reduce((a, b) => a + b, 0);
	}

	// endregion

	// region Absolute / relative positions

	/* La posición del cursor en pantalla cuenta el eje de las X desde el inicio de la misma. Sin embargo, para hacer
	 * cálculos relativos al horario, se deben restar los 180px de ancho que tiene la info del
	 * mecánico */
	private static absolutePositionToLeft(
		value: number,
		initialScrollLeft: number = this.initialScrollLeft,
		scrollLeft: number = this.scrollLeft,
		relativeScrollLeft: number = this.relativeScrollLeft
	): number {
		return value + (relativeScrollLeft != 0 ? initialScrollLeft + relativeScrollLeft : scrollLeft) - Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	private static dropzoneAbsolutePositionToLeft(
		value: number,
		initialScrollLeft: number = this.initialScrollLeft
	): number {
		return value + initialScrollLeft - Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	private static leftToAbsolutePosition(
		value: number,
		initialScrollLeft: number = this.initialScrollLeft,
		scrollLeft: number = this.scrollLeft,
		relativeScrollLeft: number = this.relativeScrollLeft
	): number {
		return value - (relativeScrollLeft != 0 ? initialScrollLeft + relativeScrollLeft : scrollLeft) + Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	private static absolutePositionToTop(
		value: number,
		initialScrollTop: number = this.initialScrollTop,
		scrollTop: number = this.scrollTop,
		relativeScrollTop: number = this.relativeScrollTop
	): number {
		return value + (relativeScrollTop != 0 ? initialScrollTop + relativeScrollTop : scrollTop);
	}

	private static dropzoneAbsolutePositionToTop(
		value: number,
		initialScrollTop: number = this.initialScrollTop
	): number {
		return value + initialScrollTop;
	}

	private static dropzoneTopToAbsolutePosition(
		top: number,
		relativeScrollTop: number = this.relativeScrollTop
	) {
		return top - relativeScrollTop;
	}

	// endregion

}
