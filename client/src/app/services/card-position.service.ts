import {Injectable} from '@angular/core';
import {Coordinates} from "../objects/coordinates";
import {Card} from "../objects/card";
import {CardsGroup} from "../objects/cards-group";
import {UtilsService} from "./utils.service";
import {Constants} from "../objects/constants";
import {Dropzone} from "../objects/dropzone-type/dropzone";
import {UnassignedSection} from "../objects/unassigned-sections/unassigned-section";
import {DimensionsService} from "./dimensions.service";
import {DaysAssignedGroups} from "../objects/days-assigned-groups";
import {NotificationService} from "./notification.service";
import {Position} from "../objects/position";
import {CardsService} from "./cards.service";
import * as dayjs from "dayjs";
import {Dayjs} from "dayjs";

@Injectable({
	providedIn: 'root'
})
export class CardPositionService {

	private static readonly GROUP_ROUND_POSITION_OFFSET: number = 5;
	private static _dragging: boolean;
	private static _hiddenGroup: CardsGroup;
	private static _destinyDropzone: Dropzone;
	private static _originDropzone: Dropzone;

	private static _unassignedCardTop: number;

	private static _scrollLeft: number;
	private static _scrollTop: number;
	private static _barScrollLeft: number;

	private static _coordinates: Coordinates;
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

	static get coordinates(): Coordinates {
		return this._coordinates;
	}

	static set coordinates(value: Coordinates) {
		this._coordinates = value;
	}

	static get helperGroup(): CardsGroup {
		return this._helperGroup;
	}

	static set helperGroup(value: CardsGroup) {
		this._helperGroup = value;
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

	static get unassignedCardTop(): number {
		return this._unassignedCardTop;
	}

	static set unassignedCardTop(value: number) {
		this._unassignedCardTop = value;
	}

	static get barScrollLeft(): number {
		return this._barScrollLeft;
	}

	static set barScrollLeft(value: number) {
		this._barScrollLeft = value;
	}

	// endregion

	// region Init

	static init(): void {
		/* Este valor se utiliza para llevar a cabo una transición al soltar una ficha en la cinta. El top de una ficha
		*  no asignada siempre es el mismo, y se toma como referencia window.innerHeight porque la transicíon se llevará
		*  a cabo sobre la ficha auxiliar dentro del overlay (que ocupa toda la pantalla) */
		const unassignedCardRelativeTop = (Constants.VALUE.UNASSIGNED_BAR_HEIGHT - Constants.VALUE.LINE_HEIGHT_DEFAULT) / 2;
		this.unassignedCardTop = window.innerHeight - unassignedCardRelativeTop - Constants.VALUE.LINE_HEIGHT_DEFAULT;

		this.scrollLeft = 0;
		this.scrollTop = 0;
		this.barScrollLeft = 0;

		this.dragging = false;
	}

	// endregion

	// region Emitters

	static setHelperGroup(cardsGroup: CardsGroup) {
		this.helperGroup = cardsGroup;
		NotificationService.notifyHelperGroup(this.helperGroup);
	}

	static setDragging(dragging: boolean) {
		this.dragging = dragging;
		NotificationService.notifyDragging(this.dragging);
	}

	// endregion

	// region Update dimensions

	static updateDimensions(
		unassignedSections: UnassignedSection[] = CardsService.unassignedSections,
		daysGroups: DaysAssignedGroups = CardsService.assignedDaysCardsGroups
	) {
		this.updateUnassignedDimensions(unassignedSections);
		this.updateAssignedDimensions(daysGroups);
	}

	private static updateUnassignedDimensions(unassignedSections: UnassignedSection[]): void {
		for (const section of unassignedSections) {
			const groups = section.findGroups();
			groups.forEach((group: CardsGroup, i: number) => {
				group.cards.forEach((card) => {
					card.width = DimensionsService.calcWidthFromDuration(card.duration);
				});
				group.left = DimensionsService.calcUnassignedGroupLeft(groups, i);
			});
		}
	}

	static updateUnassignedGroupsLeft(groups: CardsGroup[]): void {
		groups.forEach((group: CardsGroup, i: number) => {
			group.left = i == 0
				? Constants.VALUE.UNASSIGNED_MARGIN_BETWEEN_GROUPS
				: DimensionsService.calcUnassignedGroupLeft(groups, i);
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
		coordinates: Coordinates,
		startPosition: Coordinates,
		helperGroup: CardsGroup = this.helperGroup
	): Coordinates {
		if (this.destinyDropzone) {
			/* Se valida si el grupo encaja en la posición de destino (podría no caber en el horario, por ejemplo) */
			const validatedCoordinates = this.destinyDropzone.validateCoordinates(coordinates);

			/* Se elimina el grupo del dropzone de origen. En el siguiente paso, en función de si el movimiento había
			*  validado o no, se añadirá al de destino o volverá de nuevo al de origen */
			this.originDropzone.removeGroup(helperGroup, validatedCoordinates != undefined, this.destinyDropzone);

			let groupsToUpdate = undefined;
			if (validatedCoordinates) {
				const clonedGroup = this.cloneGroupLeft(helperGroup, validatedCoordinates.x);
				groupsToUpdate = this.destinyDropzone.findGroupsToUpdate(clonedGroup, validatedCoordinates.line);
			}

			/* Si el movimiento es válido */
			if (groupsToUpdate != undefined) {
				const lastCoordinates = this.destinyDropzone.findLastCoordinates(groupsToUpdate, helperGroup, coordinates);
				/* Se añade el grupo al dropzone de destino */
				this.destinyDropzone.addGroup(groupsToUpdate, helperGroup, this.originDropzone, lastCoordinates.line);
				return lastCoordinates;
			} else {
				this.originDropzone.handleNotValidatedMovement(helperGroup);
			}
		} else {
			this.originDropzone.removeGroup(helperGroup, false, this.destinyDropzone);
			this.originDropzone.handleNotValidatedMovement(helperGroup);
		}
		return startPosition;
	}

	static cloneGroupLeft(group: CardsGroup, x: number): CardsGroup {
		/* En este punto, modificar las propiedades reales del grupo puede ser problemático, ya que no se han completado
        *  todas las validaciones; todavía faltan aquellas relativas a los grupos solapados. Por lo tanto, se clona para
        *  poder modificarlo sin hacerlo en el objeto original */
		const clonedGroup = this.helperGroup.clone();
		/* Se actualiza la propiedad left para que se tenga en cuenta a la hora de identificar las fichas
        *  solapadas */
		this.updateLeft(clonedGroup, x);
		return clonedGroup;
	}

	static handleUnassignedPosition(
		group: CardsGroup,
		groups: CardsGroup[]
	): Coordinates {
		const allGroups = CardPositionService.sortUnassignedGroups(groups.concat(group));
		this.updateUnassignedGroupsLeft(allGroups);
		return new Coordinates(group.left, this.unassignedCardTop);
	}

	static sortUnassignedGroups(groups: CardsGroup[]): CardsGroup[] {
		/* Los grupos sin asignar se orden en función del orderCode, y dentro de una misma orden, del
		*  divisionIndex */
		groups.sort((a: CardsGroup, b: CardsGroup) => {
			if (a.cards[0].order.code < b.cards[0].order.code) {
				return -1;
			} else if (a.cards[0].order.code > b.cards[0].order.code) {
				return 1;
			} else {
				if (a.cards[0].group.color.order < b.cards[0].group.color.order) {
					return -1;
				} else if (a.cards[0].group.color.order > b.cards[0].group.color.order) {
					return 1;
				} else {
					if (a.cards[0].divisionIndex < b.cards[0].divisionIndex) {
						return -1;
					} else if (a.cards[0].divisionIndex > b.cards[0].divisionIndex) {
						return 1;
					} else {
						return 0;
					}
				}
			}
		});
		return groups;
	}

	static validateCoordinates(
		coordinates: Coordinates,
		dayMechanicCardsGroups: CardsGroup[],
		dropzone: Dropzone = this.destinyDropzone,
		helperGroup: CardsGroup = this.helperGroup
	): Coordinates {
		/* Se comprueba si los laterales del grupo están fuera de la dropzone. Si lo están, se actualiza la posición
		 * para ajustar a los límites */
		coordinates = this.fixGroupOutsideDropzonePosition(coordinates, helperGroup);
		/* Si la ficha no cabe en el horario, se devuelve undefined para retornar a la posición original*/
		if (!coordinates) {
			return undefined;
		}

		/* La posición se redondea a los múltiplos de 5 minutos */
		coordinates = this.roundLastPosition(coordinates, dropzone.position, dropzone.mechanic.lines);
		if (!coordinates) {
			return undefined;
		}

		/* Se comprueba si, una vez arreglada y redondeada la posición, el intervalo que ocupa el grupo sigue saliéndose
		*  del horario. Si es así, se retorna undefined para volver a la posición original */
		const positionOutsideDropzone = this.checkPositionOutsideDropzone(coordinates, helperGroup);
		if (positionOutsideDropzone) {
			return undefined;
		}

		return coordinates;
	}

	static findGroupsToUpdate(
		clonedGroup: CardsGroup,
		dayMechanicCardsGroups: CardsGroup[],
		line: number,
		destinyDropzone: Dropzone
	): CardsGroup[] {
		/* Se gestionan los movimientos de fichas solapadas. La lista que se retorna contiene tanto los grupos
		 * solapados, como el grupo original; es decir, todos los que se deben actualizar tras completar el movimiento */
		const groupsToUpdate = this.handleOverlappedMovements(dayMechanicCardsGroups, clonedGroup, line);

		/* Se comprueba si alguno de los grupos solapados se sale del horario */
		const groupsOutsideDropzone = this.checkGroupsOutsideDropzone(groupsToUpdate, destinyDropzone);
		/* Si es así, se retorna undefined para voler a la posición original */
		if (groupsOutsideDropzone) {
			return undefined;
		}

		return groupsToUpdate;
	}

	static updateAssignedGroupsPosition(
		coordinates: Coordinates,
		clonedGroups: CardsGroup[],
		helperGroup: CardsGroup = this.helperGroup
	): Coordinates {
		const helperClonedGroup = clonedGroups.find(group => group.id == helperGroup.id);

		coordinates.x = this.leftToAbsolutePosition(helperClonedGroup.left);
		return coordinates;
	}

	private static checkGroupsOutsideDropzone(
		groups: CardsGroup[],
		dropzone: Dropzone = this.destinyDropzone
	): boolean {
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(UtilsService.roundToDecimal(dropzone.position.left, 2));
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.position.right);

		return groups.find(group => {
			const duration = DimensionsService.calcWidthFromDuration(group.findDuration());
			return this.checkOutsideLeft(group.left, dropzoneLeft) ||
				this.checkOutsideRight(group.left + duration, dropzoneRight)
		}) != undefined;
	}

	private static fixGroupOutsideDropzonePosition(
		coordinates: Coordinates,
		cardsGroup: CardsGroup,
		dropzone: Dropzone = this.destinyDropzone
	): Coordinates {
		const leftX = this.absolutePositionToLeft(coordinates.x);
		const durationWidth = DimensionsService.calcWidthFromDuration(cardsGroup.findDuration());
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(dropzone.position.left);
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.position.right);

		let outsideLeft = this.checkOutsideLeft(leftX, dropzoneLeft);
		if (outsideLeft) {
			coordinates.x = this.leftToAbsolutePosition(dropzoneLeft + this.GROUP_ROUND_POSITION_OFFSET);
		}
		let outsideRight = this.checkOutsideRight(leftX + durationWidth, dropzoneRight);
		if (outsideRight) {
			coordinates.x = this.leftToAbsolutePosition(dropzoneRight - durationWidth + this.GROUP_ROUND_POSITION_OFFSET);
		}

		return outsideLeft && outsideRight ? undefined : coordinates;
	}

	private static checkPositionOutsideDropzone(
		coordinates: Coordinates,
		cardsGroup: CardsGroup,
		dropzone: Dropzone = this.destinyDropzone
	): boolean {
		const leftX = this.absolutePositionToLeft(coordinates.x);
		const duration = DimensionsService.calcWidthFromDuration(cardsGroup.findDuration());
		const dropzoneLeft = this.dropzoneAbsolutePositionToLeft(UtilsService.roundToDecimal(dropzone.position.left, 2));
		const dropzoneRight = this.dropzoneAbsolutePositionToLeft(dropzone.position.right);

		return this.checkOutsideLeft(leftX, dropzoneLeft)
			|| this.checkOutsideRight(leftX + duration, dropzoneRight);
	}

	private static checkOutsideLeft(leftX: number, dropzoneLeft: number): boolean {
		/* Si la coordenada x está fuera de la dropzone, se le asigna el valor izquierdo de la misma, más una cifra.
		*  Esta cifra permite que a la hora de redondear en el método roundLastPosition, la ficha quede dentro de la
		*  dropzone, en lugar de justo a la izquierda */
		return dropzoneLeft - leftX > 2;
	}

	private static checkOutsideRight(rightX: number, dropzoneRight: number): boolean {
		return rightX - dropzoneRight > 2;
	}

	private static roundLastPosition(
		coordinates: Coordinates,
		dropzonePosition: Position,
		mechanicLines: number,
		intervalWidth: number = DimensionsService.intervalWidth
	): Coordinates {
		const leftIntervals = Math.floor(this.absolutePositionToLeft(coordinates.x) / intervalWidth);
		const x = this.leftToAbsolutePosition(leftIntervals * intervalWidth);

		let line = Math.round(
			(this.absolutePositionToTop(coordinates.y) - dropzonePosition.top) / DimensionsService.lineHeight
		);
		/* Si más de la mitad de la ficha se coloca por encima de la primera línea de mecánico, el resultado será -1.
		*  En este caso, se coloca en la línea 0, que es la más próxima */
		line = line < 0 ? 0 : line;
		/* Si más de la mitad de la ficha se coloca debajo de la última línea de mecánico, la línea resultante será
		*  superior a lo permitido. Por tanto, en ese caso, no se valida la posición*/
		if (line >= mechanicLines) {
			return undefined;
		}
		const y = this.dropzoneTopToAbsolutePosition(dropzonePosition.top) + line * DimensionsService.lineHeight;
		[coordinates.x, coordinates.y, coordinates.line] = [x, y, line];
		return coordinates;
	}

	private static updateLeft(cardsGroup: CardsGroup, x: number): void {
		cardsGroup.left = this.absolutePositionToLeft(x);
	}

	private static handleOverlappedMovements(
		dayMechanicsGroups: CardsGroup[],
		clonedGroup: CardsGroup,
		line: number
	): CardsGroup[] {
		const lineGroups = dayMechanicsGroups.filter(group => group.line == line);
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
		const omittedIds = CardsService.auxiliaryGroupToReplace
			? [clonedGroup.id, CardsService.auxiliaryGroupToReplace.id] : [clonedGroup.id];
		/* Para calcular solapamientos, sólo se tienen en cuenta grupos que no hayan sido procesados con anterioridad.
		*  Si, por ejmeplo, en la primera iteración se procesa el grupo 7 y se actualiza su left, no debe tenerse en
		*  cuenta en la siguiente, ya que todas las operaciones que se le tenían que realizar finalizaron en su
		*  iteración */
		lineGroups = lineGroups.filter((group: CardsGroup) =>
			alreadyProcessedGroups.find((g: CardsGroup) => g.id == group.id) == undefined
				&& omittedIds.indexOf(group.id) == -1
		);

		let newCardsMinutes = this.getDurationArray(
			DimensionsService.calcStartFromLeft(clonedGroup.left, dayjs()),
			clonedGroup.cards
		);
		newCardsMinutes = newCardsMinutes.slice(1, newCardsMinutes.length-1);

		return lineGroups.filter(group => {
			const minutesArray = CardPositionService.getDurationArray(group.cards[0].start, group.cards);
			return minutesArray.find(minutes => newCardsMinutes.indexOf(minutes) >= 0);
		});
	}

	private static getDurationArray(start: Dayjs, cards: Card[]) {
		const end: Dayjs = start.add(UtilsService.sum(cards, Constants.PROPERTY.DURATION), Constants.DAY_JS.m);
		return UtilsService.createMinutesArray(
			start.diff(start.startOf(Constants.DAY_JS.d), Constants.DAY_JS.m),
			end.diff(end.startOf(Constants.DAY_JS.d), Constants.DAY_JS.m),
		);
	}

	private static calcLeft(cardsGroups: CardsGroup[]) {
		cardsGroups.forEach((cardsGroup, index) => {
			const width = CardPositionService.findCardsGroupsWidth(cardsGroups.slice(0, index));
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
	static absolutePositionToLeft(
		value: number,
		scrollLeft: number = this.scrollLeft
	): number {
		return value + scrollLeft - Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	private static dropzoneAbsolutePositionToLeft(
		value: number
	): number {
		return value - Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	private static leftToAbsolutePosition(
		value: number,
		scrollLeft: number = this.scrollLeft
	): number {
		return value - scrollLeft + Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	static absolutePositionToTop(
		value: number,
		scrollTop: number = this.scrollTop
	): number {
		return value + scrollTop;
	}

	private static dropzoneTopToAbsolutePosition(
		top: number,
		scrollTop: number = this.scrollTop
	) {
		return top - scrollTop;
	}

	static barLeftToAbsolutePosition(left: number, barScrollLeft: number = this.barScrollLeft): number {
		return left - barScrollLeft;
	}

	// endregion

	static getAddGroupDelay(group: CardsGroup): number {
		return group.mode == Constants.GROUP_MODE.DRAG
			? Constants.VALUE.CARD_MOVEMENT_DURATION - Constants.VALUE.CARD_MOVEMENT_DURATION_OFFSET : 0;
	}

}
