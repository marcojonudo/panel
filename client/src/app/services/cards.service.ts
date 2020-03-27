import {Injectable} from '@angular/core';
import {Card} from "../objects/card";

import {CardsGroup} from "../objects/cards-group";
import {HttpClient} from "@angular/common/http";
import {UnassignedCardUpdateTrigger} from "../objects/update-cards/unassigned-card-update-trigger";
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
import {QuarterSaturation} from "../objects/quarters-saturation-update/quarter-saturation";
import {DayQuartersSaturation} from "../objects/quarters-saturation-update/day-quarters-saturation";
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

@Injectable({
	providedIn: 'root'
})
export class CardsService {

	private static cards: Card[];
	private static unassignedCards: Card[];
	private static assignedCards: Card[];

	private static _assignedDaysCardsGroups: DaysAssignedGroups;
	private static _assignedCardsGroups: CardsGroup[];
	private static _unassignedAuxiliaryCardsGroups: CardsGroup[];
	private static _finishedCardsGroups: CardsGroup[];
	private static _unassignedCardsGroups: CardsGroup[];
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

	static get unassignedCardsGroups(): CardsGroup[] {
		return this._unassignedCardsGroups;
	}

	static set unassignedCardsGroups(value: CardsGroup[]) {
		this._unassignedCardsGroups = value;
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

	static get assignedCardsGroups(): CardsGroup[] {
		return this._assignedCardsGroups;
	}

	static set assignedCardsGroups(value: CardsGroup[]) {
		this._assignedCardsGroups = value;
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
		this.unassignedCardsGroups = this.initUnassignedCardsGroups(this.unassignedCards);
		this.unassignedTypesCardsGroups = this.initUnassignedTypesCardsGroups(this.unassignedCardsGroups);

		this.assignedCards = notFinishedCards.filter(card => card.day);
		this.assignedCardsGroups = this.initAssignedCardsGroups(this.assignedCards);
		this.initAssignedDaysCardsObjects(this.assignedCardsGroups, daysMechanics);

		// this.quartersSaturation = this.checkQuarterSaturation(UtilsService.clearTime(new Date()));

		console.log('Cards', this.cards);
		console.log('Auxiliary cards groups', this.unassignedAuxiliaryCardsGroups);
		console.log('Finished cards groups', this.finishedCardsGroups);
		console.log('Unassigned cards groups', this.unassignedCardsGroups);
		console.log('Unassigned types cards groups', this.unassignedTypesCardsGroups);
		console.log('Assigned cards groups', this.assignedCardsGroups);
		console.log('Assigned days cards groups', this.assignedDaysCardsGroups);
	}

	private static initUnassignedCardsGroups(unassignedCards: Card[]): CardsGroup[] {
		let groups = [];
		let processedCards = [];
		for (let card of unassignedCards) {
			const processed = processedCards.indexOf(card) > -1;
			if (!processed) {
				let linkedCards = this.findAllLinkedCards(unassignedCards, card);
				groups.push(new CardsGroup(this.sortLinkedCards(linkedCards)));
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

	static removeFromAssigned(cardsGroup: CardsGroup, day: Dayjs, mechanicCode: string, notify: boolean = true): any {
		this.handleAssignedMovementGroupsLinks(
			day,
			mechanicCode,
			cardsGroup.line,
			cardsGroup.start,
			cardsGroup.end
		);
		this.handleRemoveAssignedCardsGroup(day, mechanicCode, cardsGroup, notify);
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
		this.checkQuarterSaturation(day);
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
		group.start = group.cards[0].start;
		group.end = group.cards[group.cards.length - 1].end;
	}

	private static updateOrderCode(card: Card, group: CardsGroup, index: number): void {
		if (card.type == Constants.CARD_TYPE.AUXILIARY) {
			if (card.order.code == Constants.AUXILIARY_DEFAULT_ORDER_CODE) {
				const assignedAuxiliaryGroups = this.assignedCardsGroups.filter((group: CardsGroup) =>
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

	static handleCardDurationUpdate(card: Card, widthIncrease: number, mechanic: Mechanic): Card[] {
		const durationIncrease = DimensionsService.calcDurationFromWidth(widthIncrease);
		const groups = mechanic
			? this.findLineGroups(card.day, card.mechanicCode, card.line)
			: this.findUnassignedGroups(card.type, card.status);
		const group = this.findCardGroup(groups, card.panelId);

		/* Si la ficha se está reduciendo, no es necesario hacer comprobaciones relativas a los límites del horario
		*  u otros grupos desplazados, ya que no los afectaría */
		if (widthIncrease < 0) {
			/* Se actualiza la duración sólo si la ficha supera el valor mínimo */
			if (card.duration > Constants.VALUE.CARD_MIN_DURATION) {
				if (!mechanic) {
					const groupIndex = groups.findIndex((g: CardsGroup) => g.id == group.id);
					const updatedGroups = groups.slice(groupIndex+1, groups.length+1);
					this.updatePositionByStep(updatedGroups, widthIncrease, durationIncrease);
				}
				this.updateDurationProperties(card, group, widthIncrease, durationIncrease);
				return group.cards
			}
			return []
		}

		let updatedGroups = [];
		if (mechanic) {
			/* Si se está aumentando el tamaño de una ficha, se debe comprobar si este sobresale del horario en el que
            *  está asignada */
			const groupOutsideSchedule = this.groupOutsideSchedule(group, mechanic.schedules);
			/* Si ya está en el límite, no se actualiza la información */
			if (groupOutsideSchedule) {
				return [];
			}

			updatedGroups = this.findUpdatedDurationGroups(card);
			/* Si el aumento de duración no desplaza otros grupos, se actualiza la ficha */
			if (!updatedGroups.length) {
				this.updateDurationProperties(card, group, widthIncrease, durationIncrease);
				return group.cards
			}

			/* En caso de que se desplacen otros grupos, estos podrían sobresalir del horario. Si es así, no se actualiza
            *  la información */
			const translatedGroupOutsideSchedule = this.groupOutsideSchedule(
				updatedGroups[updatedGroups.length - 1],
				mechanic.schedules
			);
			if (translatedGroupOutsideSchedule) {
				return [];
			}
		} else {
			const groupIndex = groups.findIndex((g: CardsGroup) => g.id == group.id);
			updatedGroups = groups.slice(groupIndex+1, groups.length+1);
		}

		/* Si se desplazan grupos pero todos están dentro del horario, se actualizan */
		const cards = this.updatePositionByStep(updatedGroups, widthIncrease, durationIncrease);
		this.updateDurationProperties(card, group, widthIncrease, durationIncrease);
		return cards.concat(group.cards);
	}

	static updateDurationProperties(card: Card, group: CardsGroup, widthIncrease: number, durationIncrease: number): void {
		card.setDuration(card.duration + durationIncrease, card.width + widthIncrease);
		group.cards.forEach((c: Card) => {
			if (c.panelId != card.panelId && c.start > card.start) {
				c.start = c.start.add(durationIncrease, Constants.DAY_JS.m);
				c.end = c.start.add(c.duration, Constants.DAY_JS.m);
			}
		});

		if (group.start) {
			group.end = group.end.add(durationIncrease, Constants.DAY_JS.m);
			NotificationService.notifyMechanicLine(
				Constants.MECHANIC_LINE_UPDATE_TYPE.CARD_DURATION,
				card.day,
				card.mechanicCode
			);
		} else {
			NotificationService.notifyBand();
		}
	}

	static groupOutsideSchedule(group: CardsGroup, schedules: ScheduleInterval[]): boolean {
		const threshold = schedules.find((interval: ScheduleInterval) => interval.end.isSame(group.end));
		return threshold != undefined;
	}

	static findUpdatedDurationGroups(card: Card): CardsGroup[] {
		const lineGroups = this.findLineGroups(card.day, card.mechanicCode, card.line);
		let stopSearching = false;
		return lineGroups.filter((group, i) => {
			if (!stopSearching && group.start.isAfter(card.start)) {
				const gapBetweenGroups = !lineGroups[i - 1].end.isSame(group.start);
				if (gapBetweenGroups) {
					stopSearching = true;
				}
				return !gapBetweenGroups
			}
			return false;
		});
	}

	static updatePositionByStep(groups: CardsGroup[], widthStep: number, durationStep: number): Card[] {
		const cards = [];
		groups.forEach(group => {
			group.left += widthStep;
			if (group.start) {
				group.start = group.start.add(durationStep, Constants.DAY_JS.m);
				group.end = group.end.add(durationStep, Constants.DAY_JS.m);

				group.cards.forEach(c => {
					c.start = c.start.add(durationStep, Constants.DAY_JS.m);
					c.end = c.start.add(c.duration, Constants.DAY_JS.m);
				});
			}
			cards.push(...group.cards);
		});
		return cards;
	}

	static handleAddFinishedCardsGroup(group: CardsGroup): void {
		this.addFinishedCardsGroup(group);
		// NotificationService.notifyBand();
	}

	static handleAddAssignedCardsGroup(day: Dayjs, mechanicCode: string, group: CardsGroup): void {
		this.addAssignedCardsGroup(day, mechanicCode, group);
		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.ADD_GROUP,
			day,
			mechanicCode
		);
	}

	static handleRemoveAssignedCardsGroup(
		day: Dayjs,
		mechanicCode: string,
		group: CardsGroup,
		notify: boolean = true
	): void {
		this.removeAssignedCardsGroup(day, mechanicCode, group);
		if (notify) {
			NotificationService.notifyMechanicLine(
				Constants.MECHANIC_LINE_UPDATE_TYPE.REMOVE_GROUP,
				day,
				mechanicCode
			);
		}
	}

	static handleAddUnassignedCardsGroup(group: CardsGroup, index: number = undefined, notify: boolean = true): void {
		this.addUnassignedCardsGroup(group, index);
		if (notify) {
			NotificationService.notifyBand(new UnassignedCardUpdateTrigger(group));
		}
	}

	static handleRemoveUnassignedCardsGroup(group: CardsGroup, notify: boolean = true): void {
		this.removeUnassignedCardsGroup(group);
		if (notify) {
			NotificationService.notifyBand(new UnassignedCardUpdateTrigger(group));
		}
	}

	static findLeftNextCard(card: Card): Card {
		return card.start ?
			this.findLeftAssignedNextCard(card.day, card.mechanicCode, card.line, card.order.number, card.start) :
			this.findLeftUnassignedNextCard(card.panelId, card.type, card.status);
	}

	static findRightNextCard(card: Card): Card {
		return card.start ?
			this.findRightAssignedNextCard(card.day, card.mechanicCode, card.line, card.order.number, card.end) :
			this.findRightUnassignedNextCard(card.panelId, card.type, card.status);
	}

	// endregion

	// region Link handlers

	static unlink(card: Card, side: string, linkHandler: CardLinkHandler): Card[] {
		/* Se obtienen los grupos de la línea o sin asignar, y a continuación el grupo al que pertence la ficha */
		const groups = linkHandler.findGroups(card);
		const group = CardsService.findCardGroup(groups, card.panelId);

		/* Se actualizan las propiedades de las fichas */
		const cardIndex = group.cards.findIndex(c => c.panelId == card.panelId);
		let offset = CardsService.updateLinks(card, group, cardIndex, side);

		/* Se definen los nuevos grupos, tanto el nuevo como la actualización de fichas del antiguo */
		const newGroup = linkHandler.createGroup(
			group.cards.slice(0, cardIndex + offset),
			group,
			cardIndex,
			offset
		);
		group.removeCards(cardIndex + offset, group.cards.length);

		/* El nuevo grupo, al ser el de la izquierda, tendrá el mismo índice que el original */
		const groupIndex = groups.findIndex((g: CardsGroup) => g.id == group.id);
		linkHandler.updateGroupsAdd(newGroup, groupIndex);

		return [newGroup.cards[newGroup.cards.length - 1], group.cards[0]];
	}

	private static updateLinks(card: Card, group: CardsGroup, cardIndex: number, side: string): number {
		let offset;
		if (side == Constants.NEXT_CARD_DIRECTION.RIGHT) {
			card.linkedNext = undefined;
			group.cards[cardIndex + 1].linkedPrevious = undefined;
			offset = 1;
		} else {
			card.linkedPrevious = undefined;
			group.cards[cardIndex - 1].linkedNext = undefined;
			offset = 0;
		}
		return offset;
	}

	static linkPrevious(card: Card, linkHandler: CardLinkHandler): Card[] {
		const groups = linkHandler.findGroups(card);
		const group = CardsService.findCardGroup(groups, card.panelId);
		const leftGroup = CardsService.findLeftGroup(groups, group.id);

		leftGroup.cards[leftGroup.cards.length - 1].linkedNext = card.clone();
		card.linkedPrevious = leftGroup.cards[leftGroup.cards.length - 1].clone();

		const lastLeftGroupCardIndex = leftGroup.cards.length - 1;
		leftGroup.addCards(group.cards);
		linkHandler.updateGroupsRemove(group);

		return leftGroup.cards.slice(lastLeftGroupCardIndex);
	}

	static linkNext(card: Card, linkHandler: CardLinkHandler): Card[] {
		const groups = linkHandler.findGroups(card);
		const group = CardsService.findCardGroup(groups, card.panelId);
		const rightGroup = CardsService.findRightGroup(groups, group.id);

		rightGroup.cards[0].linkedPrevious = card.clone();
		card.linkedNext = rightGroup.cards[0].clone();

		const lastGroupCardIndex = group.cards.length - 1;
		group.addCards(rightGroup.cards);
		linkHandler.updateGroupsRemove(rightGroup);

		return group.cards.slice(lastGroupCardIndex);
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
		/* Se usa concat en lugar de push para que no modifique el array original, y se actualice antes de tiempo en
		*  mechanic-line.component. Haciendo el push, el array cardsGroups del mechanic-line.component se actualiza aquí
		*  en lugar de en el propio componente */
		this.assignedDaysCardsGroups[day.valueOf()][mechanicCode] =
			UtilsService.sort(
				this.assignedDaysCardsGroups[day.valueOf()][mechanicCode].concat([group]),
				(g: CardsGroup) => g.start
			);
		this.assignedCardsGroups = this.assignedCardsGroups.concat(group);
	}

	private static removeAssignedCardsGroup(day: Dayjs, mechanicCode: string, group: CardsGroup): void {
		this.assignedDaysCardsGroups[day.valueOf()][mechanicCode] =
			this.assignedDaysCardsGroups[day.valueOf()][mechanicCode].filter((g: CardsGroup) => g.id != group.id);
		this.assignedCardsGroups = this.assignedCardsGroups.filter((g: CardsGroup) => g.id != group.id);
	}

	private static addUnassignedCardsGroup(group: CardsGroup, index: number): void {
		const groups = this.findUnassignedGroups(group.type, group.status);
		if (index) {
			groups.splice(index, 0, group);
		} else {
			groups.push(group);
			CardPositionService.sortUnassignedGroups(groups);
		}
		this.unassignedCardsGroups.push(group);
		CardPositionService.sortUnassignedGroups(groups);
		CardPositionService.updateUnassignedGroupsLeft(groups);
	}

	private static removeUnassignedCardsGroup(group: CardsGroup): void {
		const groups = this.findUnassignedGroups(group.type, group.status);
		const index = groups.findIndex(g => g.id == group.id);
		groups.splice(index, 1);
		this.unassignedCardsGroups = this.unassignedCardsGroups.filter((g: CardsGroup) => g.id != group.id);

		/* Además de actualizar los elementos de los grupos, se actualiza su posición */
		CardPositionService.updateUnassignedGroupsLeft(groups);
	}

	// region Finders

	static findDayGroups(day: Dayjs): CardsGroup[] {
		return [].concat(...Object.values(this.assignedDaysCardsGroups[day.valueOf()]));
	}

	static findDayMechanicGroups(day: Dayjs, mechanicCode: string): CardsGroup[] {
		return this.assignedDaysCardsGroups[day.valueOf()][mechanicCode];
	}

	static findLineGroups(day: Dayjs, mechanicCode: string, line: number): CardsGroup[] {
		return this.findDayMechanicGroups(day, mechanicCode).filter(group => group.line == line);
	}

	static findLineCards(day: Dayjs, mechanicCode: string, line: number): Card[] {
		const groups = this.findDayMechanicGroups(day, mechanicCode).filter(group => group.cards[0].line == line);
		return [].concat(...groups.map(group => group.cards));
	}

	private static findLeftAssignedNextCard(
		day: Dayjs,
		mechanicCode: string,
		line: number,
		orderNumber: number,
		start: Dayjs
	): Card {
		return this.findLineCards(day, mechanicCode, line).find((card: Card) => {
			return card.order.number == orderNumber && card.end.isSame(start)
		});
	}

	private static findRightAssignedNextCard(
		day: Dayjs,
		mechanicCode: string,
		line: number,
		orderNumber: number,
		end: Dayjs
	): Card {
		return this.findLineCards(day, mechanicCode, line).find((card: Card) => {
			return card.order.number == orderNumber && card.start.isSame(end)
		});
	}

	private static findLeftUnassignedNextCard(panelId: string, type: string, status: string): Card {
		const groups = this.findUnassignedGroups(type, status);
		const group = this.findCardGroup(groups, panelId);
		const cardIndex = group.cards.findIndex(card => card.panelId == panelId);
		if (cardIndex > 0) {
			return group.cards[cardIndex - 1];
		} else {
			const leftGroup = this.findLeftOrderGroup(groups, group.id, group.cards[0].order.number);
			return leftGroup ? leftGroup.cards[leftGroup.cards.length - 1] : undefined;
		}
	}

	private static findRightUnassignedNextCard(panelId: string, type: string, status: string): Card {
		const groups = this.findUnassignedGroups(type, status);
		const group = this.findCardGroup(groups, panelId);
		const cardIndex = group.cards.findIndex(card => card.panelId == panelId);
		if (cardIndex < group.cards.length - 1) {
			return group.cards[cardIndex + 1];
		} else {
			const rightGroup = this.findRightOrderGroup(groups, group.id, group.cards[0].order.number);
			return rightGroup ? rightGroup.cards[0] : undefined;
		}
	}

	private static findLeftOrderGroup(groups: CardsGroup[], groupId: string, orderNumber: number): CardsGroup {
		const group = this.findLeftGroup(groups, groupId);
		return group && group.cards[0].order.number == orderNumber ? group : undefined;
	}

	private static findRightOrderGroup(groups: CardsGroup[], groupId: string, orderNumber: number): CardsGroup {
		const group = this.findRightGroup(groups, groupId);
		return group && group.cards[0].order.number == orderNumber ? group : undefined;
	}

	private static findNextGroup(groups: CardsGroup[], groupId: string, offset: number): CardsGroup {
		const groupIndex = groups.findIndex(g => g.id == groupId);
		return groups[groupIndex + offset];
	}

	private static findLeftGroup(groups: CardsGroup[], groupId: string): CardsGroup {
		const groupIndex = groups.findIndex(g => g.id == groupId);
		return groupIndex > -1 && groupIndex > 0 ? groups[groupIndex - 1] : undefined;
	}

	private static findRightGroup(groups: CardsGroup[], groupId): CardsGroup {
		const groupIndex = groups.findIndex(g => g.id == groupId);
		return groupIndex > -1 && groupIndex < groups.length - 1 ? groups[groupIndex + 1] : undefined;
	}

	private static findLeftAssignedGroup(groups: CardsGroup[], start: Dayjs): CardsGroup {
		return groups.find((group: CardsGroup) => group.end.isSame(start));
	}

	private static findRightAssignedGroup(groups: CardsGroup[], end: Dayjs): CardsGroup {
		return groups.find((group: CardsGroup) => group.start.isSame(end));
	}

	private static findOrderGroups(groups: CardsGroup[], orderNumber: number): CardsGroup[] {
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
		assignedGroups: CardsGroup[] = this.assignedCardsGroups,
		unassignedGroups: CardsGroup[] = this.unassignedCardsGroups
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

	static checkQuarterSaturation(day: Dayjs): QuartersSaturation {
		const dayMechanics = MechanicsService.findDayMechanics(day).filter((mechanic: Mechanic) => !mechanic.fixed);
		const dayGroups = this.findDayGroups(day).filter((group: CardsGroup) =>
			dayMechanics.find((mechanic: Mechanic) => group.cards[0].mechanicCode == mechanic.code) != undefined
		);

		const quartersSaturation = {};
		dayGroups.forEach((group: CardsGroup) => {
			const startMinutes = UtilsService.roundFloor(
				group.start.diff(<Dayjs> group.start.startOf(Constants.DAY_JS.d), Constants.DAY_JS.m),
				Constants.QUARTERS.STEP_15
			);
			const endMinutes = UtilsService.roundCeil(
				group.end.diff(<Dayjs> group.end.startOf(Constants.DAY_JS.d), Constants.DAY_JS.m),
				Constants.QUARTERS.STEP_15
			);
			for (let quarter = startMinutes; quarter < endMinutes; quarter = quarter + Constants.QUARTERS.STEP_15) {
				if (!quartersSaturation[quarter]) {
					const mechanics = CardsService.findQuarterMechanics(dayMechanics, quarter);
					quartersSaturation[quarter] = new QuarterSaturation(0, mechanics.length);
				}
				quartersSaturation[quarter].cards++;
			}
		});
		NotificationService.notifyQuartersSaturation(new DayQuartersSaturation(day, quartersSaturation));
		return quartersSaturation;
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
			NotificationService.notifyMechanicLine(
				Constants.MECHANIC_LINE_UPDATE_TYPE.CARD_MODE,
				groups[0].cards[0].day,
				groups[0].cards[0].mechanicCode
			);
		} else {
			NotificationService.notifyBand();
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
		if (clickedCard.duration >= Constants.VALUE.CARD_MIN_DURATION * 2) {
			const [leftCardDuration, rightCardDuration] = [
				UtilsService.roundCeil(clickedCard.duration / 2, 5),
				UtilsService.roundFloor(clickedCard.duration / 2, 5)
			];
			this.divideCard(clickedCard, group, leftCardDuration, rightCardDuration);
		}
	}

	private static findClickedCard(cards: Card[], groupX: number, x: number): Card {
		return cards.find((card: Card, index: number) => {
			const leftCardsDuration = CardsService.findCardsDuration(cards.slice(0, index+1));
			const leftCardsWidth = DimensionsService.calcWidthFromDuration(leftCardsDuration);
			return groupX + leftCardsWidth > x
		});
	}

	private static findCardsDuration(cards: Card[]): number {
		return UtilsService.sum(cards, Constants.PROPERTY.DURATION);
	}

	divideCard(card: Card, group: CardsGroup, leftCardDuration: number, rightCardDuration: number): void {
		const newCard = CardsService.createLeftCard(card, leftCardDuration);
		CardsService.updateRightCard(card, newCard.end, rightCardDuration);
		this.updateGroups(group, newCard, card);
	}

	private static createLeftCard(card: Card, duration: number): Card {
		const newCard = card.clone();
		newCard.setDuration(duration);
		return newCard;
	}

	private static updateRightCard(card: Card, newStart: Dayjs, duration: number): void {
		card.setStart(newStart);
		card.setDuration(duration);
		card.linkedPrevious = undefined;
		card.linkedNext = undefined;
	}

	private updateGroups(group: CardsGroup, newCard: Card, card: Card): void {
		/* Se obtienen las fichas divididas de una orden y grupo. Como estas pueden estar en distintas
		*  agrupaciones de fichas y días, se tiene que buscar en todas las fichas asignadas y no asignadas */
		const dividedCards = CardsService.findOrderCards(card.order.number).filter((c: Card) =>
			c.group.code == card.group.code
		);
		/* Sólo se actualiza el divisionIndex de las fichas a la derecha de la cortada */
		const dividedCardsToUpdate = dividedCards.filter((c: Card) => c.panelId >= card.panelId);
		const oldDivisionIndexes = CardsService.updateCardsDivisionIndexes(dividedCardsToUpdate, card);

		const cardGroupIndex = group.cards.findIndex((c: Card) => c.panelId == card.panelId);
		const leftDividedCards = group.cards.slice(0, cardGroupIndex);
		const newGroup = new CardsGroup(leftDividedCards.concat(newCard), group.left);
		group.removeCards(cardGroupIndex, group.cards.length);
		CardsService.updateDivisionLinks(newGroup, group);

		this.http.post(Url.cards(), [newCard]).subscribe(() => {
			/* Si la ficha dividida no era la primera del grupo, es necesario actualizar el linkedNext de la anterior */
			if (cardGroupIndex > 0) {
				this.http.put(
					Url.cardsLinks(),
					newGroup.cards.slice(newGroup.cards.length-2, newGroup.cards.length-1)
				).subscribe();
			}
		});
		this.http.put(
			Url.cardsDivision(),
			dividedCardsToUpdate,
			{params: {oldDivisionIndexes: oldDivisionIndexes.map((i: number) => i.toString())}}
		).subscribe();

		if (card.day) {
			CardsService.handleAddAssignedCardsGroup(card.day, card.mechanicCode, newGroup);
		} else {
			CardsService.handleAddUnassignedCardsGroup(newGroup);
		}
	}

	private static updateCardsDivisionIndexes(dividedCardsToUpdate: Card[], card: Card): number[] {
		const oldDivisionIndexes = [];
		dividedCardsToUpdate.forEach((c: Card) => {
			oldDivisionIndexes.push(c.divisionIndex);
			c.setDivisionIndex(c.divisionIndex + 1);
		});
		return oldDivisionIndexes;
	}

	private static updateDivisionLinks(newGroup: CardsGroup, group: CardsGroup): void {
		this.relateCardsLinks(newGroup.cards);
		this.relateCardsLinks(group.cards);
	}

	private static relateCardsLinks(cards: Card[]): void {
		cards.forEach((card: Card, i: number) => {
			if (i != 0) {
				card.linkedPrevious = cards[i-1].clone();
			}
			if (i != cards.length - 1) {
				card.linkedNext = cards[i+1].clone();
			}
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
			CardsService.updateReplacementGroup(group, groupsToUpdate, groupToReplace.line, originDropzone, destinyDropzone);
		} else {
			NotificationService.notifyToast(new WarningToast(Constants.MESSAGE.NO_REPLACEMENT_SPACE));
		}
	}

	static updateReplacementGroup(
		group: CardsGroup,
		groupsToUpdate: CardsGroup[],
		line: number,
		originDropzone: Dropzone,
		destinyDropzone: Dropzone
	): void {
		originDropzone.removeGroup(group, false, destinyDropzone);
		destinyDropzone.addGroup(groupsToUpdate, group, originDropzone, line);
	}

	deleteReplacedGroup(groupToReplace: CardsGroup, destinyDropzone: Dropzone): void {
		destinyDropzone.removeGroup(groupToReplace, false, undefined);
		this.http.put(Url.cardsDeletion(), groupToReplace.cards).subscribe();
	}

	// endregion

	syncJpdv(): Observable<any> {
		return this.http.post(Url.syncJpdv(), undefined);
	}

}
