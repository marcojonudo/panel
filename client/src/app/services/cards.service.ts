import {Injectable} from '@angular/core';
import {Card} from "../objects/card";

import {CardsGroup} from "../objects/cards-group";
import {HttpClient} from "@angular/common/http";
import {Constants} from "../objects/constants";
import {UtilsService} from "./utils.service";
import {GroupedTypeCards} from "../objects/grouped-type-cards";
import {UnassignedTypeSection} from "../objects/unassigned-sections/unassigned-type-section";
import {UnassignedFinishedSection} from "../objects/unassigned-sections/unassigned-finished-section";
import {UnassignedSection} from "../objects/unassigned-sections/unassigned-section";
import {DaysMechanics} from "../objects/days-mechanics";
import {Mechanic} from "../objects/mechanic";
import {NotificationService} from "./notification.service";
import {DaysAssignedGroups} from "../objects/days-assigned-groups";
import {DimensionsService} from "./dimensions.service";
import {Url} from "../objects/url";
import {MechanicsService} from "./mechanics.service";
import {ScheduleInterval} from "../objects/schedule-interval";
import {HourQuarters} from "../objects/hour-quarters";
import {QuartersSaturation} from "../objects/quarters-saturation";
import {QuarterSaturation} from "../objects/quarters-saturation/quarter-saturation";
import {UnassignedAuxiliarySection} from "../objects/unassigned-sections/unassigned-temporal-section";
import {AuxiliaryCardBehaviour} from "../objects/card-type-behaviour/auxiliary-card-behaviour";
import {DefaultCardBehaviour} from "../objects/card-type-behaviour/default-card-behaviour";
import {CardTypeBehaviour} from "../objects/card-type-behaviour/card-type-behaviour";
import {CutCardModeAction} from "../objects/card-mode-action/cut-card-mode-action";
import {CardModeAction} from "../objects/card-mode-action/card-mode-action";
import {CardLinkHandler} from "../objects/card-links/card-link-handler";
import {CardPositionService} from "./card-position.service";
import {ReplaceCardModeAction} from "../objects/card-mode-action/replace-card-mode-action";
import {DropzoneService} from "./dropzone.service";
import {Dropzone} from "../objects/dropzone-type/dropzone";
import {WarningToast} from "../objects/toasts/warning-toast";
import {Dayjs} from "dayjs";
import {Observable} from "rxjs/internal/Observable";
import {HourQuarter} from "../objects/hour-quarter";
import {CardDurationHandler} from "../objects/card-duration/card-duration-handler";

@Injectable({
	providedIn: 'root'
})
export class CardsService {

	private static cards: Card[];
	private static unassignedCards: Card[];
	private static assignedCards: Card[];

	private static _assignedDaysCardsGroups: DaysAssignedGroups;
	private static _assignedGroups: CardsGroup[];
	private static _unassignedAuxiliaryCardsGroups: CardsGroup[];
	private static _finishedCardsGroups: CardsGroup[];
	private static _unassignedGroups: CardsGroup[];
	private static _unassignedTypesCardsGroups: GroupedTypeCards;

	private static _unassignedSections: UnassignedSection[];
	private static _cardTypeBehaviour: {[key: string]: CardTypeBehaviour};
	private static _cardModeAction: {[key: string]: any};

	private static _auxiliaryGroupToReplace: CardsGroup;

	constructor(private http: HttpClient) {
		CardsService.unassignedSections = [
			new UnassignedTypeSection(Constants.CARD_TYPE.TODAY),
			new UnassignedTypeSection(Constants.CARD_TYPE.APPOINTMENT),
			new UnassignedTypeSection(Constants.CARD_TYPE.PENDING),
			new UnassignedFinishedSection(Constants.CARD_STATUS.FINISHED),
			new UnassignedAuxiliarySection(Constants.CARD_TYPE.AUXILIARY)
		];
		CardsService.cardTypeBehaviour = {};
		CardsService.cardTypeBehaviour[Constants.CARD_TYPE.AUXILIARY] = new AuxiliaryCardBehaviour();
		CardsService.cardTypeBehaviour[Constants.DEFAULT] = new DefaultCardBehaviour();

		CardsService.cardModeAction = {};
		CardsService.cardModeAction[Constants.GROUP_MODE.CUT] = new CutCardModeAction(this);
		CardsService.cardModeAction[Constants.GROUP_MODE.REPLACE] = new ReplaceCardModeAction(this);
	}

	// region Getters / setters

	static get unassignedGroups(): CardsGroup[] {
		return this._unassignedGroups;
	}

	static set unassignedGroups(value: CardsGroup[]) {
		this._unassignedGroups = value;
	}

	static get unassignedAuxiliaryCardsGroups(): CardsGroup[] {
		return this._unassignedAuxiliaryCardsGroups;
	}

	static set unassignedAuxiliaryCardsGroups(value: CardsGroup[]) {
		this._unassignedAuxiliaryCardsGroups = value;
	}

	static get finishedCardsGroups(): CardsGroup[] {
		return this._finishedCardsGroups;
	}

	static set finishedCardsGroups(value: CardsGroup[]) {
		this._finishedCardsGroups = value;
	}

	static get unassignedTypesCardsGroups(): GroupedTypeCards {
		return this._unassignedTypesCardsGroups;
	}

	static set unassignedTypesCardsGroups(value: GroupedTypeCards) {
		this._unassignedTypesCardsGroups = value;
	}

	static get assignedGroups(): CardsGroup[] {
		return this._assignedGroups;
	}

	static set assignedGroups(value: CardsGroup[]) {
		this._assignedGroups = value;
	}

	static get assignedDaysCardsGroups(): DaysAssignedGroups {
		return this._assignedDaysCardsGroups;
	}

	static set assignedDaysCardsGroups(value: DaysAssignedGroups) {
		this._assignedDaysCardsGroups = value;
	}

	static get unassignedSections(): UnassignedSection[] {
		return this._unassignedSections;
	}

	static set unassignedSections(value: UnassignedSection[]) {
		this._unassignedSections = value;
	}

	static get cardTypeBehaviour(): {[key: string]: CardTypeBehaviour} {
		return this._cardTypeBehaviour;
	}

	static set cardTypeBehaviour(value: {[key: string]: CardTypeBehaviour}) {
		this._cardTypeBehaviour = value;
	}

	static get cardModeAction(): { [p: string]: any } {
		return this._cardModeAction;
	}

	static set cardModeAction(value: { [p: string]: any }) {
		this._cardModeAction = value;
	}

	static get auxiliaryGroupToReplace(): CardsGroup {
		return this._auxiliaryGroupToReplace;
	}

	static set auxiliaryGroupToReplace(value: CardsGroup) {
		this._auxiliaryGroupToReplace = value;
	}

	// endregion

	// region Init

	static init(cards: Card[], daysMechanics: DaysMechanics) {
		this.cards = cards;

		/* Se obtienen las fichas temporales que están sin asignar, que son las fichas base que se mostrarán para crear
		*  fichas temporales */
		const unassignedAuxiliaryCards = this.cards.filter((card: Card) =>
			card.type == Constants.CARD_TYPE.AUXILIARY && !card.day
		);
		const finishedCards = this.cards.filter((card: Card) => card.status == Constants.CARD_STATUS.FINISHED);
		const notFinishedCards = this.cards.filter((card: Card) =>
			card.status != Constants.CARD_STATUS.FINISHED
				&& (card.type != Constants.CARD_TYPE.AUXILIARY || card.type == Constants.CARD_TYPE.AUXILIARY && card.day)
		);

		this.unassignedAuxiliaryCardsGroups = this.initUnassignedCardsGroups(unassignedAuxiliaryCards);
		this.finishedCardsGroups = this.initAssignedCardsGroups(finishedCards);

		this.unassignedCards = notFinishedCards.filter(card => !card.day);
		this.unassignedGroups = this.initUnassignedCardsGroups(this.unassignedCards);
		this.unassignedTypesCardsGroups = this.initUnassignedTypesCardsGroups(this.unassignedGroups);

		this.assignedCards = notFinishedCards.filter(card => card.day);
		this.assignedGroups = this.initAssignedCardsGroups(this.assignedCards);
		this.initAssignedDaysCardsObjects(this.assignedGroups, daysMechanics);

		console.log('Cards', this.cards);
		console.log('Auxiliary cards groups', this.unassignedAuxiliaryCardsGroups);
		console.log('Finished cards groups', this.finishedCardsGroups);
		console.log('Unassigned cards groups', this.unassignedGroups);
		console.log('Unassigned types cards groups', this.unassignedTypesCardsGroups);
		console.log('Assigned cards groups', this.assignedGroups);
		console.log('Assigned days cards groups', this.assignedDaysCardsGroups);
	}

	private static initUnassignedCardsGroups(unassignedCards: Card[]): CardsGroup[] {
		let groups = [];
		let processedCards = [];
		for (let card of unassignedCards) {
			const processed = processedCards.indexOf(card) > -1;
			if (!processed) {
				let linkedCards = this.findAllLinkedCards(unassignedCards, card);
				const group = new CardsGroup(this.sortLinkedCards(linkedCards));
				groups.push(group);
				processedCards = processedCards.concat(linkedCards);
			}
		}
		/* Se ordenan los grupos en función del código de orden y del divisionIndex */
		CardPositionService.sortUnassignedGroups(groups);
		return groups;
	}

	private static initUnassignedTypesCardsGroups(groups: CardsGroup[]): any {
		const unassignedTypesCardsGroups = {};

		groups.forEach((group: CardsGroup) => {
			const type = group.cards[0].type;
			if (!unassignedTypesCardsGroups[type]) {
				unassignedTypesCardsGroups[type] = [];
			}
			unassignedTypesCardsGroups[type].push(group);
		});
		return unassignedTypesCardsGroups;
	}

	private static initAssignedCardsGroups(assignedCards: Card[]) {
		let groups: CardsGroup[] = [];
		let processedCards = [];
		for (let card of assignedCards) {
			const alreadyProcessedCard = processedCards.find((c: Card) => c.panelId == card.panelId);
			if (!alreadyProcessedCard) {
				const linkedCards = this.findAllLinkedCards(assignedCards, card);
				groups.push(new CardsGroup(UtilsService.sort(linkedCards, (c) => c.start)));
				processedCards = processedCards.concat(linkedCards);
			}
		}

		return groups;
	}

	private static findAllLinkedCards(cards: Card[], card: Card): Card[] {
		return this.findPreviousCards(cards, card, [card]).concat(this.findNextCards(cards, card));
	}

	// endregion

	// region Translate card

	static addToFinished(group: CardsGroup): void {
		// this.handleAssignedMovementGroupsLinks(
		// 	day,
		// 	newMechanicCode,
		// 	cardsGroup.line,
		// 	cardsGroup.start,
		// 	cardsGroup.end
		// );
		this.handleAddFinishedCardsGroup(group);
	}

	static removeFromAssigned(cardsGroup: CardsGroup, day: Dayjs, mechanicCode: string): any {
		this.handleAssignedMovementGroupsLinks(
			day,
			mechanicCode,
			cardsGroup.line,
			cardsGroup.start,
			cardsGroup.end
		);
		this.handleRemoveAssignedCardsGroup(day, mechanicCode, cardsGroup);
		this.updateQuartersSaturation(day)
	}

	static addToAssigned(cardsGroup: CardsGroup, day: Dayjs, newMechanicCode: string): void {
		/* Al añadir un grupo a una línea, se comprueba si tiene grupos al lado para activar o desactivar los
		*  iconos de los enlaces */
		this.handleAssignedMovementGroupsLinks(
			day,
			newMechanicCode,
			cardsGroup.line,
			cardsGroup.start,
			cardsGroup.end
		);
		this.handleAddAssignedCardsGroup(day, newMechanicCode, cardsGroup);
		this.updateQuartersSaturation(day)
	}

	static removeFromUnassigned(group: CardsGroup, notify: boolean = true): void {
		this.handleUnassignedMovementGroupsLinks(group.cards[0].order.number, group.type, group.status);
		this.handleRemoveUnassignedCardsGroup(group, notify);
	}

	static addToUnassigned(group: CardsGroup, notify: boolean = true): void {
		this.handleUnassignedMovementGroupsLinks(group.cards[0].order.number, group.type, group.status);
		this.handleAddUnassignedCardsGroup(group, undefined, notify);
	}

	static updateAssignedCards(
		clonedGroups: CardsGroup[],
		helperGroup: CardsGroup,
		day: Dayjs,
		newMechanicCode: string,
		line: number,
		dayMechanicGroups: CardsGroup[]
	) {
		const allOriginalGroups = dayMechanicGroups.concat(helperGroup);

		clonedGroups.forEach((clonedGroup: CardsGroup) => {
			/* Se obtiene el grupo de todos los del día, en lugar de sólo los de la línea, porque la ficha que se está
			*  moviendo puede provenir de otra línea. Además, se añade cardsGroup porque si se mueve desde otra línea de
			*  mecánico, no va a estar en dayMechanicsCardsGroups */
			const group = allOriginalGroups.find((group: CardsGroup) => group.id == clonedGroup.id);
			/* Se actualizan los valores relacionados con la posicion (left y start) */
			CardsService.updatePosition(group, day, newMechanicCode, line, clonedGroup.left);
		});
	}

	createDbCards(cards: Card[]): void {
		this.http.post(Url.cards(), cards).subscribe();
	}

	updateDbCardsPosition(cards: Card[]): void {
		this.http.put(Url.cardsPosition(), cards).subscribe();
	}

	updateDbCardsDuration(cards: Card[]): void {
		this.http.put(Url.cardsDuration(), cards).subscribe();
	}

	updateDbCardsLinks(cards: Card[]): void {
		this.http.put(Url.cardsLinks(), cards).subscribe();
	}

	static updateFinishedGroup(group: CardsGroup) {
		group.status = Constants.CARD_STATUS.FINISHED;
		for (const card of group.cards) {
			card.status = Constants.CARD_STATUS.FINISHED;
			/* Se definen las propiedades last para poder manejar los contadores de citas */
			card.lastDay = card.day;
			card.lastStart = card.start;
			card.lastEnd = card.end;
		}
	}

	static resetCardsGroup(group: CardsGroup) {
		group.left = undefined;

		for (let card of group.cards) {
			this.resetCard(card);
		}
	}

	private static resetCard(card: Card): void {
		card.setDay(undefined);
		card.setMechanicCode(undefined);
		card.setStart(undefined);
		card.line = undefined;
	}

	static updatePosition(group: CardsGroup, day: Dayjs, mechanicCode: string, line: number, left: number) {
		/* Sólo se puede mover un grupo a la vez, ya que es lo que se arrastra cuando se desplazan fichas por el
		*  panel; sin embargo, en caso de haber solapamientos, son varios los que deben ser actualizados. Por ese
		*  motivo se usa un array en lugar de un sólo grupo */
		const status = group.cards[0].type == Constants.CARD_TYPE.AUXILIARY
			? Constants.CARD_STATUS.AUXILIARY : Constants.CARD_STATUS.DEFAULT;
		group.left = left;
		group.status = status;
		group.line = line;

		group.cards.forEach((card: Card, index: number) => {
			card.setDay(day);
			card.setMechanicCode(mechanicCode);
			card.setStatus(status);
			card.setLine(line);
			this.updateOrderCode(card, group, index);

			const leftCardsDuration = UtilsService.sum(group.cards.slice(0, index), Constants.PROPERTY.DURATION);
			card.setStart(
				DimensionsService.calcStartFromLeft(
					group.left + DimensionsService.calcWidthFromDuration(leftCardsDuration),
					day
				)
			);
		});

		group.id = group.cards[0].panelId;
		group.day = group.cards[0].day;
		group.mechanicCode = group.cards[0].mechanicCode;
		group.start = group.cards[0].start;
		group.end = group.cards[group.cards.length - 1].end;
	}

	private static updateOrderCode(card: Card, group: CardsGroup, index: number): void {
		if (card.type == Constants.CARD_TYPE.AUXILIARY) {
			if (card.order.code == Constants.AUXILIARY_DEFAULT_ORDER_CODE) {
				const assignedAuxiliaryGroups = this.assignedGroups.filter((group: CardsGroup) =>
					group.cards[0].type == Constants.CARD_TYPE.AUXILIARY
				);
				const currentIndex = assignedAuxiliaryGroups.length
					? +assignedAuxiliaryGroups[assignedAuxiliaryGroups.length - 1].cards[0].order.code.substring(1) : 0;
				card.order.code = `${card.order.code.substring(0, 1)}${currentIndex+1}`;
				card.order.number = currentIndex + 1;
				card.panelId = CardsService.buildPanelId(card);

				/* Si el índice es 0 (primera ficha del grupo), se actualiza tambíen su id para reflejar el cambio de
				*  numeración */
				if (index == 0) {
					group.id = card.panelId;
				}
			}
		}
	}

	public static buildPanelId(card: Card): string {
		return `${card.order.code}-${card.group.code}-${card.divisionIndex}`;
	}

	static handleAddFinishedCardsGroup(group: CardsGroup): void {
		this.addFinishedCardsGroup(group);
		// NotificationService.notifyBand();
	}

	static handleAddAssignedCardsGroup(
		day: Dayjs,
		mechanicCode: string,
		group: CardsGroup,
		notifyImmediately: boolean = false
	): void {
		this.addAssignedCardsGroup(day, mechanicCode, group);
		NotificationService.notifyMechanicLine(day, mechanicCode, false);

		const orderNumber = group.cards[0].order.number;
		/* Se tienen que notificar las fichas de la orden para las flechas blancas, y las divididas para las
		*  flechas negras. Todas forman parte de la orden, por lo que se notifican en un solo paso */
		const assignedOrderGroups = this.findOrderGroups(CardsService.assignedGroups, orderNumber);
		const unassignedOrderGroups = this.findOrderGroups(CardsService.unassignedGroups, orderNumber);

		/* Sólo se notifican otros grupos si la orden tienen más de uno; en caso contrario, ni siquiera aparecen las
		*  flechas, por lo que no es necesario */
		if (assignedOrderGroups.length > 1) {
			NotificationService.notifyGroups(assignedOrderGroups, notifyImmediately);
		}
		/* En caso de haber una sóla ficha no asignada, se notifica para que desaparezca el link handler */
		if (unassignedOrderGroups.length > 0) {
			NotificationService.notifyBand(undefined, unassignedOrderGroups)
		}
	}

	static findDividedGroups(cards: Card[]): CardsGroup[] {
		const dividedCards = [];
		cards.forEach((c: Card) => {
			if (c.dividedPrevious) {
				dividedCards.push(c.dividedPrevious);
			}
			if (c.dividedNext) {
				dividedCards.push(c.dividedNext);
			}
		});
		if (!dividedCards.length) {
			return dividedCards;
		}

		const orderGroups = CardsService.findOrderGroups(CardsService.assignedGroups, cards[0].order.number);
		const dividedOrderGroups = [];
		orderGroups.forEach((g: CardsGroup) => {
			const dividedCard = g.cards.find((card: Card) =>
				dividedCards.find((c: Card) => c.panelId == card.panelId) != undefined
			);
			if (dividedCard) {
				dividedOrderGroups.push(g);
			}
		});
		return dividedOrderGroups;
	}

	static handleRemoveAssignedCardsGroup(
		day: Dayjs,
		mechanicCode: string,
		group: CardsGroup,
		notifyImmediately: boolean = false
	): void {
		this.removeAssignedCardsGroup(day, mechanicCode, group);
		NotificationService.notifyMechanicLine(day, mechanicCode, notifyImmediately);
	}

	static handleAddUnassignedCardsGroup(group: CardsGroup, index: number = undefined, notify: boolean = true): void {
		this.addUnassignedCardsGroup(group, index);
		if (notify) {
			NotificationService.notifyBand(undefined, [group]);
		}
	}

	static handleRemoveUnassignedCardsGroup(group: CardsGroup, notify: boolean = true): void {
		this.removeUnassignedCardsGroup(group);
		if (notify) {
			NotificationService.notifyBand(undefined, [group]);
		}
	}

	// endregion

	// region Duration

	static handleCardDurationUpdate(
		card: Card,
		widthIncrease: number,
		mechanic: Mechanic,
		handler: CardDurationHandler
	): Card[] {
		const durationIncrease = DimensionsService.calcDurationFromWidth(widthIncrease);
		const groups = handler.findGroups(card);
		const group = this.findCardGroup(groups, card.panelId);

		/* Si la ficha se está reduciendo, no es necesario hacer comprobaciones relativas a los límites del horario
		*  u otros grupos desplazados, ya que no los afectaría */
		if (widthIncrease < 0) {
			/* Se actualiza la duración sólo si la ficha supera el valor mínimo */
			if (card.duration > Constants.VALUE.CARD_MIN_DURATION) {
				return handler.updateDuration(card, group, durationIncrease, widthIncrease, []);
			}
			return []
		}

		/* Si se está aumentando el tamaño de una ficha, se debe comprobar si este sobresale del horario en el que
		*  está asignada */
		const updatedGroups = handler.validateDurationUpdate(group, card, mechanic);
		if (updatedGroups == undefined) {
			return [];
		}

		return handler.updateDuration(card, group, durationIncrease, widthIncrease, updatedGroups);
	}

	// endregion

	// region Link handlers

	static checkShowHandler(card: Card, nextGroup: CardsGroup): boolean {
		/* Si no hay ningún grupo justo a la izquierda de la ficha, no se muestra el icono para unir*/
		if (!nextGroup) {
			return false;
		}

		/* Se muestra el icono sólo si el grupo a la izquierda es de la misma orden */
		return nextGroup.cards[0].order.number == card.order.number;
	}

	// endregion

	// region Global cards map

	private static initAssignedDaysCardsObjects(assignedCardsGroups: CardsGroup[], daysMechanics: DaysMechanics): any {
		this.assignedDaysCardsGroups = {};

		for (let dayTime in daysMechanics) {
			this.assignedDaysCardsGroups[dayTime] = {};

			for (let mechanic of daysMechanics[dayTime]) {
				const assignedDayCardsGroups = assignedCardsGroups.filter(cardsGroup => {
					return cardsGroup.cards[0].day.valueOf() == +dayTime && cardsGroup.cards[0].mechanicCode == mechanic.code
				});
				this.assignedDaysCardsGroups[dayTime][mechanic.code] = UtilsService.sort(
					assignedDayCardsGroups,
					(g) => g.start
				);
			}
		}
	}

	// endregion

	// region Link handlers checks

	private static handleAssignedMovementGroupsLinks(
		day: Dayjs,
		mechanicCode: string,
		line: number,
		start: Dayjs,
		end: Dayjs
	): void {
		const groups = this.findLineGroups(day, mechanicCode, line);
		const leftGroup = this.findLeftAssignedGroup(groups, start);
		const rightGroup = this.findRightAssignedGroup(groups, end);

		if (leftGroup) {
			leftGroup.cards[leftGroup.cards.length - 1].possibleLinkedNext =
				!leftGroup.cards[leftGroup.cards.length - 1].possibleLinkedNext;
		}
		if (rightGroup) {
			rightGroup.cards[0].possibleLinkedPrevious = !rightGroup.cards[0].possibleLinkedPrevious;
		}
	}

	private static handleUnassignedMovementGroupsLinks(orderNumber: number, type: string, status: string): void {
		const groups = this.findUnassignedGroups(type, status);
		const orderGroups = this.findOrderGroups(groups, orderNumber);
		orderGroups.forEach(group => {
			group.cards.forEach(card => {
				card.possibleLinkedPrevious = !card.possibleLinkedPrevious;
				card.possibleLinkedNext = !card.possibleLinkedNext;
			});
		});
	}

	// endregion

	private static addFinishedCardsGroup(group: CardsGroup): void {
		this.finishedCardsGroups.push(group);
		CardPositionService.sortUnassignedGroups(this.finishedCardsGroups);
		CardPositionService.updateUnassignedGroupsLeft(this.finishedCardsGroups);
	}

	private static removeFinishedCardsGroup(group: CardsGroup): void {
		const index = this.finishedCardsGroups.findIndex(g => g.id == group.id);
		this.finishedCardsGroups.splice(index, 1);
	}

	private static addAssignedCardsGroup(day: Dayjs, mechanicCode: string, group: CardsGroup): void {
		/* Se busca el grupo cuya comienzo sea superior al del grupo a añadir, para hacer en la posición anterior y que
		*  la lista quede ordenada */
		const mechanicGroupStartIndex = this.findDayMechanicGroups(day, mechanicCode).findIndex((g: CardsGroup) =>
			g.start.isAfter(group.start)
		);
		if (mechanicGroupStartIndex != -1) {
			this.assignedDaysCardsGroups[day.valueOf()][mechanicCode].splice(
				mechanicGroupStartIndex,
				0,
				group
			);
		} else {
			this.assignedDaysCardsGroups[day.valueOf()][mechanicCode].push(group);
		}

		const groupStartIndex = this.assignedGroups.findIndex((g: CardsGroup) => g.start.isAfter(group.start));
		if (groupStartIndex != -1) {
			this.assignedGroups.splice(groupStartIndex, 0, group);
		} else {
			this.assignedGroups.push(group);
		}
	}

	private static removeAssignedCardsGroup(day: Dayjs, mechanicCode: string, group: CardsGroup): void {
		const index = this.assignedDaysCardsGroups[day.valueOf()][mechanicCode].findIndex((g: CardsGroup) =>
			g.id == group.id
		);
		const allGroupsIndex = this.assignedGroups.findIndex((g: CardsGroup) => g.id == group.id);
		this.assignedDaysCardsGroups[day.valueOf()][mechanicCode].splice(index, 1);
		this.assignedGroups.splice(allGroupsIndex, 1);
	}

	private static addUnassignedCardsGroup(group: CardsGroup, index: number): void {
		const groups = this.findUnassignedGroups(group.type, group.status);
		if (index) {
			groups.splice(index, 0, group);
		} else {
			groups.push(group);
			CardPositionService.sortUnassignedGroups(groups);
		}
		this.unassignedGroups.push(group);
		CardPositionService.sortUnassignedGroups(groups);
		CardPositionService.updateUnassignedGroupsLeft(groups);
	}

	private static removeUnassignedCardsGroup(group: CardsGroup): void {
		const groups = this.findUnassignedGroups(group.type, group.status);
		const index = groups.findIndex(g => g.id == group.id);
		groups.splice(index, 1);
		this.unassignedGroups = this.unassignedGroups.filter((g: CardsGroup) => g.id != group.id);

		/* Además de actualizar los elementos de los grupos, se actualiza su posición */
		CardPositionService.updateUnassignedGroupsLeft(groups);
	}

	// region Finders

	static findCard(id: string, groups: CardsGroup[] = CardsService.assignedGroups): Card {
		let card = undefined;
		groups.find((g: CardsGroup) => {
			card = g.cards.find((c: Card) => c.panelId == id)
			return card != undefined;
		});
		return card;
	}

	static findDayGroups(day: Dayjs): CardsGroup[] {
		return [].concat(...Object.values(this.assignedDaysCardsGroups[day.valueOf()]));
	}

	static findDayMechanicGroups(day: Dayjs, mechanicCode: string): CardsGroup[] {
		return this.assignedDaysCardsGroups[day.valueOf()][mechanicCode];
	}

	static findLineGroups(day: Dayjs, mechanicCode: string, line: number): CardsGroup[] {
		return this.findDayMechanicGroups(day, mechanicCode).filter(group => group.line == line);
	}

	private static findLeftAssignedGroup(groups: CardsGroup[], start: Dayjs): CardsGroup {
		return groups.find((group: CardsGroup) => group.end.isSame(start));
	}

	private static findRightAssignedGroup(groups: CardsGroup[], end: Dayjs): CardsGroup {
		return groups.find((group: CardsGroup) => group.start.isSame(end));
	}

	static findOrderGroups(groups: CardsGroup[], orderNumber: number): CardsGroup[] {
		return groups.filter(group => group.cards[0].order.number == orderNumber);
	}

	private static sortLinkedCards(cards: Card[]): Card[] {
		cards.sort((a, b) => {
			if (!a.linkedPrevious || !b.linkedNext) {
				return -1
			} else if (!a.linkedNext || !b.linkedPrevious) {
				return 1
			}
			return 0;
		});
		return cards;
	}

	static findOrderCards(
		orderNumber: number,
		assignedGroups: CardsGroup[] = this.assignedGroups,
		unassignedGroups: CardsGroup[] = this.unassignedGroups
	): Card[] {
		const assignedCards = [].concat(
			...this.findOrderGroups(assignedGroups, orderNumber).map((g: CardsGroup) => g.cards)
		);
		const unassignedCards = [].concat(
			...this.findOrderGroups(unassignedGroups, orderNumber).map((g: CardsGroup) => g.cards)
		);
		return assignedCards.concat(unassignedCards);
	}

	static findUnassignedGroups(type: string, status: string): CardsGroup[] {
		let section = this.unassignedSections.find(section => section.name == status);
		section = section ? section : this.unassignedSections.find(section => section.name == type);
		return section.findGroups();
	}

	static findCardGroup(groups: CardsGroup[], cardPanelId: string): CardsGroup {
		return groups.find(group => group.cards.find(card => card.panelId == cardPanelId) != undefined);
	}

	private static findPreviousCards(cards: Card[], card: Card, linkedCards: Card[] = []) {
		if (card.linkedPrevious) {
			const previousCard = cards.find((c: Card) => c.panelId == card.linkedPrevious.panelId);
			linkedCards.push(previousCard);
			this.findPreviousCards(cards, previousCard, linkedCards);
		}
		return linkedCards;
	}

	private static findNextCards(cards: Card[], card: Card, linkedCards: Card[] = []) {
		if (card.linkedNext) {
			const nextCard = cards.find((c: Card) => c.panelId == card.linkedNext.panelId);
			linkedCards.push(nextCard);
			this.findNextCards(cards, nextCard, linkedCards);
		}
		return linkedCards;
	}

	// endregion

	// region Quarter saturation

	static updateQuartersSaturation(day: Dayjs, lastDay: Dayjs = undefined): void {
		const saturatedQuarters = this.buildDaySaturation(day);
		if (lastDay && !day.isSame(lastDay)) {
			const lastDaySaturatedQuarters = this.buildDaySaturation(lastDay);
			NotificationService.notifySaturatedQuarters(lastDay, lastDaySaturatedQuarters);
		}
		NotificationService.notifySaturatedQuarters(day, saturatedQuarters);
	}

	static buildDaySaturation(day: Dayjs): HourQuarter[] {
		const dayMechanics = MechanicsService.findDayMechanics(day).filter((mechanic: Mechanic) => !mechanic.fixed);
		const dayGroups = this.findDayGroups(day).filter((group: CardsGroup) =>
			group.cards[0].type == Constants.CARD_TYPE.APPOINTMENT &&
			dayMechanics.find((mechanic: Mechanic) => group.cards[0].mechanicCode == mechanic.code) != undefined
		);
		const quartersSaturation = this.buildQuartersSaturation(dayGroups, dayMechanics);
		return this.buildSaturatedQuarters(quartersSaturation);
	}

	static buildQuartersSaturation(dayGroups: CardsGroup[], dayMechanics: Mechanic[]): any {
		const quartersSaturation = {};
		const processedGroupsIds = [];
		dayGroups.forEach((group: CardsGroup) => {
			if (!processedGroupsIds.includes(group.id)) {
				const lineGroups = dayGroups.filter((g: CardsGroup) =>
					g.cards[0].mechanicCode == group.cards[0].mechanicCode && g.line == group.line
				);
				const nextPositionGroups = this.findNextPositionGroups(lineGroups, group);
				const startMinutes = this.roundLowerQuarter(nextPositionGroups[0].start);
				const endMinutes = this.roundUpperQuarter(nextPositionGroups[nextPositionGroups.length-1].end);

				for (let quarter = startMinutes; quarter < endMinutes; quarter = quarter + Constants.QUARTERS.STEP_15) {
					if (!quartersSaturation[quarter]) {
						const mechanics = CardsService.findQuarterMechanics(dayMechanics, quarter);
						quartersSaturation[quarter] = new QuarterSaturation(0, mechanics.length);
					}
					quartersSaturation[quarter].cards++;
				}
				processedGroupsIds.push(...nextPositionGroups.map((g: CardsGroup) => g.id));
			}
		});
		return quartersSaturation;
	}

	static buildSaturatedQuarters(
		quartersSaturation: QuartersSaturation,
		mechanicsSaturationPercentage: number = Constants.VALUE.MECHANICS_SATURATION_PERCENTAGE
	): HourQuarter[] {
		const saturatedQuarters = [];
		for (const [minutes, saturation] of Object.entries(quartersSaturation)) {
			if (saturation.cards > saturation.mechanics * mechanicsSaturationPercentage/100) {
				saturatedQuarters.push(
					new HourQuarter(Math.floor(parseInt(minutes)/60), parseInt(minutes)%60)
				);
			}
		}
		return saturatedQuarters;
	}

	static findNextPositionGroups(lineGroups: CardsGroup[], group: CardsGroup): CardsGroup[] {
		lineGroups = lineGroups.filter((g: CardsGroup) => g.id != group.id);
		const [startMinutes, endMinutes] = [
			this.roundLowerQuarter(group.start), this.roundUpperQuarter(group.end) - 15
		];
		let nextQuarterGroups = lineGroups.filter((g: CardsGroup) =>
			this.roundLowerQuarter(g.start) == endMinutes || (this.roundUpperQuarter(g.end) - 15) == startMinutes
		);
		if (nextQuarterGroups.length) {
			nextQuarterGroups = [].concat(...nextQuarterGroups.map((g: CardsGroup) =>
				this.findNextPositionGroups(lineGroups, g)
			));
		}
		return [group].concat(nextQuarterGroups);
	}

	static roundLowerQuarter(time: Dayjs): number {
		return UtilsService.roundFloor(UtilsService.calcMinutesFromDate(time), Constants.QUARTERS.STEP_15);
	}

	static roundUpperQuarter(time: Dayjs): number {
		return UtilsService.roundCeil(UtilsService.calcMinutesFromDate(time), Constants.QUARTERS.STEP_15);
	}

	static findQuarterMechanics(dayMechanics: Mechanic[], quarter: number): Mechanic[] {
		return dayMechanics.filter((mechanic: Mechanic) => {
			return mechanic.schedules.find((interval: ScheduleInterval) =>
				interval.hourQuarters.find((hourQuarter: HourQuarters) =>
					hourQuarter.quarters.find((q: number) =>
						quarter == UtilsService.calcMinutes(hourQuarter.hour, q)
					) != undefined
				) != undefined
			) != undefined;
		});
	}

	// endregion

	// region Type actions

	static findCardTypeBehaviour(type: string): CardTypeBehaviour {
		return this.cardTypeBehaviour[type] || this.cardTypeBehaviour[Constants.DEFAULT];
	}

	static findCardModeAction(mode: string): CardModeAction {
		return this.cardModeAction[mode];
	}

	static updateCardMode(groups: CardsGroup[], mode: string): void {
		groups.forEach((group: CardsGroup) => {
			group.mode = mode;
		});
		if (groups[0].cards[0].day) {
			NotificationService.notifyMechanicLine(groups[0].cards[0].day, groups[0].cards[0].mechanicCode);
		} else {
			NotificationService.notifyBand(undefined, groups);
		}
	}

	// endregion

	// region Division

	cutCard(group: CardsGroup, groupX: number, x: number): void {
		const clickedCard = CardsService.findClickedCard(group.cards, groupX, x);
		const clickedCardIndex = group.cards.findIndex((card: Card) => card.panelId == clickedCard.panelId);
		const cardLeft = groupX + DimensionsService.calcWidthFromDuration(
			CardsService.findCardsDuration(group.cards.slice(0, clickedCardIndex))
		);
		const cardRight = cardLeft + DimensionsService.calcWidthFromDuration(clickedCard.duration);
		const [leftCardWidth, rightCardWidth] = [x - cardLeft, cardRight - x];
		const [leftCardDuration, rightCardDuration] = [
			DimensionsService.calcDurationFromWidth(leftCardWidth),
			DimensionsService.calcDurationFromWidth(rightCardWidth)
		];
		if (leftCardDuration >= Constants.VALUE.CARD_MIN_DURATION
				&& rightCardDuration >= Constants.VALUE.CARD_MIN_DURATION) {
			this.divideCard(clickedCard, group, leftCardDuration, rightCardDuration);
		}
	}

	cutCardByHalf(group: CardsGroup, groupX: number, x: number): void {
		const clickedCard = CardsService.findClickedCard(group.cards, groupX, x);
		if (clickedCard.duration >= Constants.VALUE.CARD_MIN_DURATION * 1.5) {
			const newDuration = UtilsService.roundCeil(clickedCard.duration / 2, 5);
			this.divideCard(clickedCard, group, newDuration, newDuration);
		}
	}

	private static findClickedCard(cards: Card[], groupX: number, x: number): Card {
		const xLeft = CardPositionService.absolutePositionToLeft(x) + Constants.VALUE.MECHANIC_INFO_WIDTH;
		return cards.find((card: Card, index: number) => {
			const leftCardsDuration = CardsService.findCardsDuration(cards.slice(0, index+1));
			const leftCardsWidth = DimensionsService.calcWidthFromDuration(leftCardsDuration);
			return groupX + leftCardsWidth > xLeft;
		});
	}

	private static findCardsDuration(cards: Card[]): number {
		return UtilsService.sum(cards, Constants.PROPERTY.DURATION);
	}

	divideCard(card: Card, group: CardsGroup, leftCardDuration: number, rightCardDuration: number): void {
		CardsService.updateCard(card, rightCardDuration);
		const newRightCard = CardsService.createCard(card, card.end, rightCardDuration);
		const dividedCards = this.updateDividedCards(card, newRightCard);
		this.updateGroups(group, card, newRightCard);
		this.updateDividedDbCards(dividedCards);
	}

	private static createCard(card: Card, start: Dayjs, duration: number): Card {
		const newCard = card.clone();
		newCard.setStart(start);
		newCard.setDuration(duration);
		return newCard;
	}

	private static updateCard(card: Card, duration: number): void {
		card.setDuration(duration);
		card.linkedNext = undefined;
	}

	private updateDividedCards(card: Card, newRightCard: Card): Card[] {
		/* Se obtienen las fichas divididas de una orden y grupo. Como estas pueden estar en distintas
		*  agrupaciones de fichas y días, se tiene que buscar en todas las fichas asignadas y no asignadas */
		const allDividedCards = CardsService.findOrderCards(card.order.number).filter((c: Card) =>
			c.group.code == card.group.code
		);
		const maxDivisionIndex = Math.max(...allDividedCards.map((c: Card) => c.divisionIndex));
		newRightCard.setDivisionIndex(maxDivisionIndex + 1);

		const dividedCards = [card, newRightCard];
		if (card.dividedNext) {
			const dividedNextCard = allDividedCards.find((c: Card) => c.panelId == card.dividedNext.panelId);
			dividedCards.push(dividedNextCard);
		}
		CardsService.updateCardsLinks(dividedCards, 'divided');
		return dividedCards;
	}

	private static updateCardsLinks(cards: Card[], property: string): void {
		cards.forEach((card: Card, i: number) => {
			if (i != 0) {
				card[`${property}Previous`] = cards[i-1].clone();
			}
			if (i != cards.length - 1) {
				card[`${property}Next`] = cards[i+1].clone();
			}
		});
	}

	private updateGroups(group: CardsGroup, card: Card, newRightCard: Card): void {
		const cardGroupIndex = group.cards.findIndex((c: Card) => c.panelId == card.panelId);
		const rightDividedCards = group.cards.slice(cardGroupIndex+1, group.cards.length);
		group.removeCards(0, cardGroupIndex+1);
		const newGroup = new CardsGroup(
			[newRightCard].concat(rightDividedCards),
			DimensionsService.calcLeftFromStart(group.end)
		);
		CardsService.updateLinkedLinks(newGroup, group);
		if (card.day) {
			CardsService.handleAddAssignedCardsGroup(card.day, card.mechanicCode, newGroup);
		} else {
			CardsService.handleAddUnassignedCardsGroup(newGroup);
		}
	}

	private static updateLinkedLinks(newGroup: CardsGroup, group: CardsGroup): void {
		this.updateCardsLinks(newGroup.cards, 'linked');
		this.updateCardsLinks(group.cards, 'linked');
	}

	private updateDividedDbCards(dividedCards: Card[]): void {
		const newCard = dividedCards[1];
		dividedCards.splice(1, 1);

		this.http.post(Url.cards(), [newCard], {params: {updateLinks: 'false'}}).subscribe(() => {
			this.http.put(Url.cardsDivision(), dividedCards).subscribe();
		});
	}

	// endregion

	// region Auxiliary replacement

	replaceGroup(group: CardsGroup, groupToReplace: CardsGroup = CardsService.auxiliaryGroupToReplace): void {
		const originDropzone = DropzoneService.findDropzone(group.cards[0]);
		const destinyDropzone = DropzoneService.findDropzone(groupToReplace.cards[0]);

		/* Al usar las dropzones para llevar a cabo el movimiento, la propiedad left debe estar actualizada, ya que es
		*  la que se toma como referencia para calcular el resto de propiedades */
		const clonedGroup = group.clone();
		clonedGroup.left = groupToReplace.left;
		const groupsToUpdate = destinyDropzone.findGroupsToUpdate(clonedGroup, groupToReplace.line);
		if (groupsToUpdate) {
			this.deleteReplacedGroup(groupToReplace, destinyDropzone);
			CardsService.updateReplacementGroup(
				group,
				groupsToUpdate,
				groupToReplace,
				groupToReplace.line,
				originDropzone,
				destinyDropzone
			);
		} else {
			NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.NO_REPLACEMENT_SPACE));
		}
	}

	static updateReplacementGroup(
		group: CardsGroup,
		groupsToUpdate: CardsGroup[],
		auxiliaryGroup: CardsGroup,
		line: number,
		originDropzone: Dropzone,
		destinyDropzone: Dropzone
	): void {
		originDropzone.removeGroup(group, false, destinyDropzone);
		/* Al validar un movimiento dentro de la dropzone (al mover una ficha de forma normal), se obtiene
		*  dayMechanicGroups. Al no validarse en este caso, ese valor no está actualizado y puede producir errores.
		*  Por tanto, se obtiene y se pasa como parámetro */
		destinyDropzone.addGroup(
			groupsToUpdate,
			group,
			originDropzone,
			line
		);
	}

	deleteReplacedGroup(groupToReplace: CardsGroup, destinyDropzone: Dropzone): void {
		destinyDropzone.removeGroup(groupToReplace, false, undefined);
		this.http.put(Url.cardsDeletion(), groupToReplace.cards).subscribe();
	}

	// endregion

	// region Vehicle

	findVehiclePositionValue(cardVehiclePosition: string, vehiclePosition: string): string {
		return cardVehiclePosition == vehiclePosition ? undefined : vehiclePosition;
	}

	updateVehiclePosition(card: Card, vehiclePosition: string, updateDb: boolean = true): void {
		card.vehiclePosition = this.findVehiclePositionValue(card.vehiclePosition, vehiclePosition);
		const group = CardsService.findCardGroup(
			CardsService.findLineGroups(card.day, card.mechanicCode, card.line),
			card.panelId
		);
		NotificationService.notifyGroups([group], true);
		if (updateDb) {
			this.http.patch(Url.cardsVehiclePosition(), [card]).subscribe();
		}
	}

	// endregion

	// region Pending

	updatePendingCall(card: Card, pendingCall: boolean, updateDb: boolean = true): void {
		card.pending.call = pendingCall;
		const group = CardsService.findCardGroup(
			CardsService.findLineGroups(card.day, card.mechanicCode, card.line),
			card.panelId
		);
		NotificationService.notifyGroups([group], true);
		if (updateDb) {
			this.http.patch(Url.cardsPendingCall(), [card]).subscribe();
		}
	}

	updatePendingBudget(card: Card, pendingBudget: boolean, updateDb: boolean = true): void {
		card.pending.budget = pendingBudget;
		const group = CardsService.findCardGroup(
			CardsService.findLineGroups(card.day, card.mechanicCode, card.line),
			card.panelId
		);
		NotificationService.notifyGroups([group], true);
		if (updateDb) {
			this.http.patch(Url.cardsPendingBudget(), [card]).subscribe();
		}
	}

	// endregion

	syncJpdv(): Observable<any> {
		return this.http.post(Url.syncJpdv(), undefined);
	}

}
