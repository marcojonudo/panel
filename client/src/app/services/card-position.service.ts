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
import {OverlappedGroupsInfo} from "../objects/groups-translation/overlapped-groups-info";
import {ValidateCoordinatesInfo} from "../objects/groups-translation/validate-coordinates-info";

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
		coordinates: Coordinates, startPosition: Coordinates, helperGroup: CardsGroup = this.helperGroup
	): Coordinates {
		if (this.destinyDropzone) {
			/* Se valida si el grupo encaja en la posición de destino (podría no caber en el horario, por ejemplo) */
			const validatedInfo = this.destinyDropzone.validate(coordinates, helperGroup);
			if (validatedInfo != undefined) {
				this.originDropzone.removeGroup(helperGroup);
				const allGroups = [helperGroup].concat(validatedInfo.groups);
				this.destinyDropzone.updateProperties(
					allGroups, validatedInfo.newStart, coordinates.line, this.destinyDropzone.mechanic
				);
				this.destinyDropzone.addGroup(allGroups, helperGroup);
				return this.destinyDropzone.findLastCoordinates(helperGroup, coordinates);
			} else {
				this.originDropzone.handleNotValidatedMovement(helperGroup);
			}
		} else {
			this.originDropzone.handleNotValidatedMovement(helperGroup);
		}
		return startPosition;
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
		dropzone: Dropzone,
		dayMechanicGroups: CardsGroup[],
		helperGroup: CardsGroup
	): ValidateCoordinatesInfo {
		/* La posición se redondea a los múltiplos de 5 minutos */
		coordinates = this.roundLastPosition(coordinates, dropzone.position, dropzone.mechanic.lines);
		let newStart = DimensionsService.calcStartFromLeft(
			this.absolutePositionToLeft(coordinates.x), dropzone.mechanic.day
		)
		const lineGroups = dayMechanicGroups.filter((g: CardsGroup) =>
			g.id != helperGroup.id && g.line == coordinates.line
		);
		/* El grupo puede soltarse encima de la parte de atrás de otro. En ese caso, debería desplazarse automáticamente
		*  hacia la derecha, en lugar de tener en cuenta al segundo como grupo solapado */
		const overlappedDroppedGroup = lineGroups.find((g: CardsGroup) =>
			g.start <= newStart && g.end >= newStart
		);
		if (overlappedDroppedGroup) {
			newStart = newStart.add(
				overlappedDroppedGroup.end.diff(newStart, Constants.DAY_JS.m),
				Constants.DAY_JS.m
			);
			coordinates.x = this.leftToAbsolutePosition(DimensionsService.calcLeftFromStart(newStart));
		}
		const newEnd = newStart.add(helperGroup.findDuration(), Constants.DAY_JS.m);
		return new ValidateCoordinatesInfo(coordinates.line, newStart, newEnd);

		// /* Para validar si la posición es correcta, se deben tener en cuenta los grupos solapados. Estos grupos sólo
		// *  pueden ser aquellos que no sean el que se está moviendo (si este parte desde la derecha), y los que estén
		// *  en la misma línea más tarde que el nuevo start */
		// const lineRightGroups = dayMechanicGroups.filter((g: CardsGroup) =>
		// 	g.id != helperGroup.id && g.line == coordinates.line && g.end.isAfter(newStart)
		// );
		// const overlappedGroupsInfo = this.handleOverlappedMovements(newEnd, lineRightGroups).setNewStart(newStart);
		// return newStart >= dropzone.interval.start && overlappedGroupsInfo.newEnd <= dropzone.interval.end ?
		// 	overlappedGroupsInfo : undefined;
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
		line = line >= mechanicLines ? mechanicLines - 1 : line;
		const y = this.dropzoneTopToAbsolutePosition(dropzonePosition.top) + line * DimensionsService.lineHeight;
		[coordinates.x, coordinates.y, coordinates.line] = [x, y, line];
		return coordinates;
	}

	static handleOverlappedMovements(
		newEnd: Dayjs, rightLineGroups: CardsGroup[], alreadyOverlappedGroups: CardsGroup[] = []
	): OverlappedGroupsInfo {
		/* Se obtienen los grupos solapados. Se clonan para evitar que se actualice el left de los grupos originales,
		 * ya que si al final se determina que la ficha no se puede mover, ya se habría actualizado este valor */
		const overlappedGroups = this.findOverlappedGroups(newEnd, rightLineGroups);
		const allOverlappedGroups = alreadyOverlappedGroups.concat(overlappedGroups);
		/* Se hacen los cálculos sólo si se encuentran fichas solapadas */
		if (overlappedGroups.length) {
			const overlappedGroupsDuration = overlappedGroups.map((g: CardsGroup) => g.findDuration())
				.reduce((a, b) => a + b, 0);
			rightLineGroups = rightLineGroups.filter((g: CardsGroup) => g.start >= newEnd);
			newEnd = newEnd.add(overlappedGroupsDuration, Constants.DAY_JS.m);
			return this.handleOverlappedMovements(newEnd, rightLineGroups, allOverlappedGroups)
		}
		return new OverlappedGroupsInfo(allOverlappedGroups, newEnd);
	}

	private static findOverlappedGroups(newEnd: Dayjs, rightLineGroups: CardsGroup[]): CardsGroup[] {
		return rightLineGroups.filter((group: CardsGroup) => group.start.isBefore(newEnd));
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

	private static dropzoneAbsolutePositionToLeft(value: number): number {
		return value - Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	private static leftToAbsolutePosition(value: number, scrollLeft: number = this.scrollLeft): number {
		return value - scrollLeft + Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	static absolutePositionToTop(value: number, scrollTop: number = this.scrollTop): number {
		return value + scrollTop;
	}

	private static dropzoneTopToAbsolutePosition(top: number, scrollTop: number = this.scrollTop): number {
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
