import {Injectable} from '@angular/core';
import {Card} from "../objects/card";

import {CardsGroup} from "../objects/cards-group";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {UnassignedCardUpdateTrigger} from "../objects/update-cards/unassigned-card-update-trigger";
import {Constants} from "../objects/constants";
import {UtilsService} from "./utils.service";
import {Schedule} from "../objects/schedule";
import {AppointmentsService} from "./appointments.service";
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
import {QuarterSaturation} from "../objects/quarter-saturation";
import {DayQuartersSaturation} from "../objects/quarters-saturation-update/day-quarters-saturation";
import {UnassignedAuxiliarySection} from "../objects/unassigned-sections/unassigned-temporal-section";
import {AuxiliaryCardBehaviour} from "../objects/card-type-behaviour/auxiliary-card-behaviour";
import {DefaultCardBehaviour} from "../objects/card-type-behaviour/default-card-behaviour";
import {CardTypeBehaviour} from "../objects/card-type-behaviour/card-type-behaviour";
import {CutCardModeAction} from "../objects/card-mode-action/cut-card-mode-action";
import {CardModeAction} from "../objects/card-mode-action/card-mode-action";
import {CardLinkHandler} from "../objects/card-links/card-link-handler";
import {CardPositionService} from "./card-position.service";

@Injectable({
	providedIn: 'root'
})
export class CardsService {

	private cards: Card[];
	private unassignedCards: Card[];
	private assignedCards: Card[];

	private _assignedDaysCardsGroups: DaysAssignedGroups;
	private _assignedCardsGroups: CardsGroup[];
	private _unassignedAuxiliaryCardsGroups: CardsGroup[];
	private _finishedCardsGroups: CardsGroup[];
	private _unassignedCardsGroups: CardsGroup[];
	private _unassignedTypesCardsGroups: GroupedTypeCards;

	private _unassignedSections: UnassignedSection[];
	private _cardTypeBehaviour: {[key: string]: CardTypeBehaviour};
	private _cardModeAction: {[key: string]: any};

	constructor(
		private appointmentsService: AppointmentsService,
		private mechanicsService: MechanicsService,
		private http: HttpClient
	) {
		this.unassignedSections = [
			new UnassignedTypeSection(this, Constants.CARD_TYPE.TODAY),
			new UnassignedTypeSection(this, Constants.CARD_TYPE.APPOINTMENT),
			new UnassignedTypeSection(this, Constants.CARD_TYPE.PENDING),
			new UnassignedFinishedSection(this, Constants.CARD_STATUS.FINISHED),
			new UnassignedAuxiliarySection(this, Constants.CARD_TYPE.AUXILIARY),
		];
		this.cardTypeBehaviour = {};
		this.cardTypeBehaviour[Constants.CARD_TYPE.AUXILIARY] = new AuxiliaryCardBehaviour(this);
		this.cardTypeBehaviour[Constants.DEFAULT] = new DefaultCardBehaviour(this);

		this.cardModeAction = {};
		this.cardModeAction[Constants.GROUP_MODE.CUT] = new CutCardModeAction(this);
	}

	// region Getters / setters

	get unassignedCardsGroups(): CardsGroup[] {
		return this._unassignedCardsGroups;
	}

	set unassignedCardsGroups(value: CardsGroup[]) {
		this._unassignedCardsGroups = value;
	}

	get unassignedAuxiliaryCardsGroups(): CardsGroup[] {
		return this._unassignedAuxiliaryCardsGroups;
	}

	set unassignedAuxiliaryCardsGroups(value: CardsGroup[]) {
		this._unassignedAuxiliaryCardsGroups = value;
	}

	get finishedCardsGroups(): CardsGroup[] {
		return this._finishedCardsGroups;
	}

	set finishedCardsGroups(value: CardsGroup[]) {
		this._finishedCardsGroups = value;
	}

	get unassignedTypesCardsGroups(): GroupedTypeCards {
		return this._unassignedTypesCardsGroups;
	}

	set unassignedTypesCardsGroups(value: GroupedTypeCards) {
		this._unassignedTypesCardsGroups = value;
	}

	get assignedCardsGroups(): CardsGroup[] {
		return this._assignedCardsGroups;
	}

	set assignedCardsGroups(value: CardsGroup[]) {
		this._assignedCardsGroups = value;
	}

	get assignedDaysCardsGroups(): DaysAssignedGroups {
		return this._assignedDaysCardsGroups;
	}

	set assignedDaysCardsGroups(value: DaysAssignedGroups) {
		this._assignedDaysCardsGroups = value;
	}

	get unassignedSections(): UnassignedSection[] {
		return this._unassignedSections;
	}

	set unassignedSections(value: UnassignedSection[]) {
		this._unassignedSections = value;
	}

	get cardTypeBehaviour(): {[key: string]: CardTypeBehaviour} {
		return this._cardTypeBehaviour;
	}

	set cardTypeBehaviour(value: {[key: string]: CardTypeBehaviour}) {
		this._cardTypeBehaviour = value;
	}

	get cardModeAction(): { [p: string]: any } {
		return this._cardModeAction;
	}

	set cardModeAction(value: { [p: string]: any }) {
		this._cardModeAction = value;
	}

	// endregion

	// region Init

	init(cards: Card[], daysMechanics: DaysMechanics) {
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

	private initUnassignedCardsGroups(unassignedCards: Card[]): CardsGroup[] {
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

	private initUnassignedTypesCardsGroups(groups: CardsGroup[]): any {
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

	private initAssignedCardsGroups(assignedCards: Card[]) {
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

	private findAllLinkedCards(cards: Card[], card: Card): Card[] {
		return this.findPreviousCards(cards, card, [card]).concat(this.findNextCards(cards, card));
	}

	// endregion

	// region Translate card

	addToFinished(group: CardsGroup): void {
		// this.handleAssignedMovementGroupsLinks(
		// 	day,
		// 	newMechanicCode,
		// 	cardsGroup.line,
		// 	cardsGroup.start,
		// 	cardsGroup.end
		// );
		this.handleAddFinishedCardsGroup(group);
	}

	removeFromAssigned(cardsGroup: CardsGroup, day: Date, mechanicCode: string): any {
		this.handleAssignedMovementGroupsLinks(
			day,
			mechanicCode,
			cardsGroup.line,
			cardsGroup.start,
			cardsGroup.end
		);
		this.handleRemoveAssignedCardsGroup(day, mechanicCode, cardsGroup);
		this.checkQuarterSaturation(day);
	}

	addToAssigned(cardsGroup: CardsGroup, day: Date, newMechanicCode: string): void {
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

	removeFromUnassigned(group: CardsGroup, notify: boolean = true): void {
		this.handleUnassignedMovementGroupsLinks(group.cards[0].order.number, group.type, group.status);
		this.handleRemoveUnassignedCardsGroup(group, notify);
	}

	addToUnassigned(group: CardsGroup): void {
		this.handleUnassignedMovementGroupsLinks(group.cards[0].order.number, group.type, group.status);
		this.handleAddUnassignedCardsGroup(group);
	}

	updateAssignedCards(
		clonedGroups: CardsGroup[],
		helperGroup: CardsGroup,
		day: Date,
		newMechanicCode: string,
		line: number,
		dayMechanicGroups: CardsGroup[],
		updateDb: boolean = true
	) {
		const allOriginalGroups = dayMechanicGroups.concat(helperGroup);

		clonedGroups.forEach((clonedGroup: CardsGroup) => {
			/* Se obtiene el grupo de todos los del día, en lugar de sólo los de la línea, porque la ficha que se está
			*  moviendo puede provenir de otra línea. Además, se añade cardsGroup porque si se mueve desde otra línea de
			*  mecánico, no va a estar en dayMechanicsCardsGroups */
			const group = allOriginalGroups.find(group => group.id == clonedGroup.id);
			/* Se actualizan los valores relacionados con la posicion (left y start) */
			this.updatePosition(group, day, newMechanicCode, line, clonedGroup.left);
		});

		if (updateDb) {
			this.updateDbCardsPosition(clonedGroups);
		}
	}

	updateDbCardsPosition(groups: CardsGroup[]): void {
		const newAuxiliaryCard = groups[0].cards[0].type == Constants.CARD_TYPE.AUXILIARY
			&& groups[0].cards[0].lastStatus == Constants.CARD_STATUS.DEFAULT;
		/* Si la ficha es auxiliar, y se acaba de asignar desde la cinta (status DEFAULT), se debe crear en base de
		*  datos. Una vez se haya asignado, su estado cambia a AUXILIARY */
		if (newAuxiliaryCard) {
			this.http.post(Url.cards(), [].concat(...groups.map(g => g.cards))).subscribe();
		} else {
			this.http.put(Url.cardsPosition(), [].concat(...groups.map(g => g.cards))).subscribe();
		}
	}

	updateFinishedGroup(group: CardsGroup) {
		group.status = Constants.CARD_STATUS.FINISHED;
		for (const card of group.cards) {
			card.status = Constants.CARD_STATUS.FINISHED;
			/* Se definen las propiedades last para poder manejar los contadores de citas */
			card.lastDay = card.day;
			card.lastStart = card.start;
			card.lastEnd = card.end;
		}
		this.http.put(Url.cardsPosition(), group.cards).subscribe();
	}

	resetCardsGroup(group: CardsGroup, updateDb: boolean = true) {
		group.left = undefined;

		for (let card of group.cards) {
			this.resetCard(card);
		}

		if (updateDb) {
			this.http.put(
				`${environment.serverUrl}/panel/cards/position`,
				group.cards
			).subscribe();
		}
	}

	private resetCard(card: Card): void {
		card.setDay(undefined);
		card.setMechanicCode(undefined);
		card.setStart(undefined);
		card.line = undefined;
	}

	updatePosition(group: CardsGroup, day: Date, mechanicCode: string, line: number, left: number) {
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

			const leftCardsDuration = UtilsService.sum(group.cards.slice(0, index), 'duration');
			card.setStart(
				DimensionsService.calcStartFromLeft(group.left + DimensionsService.calcWidthFromDuration(leftCardsDuration),
				day
			));
		});

		group.id = group.cards[0].panelId;
		group.start = group.cards[0].start;
		group.end = group.cards[group.cards.length - 1].end;
	}

	private updateOrderCode(card: Card, group: CardsGroup, index: number): void {
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

	handleCardDurationUpdate(card: Card, widthIncrease: number, mechanic: Mechanic): Card[] {
		const durationIncrease = DimensionsService.calcDurationFromWidth(widthIncrease);
		const group = this.findCardGroup(this.findLineGroups(card.day, card.mechanicCode, card.line), card.panelId);

		/* Si la ficha se está reduciendo, no es necesario hacer comprobaciones relativas a los límites del horario
		*  u otros grupos desplazados, ya que no los afectaría */
		if (widthIncrease < 0) {
			/* Se actualiza la duración sólo si la ficha supera el valor mínimo */
			if (card.duration > Constants.VALUE.CARD_MIN_DURATION) {
				this.updateDurationProperties(card, group, widthIncrease, durationIncrease);
				return group.cards
			}
			return []
		}

		/* Si se está aumentando el tamaño de una ficha, se debe comprobar si este sobresale del horario en el que está
		*  asignada*/
		const schedule = mechanic.schedule;
		const groupOutsideSchedule = this.groupOutsideSchedule(group, schedule);
		/* Si ya está en el límite, no se actualiza la información */
		if (groupOutsideSchedule) {
			return [];
		}

		const updatedGroups = this.findUpdatedDurationGroups(card);
		/* Si el aumento de duración no desplaza otros grupos, se actualiza la ficha */
		if (!updatedGroups.length) {
			this.updateDurationProperties(card, group, widthIncrease, durationIncrease);
			return group.cards
		}

		/* En caso de que se desplacen otros grupos, estos podrían sobresalir del horario. Si es así, no se actualiza
		*  la información */
		const translatedGroupOutsideSchedule = this.groupOutsideSchedule(updatedGroups[updatedGroups.length - 1], schedule);
		if (translatedGroupOutsideSchedule) {
			return [];
		}

		/* Si se desplazan grupos pero todos están dentro del horario, se actualizan */
		const cards = this.updatePositionByStep(updatedGroups, widthIncrease, durationIncrease);
		this.updateDurationProperties(card, group, widthIncrease, durationIncrease);
		return cards.concat(group.cards);
	}

	updateDurationProperties(card: Card, group: CardsGroup, widthIncrease: number, durationIncrease: number): void {
		card.setDuration(card.duration + durationIncrease, card.width + widthIncrease);
		group.cards.forEach((c: Card) => {
			if (c.panelId != card.panelId && c.start > card.start) {
				c.start = UtilsService.addMinutes(c.start, durationIncrease);
				c.end = UtilsService.addMinutes(c.start, c.duration);
			}
		});

		group.end = UtilsService.addMinutes(group.end, durationIncrease);
		NotificationService.notifyMechanicLine(card.day, card.mechanicCode);
	}

	groupOutsideSchedule(group: CardsGroup, schedule: Schedule): boolean {
		// TODO Revisar sin threshold
		// const threshold = schedule.thresholds.filter((t, i) => i % 2 == 1).find(threshold => {
		// 	return threshold.getTime() == group.end.getTime();
		// });
		const threshold = schedule.intervals.find(interval =>
			interval.end.getTime() == group.end.getTime()
		);
		return threshold != undefined;
	}

	findUpdatedDurationGroups(card: Card): CardsGroup[] {
		const lineGroups = this.findLineGroups(card.day, card.mechanicCode, card.line);
		let stopSearching = false;
		return lineGroups.filter((group, i) => {
			const startTime = group.start.getTime();
			if (!stopSearching && startTime > card.start.getTime()) {
				const gapBetweenGroups = lineGroups[i - 1].end.getTime() != group.start.getTime();
				if (gapBetweenGroups) {
					stopSearching = true;
				}
				return !gapBetweenGroups
			}
			return false;
		});
	}

	updatePositionByStep(groups: CardsGroup[], widthStep: number, durationStep: number): Card[] {
		const cards = [];
		groups.forEach(group => {
			group.left += widthStep;
			group.start = UtilsService.addMinutes(group.start, durationStep);
			group.end = UtilsService.addMinutes(group.end, durationStep);

			group.cards.forEach(c => {
				c.start = UtilsService.addMinutes(c.start, durationStep);
				c.end = UtilsService.addMinutes(c.start, c.duration);
			});
			cards.push(...group.cards);
		});
		return cards;
	}


	updateDbCardsDuration(cards: Card[]): void {
		this.http.put(Url.cardsDuration(), cards).subscribe();
	}

	handleAddFinishedCardsGroup(group: CardsGroup): void {
		this.addFinishedCardsGroup(group);
		// NotificationService.notifyBand();
	}

	handleAddAssignedCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		this.addAssignedCardsGroup(day, mechanicCode, group);
		NotificationService.notifyMechanicLine(day, mechanicCode);
	}

	handleRemoveAssignedCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		this.removeAssignedCardsGroup(day, mechanicCode, group);
		NotificationService.notifyMechanicLine(day, mechanicCode);
	}

	handleAddUnassignedCardsGroup(group: CardsGroup, index: number = undefined): void {
		this.addUnassignedCardsGroup(group, index);
		NotificationService.notifyBand(new UnassignedCardUpdateTrigger(group));
	}

	handleRemoveUnassignedCardsGroup(group: CardsGroup, notify: boolean = true): void {
		this.removeUnassignedCardsGroup(group);
		if (notify) {
			NotificationService.notifyBand(new UnassignedCardUpdateTrigger(group));
		}
	}

	findLeftNextCard(card: Card): Card {
		return card.start ?
			this.findLeftAssignedNextCard(card.day, card.mechanicCode, card.line, card.order.number, card.start) :
			this.findLeftUnassignedNextCard(card.panelId, card.type, card.status);
	}

	findRightNextCard(card: Card): Card {
		return card.start ?
			this.findRightAssignedNextCard(card.day, card.mechanicCode, card.line, card.order.number, card.end) :
			this.findRightUnassignedNextCard(card.panelId, card.type, card.status);
	}

	// endregion

	// region Link handlers

	unlink(card: Card, side: string, linkHandler: CardLinkHandler, updateDb: boolean = true): void {
		/* Se obtienen los grupos de la línea o sin asignar, y a continuación el grupo al que pertence la ficha */
		const groups = linkHandler.findGroups(card);
		const group = this.findCardGroup(groups, card.panelId);

		/* Se actualizan las propiedades de las fichas */
		const cardIndex = group.cards.findIndex(c => c.panelId == card.panelId);
		let offset = this.updateLinks(card, group, cardIndex, side);

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
		if (updateDb) {
			this.http.put(
				Url.cardsLinks(),
				[newGroup.cards[newGroup.cards.length - 1], group.cards[0]]
			).subscribe();
		}
	}

	private updateLinks(card: Card, group: CardsGroup, cardIndex: number, side: string): number {
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

	linkPrevious(card: Card, linkHandler: CardLinkHandler): void {
		const groups = linkHandler.findGroups(card);
		const group = this.findCardGroup(groups, card.panelId);
		const leftGroup = this.findLeftGroup(groups, group.id);

		leftGroup.cards[leftGroup.cards.length - 1].linkedNext = card.clone();
		card.linkedPrevious = leftGroup.cards[leftGroup.cards.length - 1].clone();

		const lastLeftGroupCardIndex = leftGroup.cards.length - 1;
		leftGroup.addCards(group.cards);
		linkHandler.updateGroupsRemove(group);
		this.http.put(Url.cardsLinks(), leftGroup.cards.slice(lastLeftGroupCardIndex)).subscribe();
	}

	linkNext(card: Card, linkHandler: CardLinkHandler, updateDb: boolean = true): void {
		const groups = linkHandler.findGroups(card);
		const group = this.findCardGroup(groups, card.panelId);
		const rightGroup = this.findRightGroup(groups, group.id);

		rightGroup.cards[0].linkedPrevious = card.clone();
		card.linkedNext = rightGroup.cards[0].clone();

		const lastGroupCardIndex = group.cards.length - 1;
		group.addCards(rightGroup.cards);
		linkHandler.updateGroupsRemove(rightGroup);
		if (updateDb) {
			this.http.put(Url.cardsLinks(), group.cards.slice(lastGroupCardIndex)).subscribe();
		}
	}

	link(card: Card, side: string, linkHandler: CardLinkHandler, updateDb: boolean = true): void {
		const groups = linkHandler.findGroups(card);
		const group = this.findCardGroup(groups, card.panelId);

		const offset = side == Constants.NEXT_CARD_DIRECTION.RIGHT ? 1 : -1;
		const nextGroup = this.findNextGroup(groups, group.id, offset);

		//----

		const leftGroup = this.findLeftGroup(groups, group.id);

		leftGroup.cards[leftGroup.cards.length - 1].linkedNext = card;
		card.linkedPrevious = leftGroup.cards[leftGroup.cards.length - 1];

		const lastLeftGroupCardIndex = leftGroup.cards.length - 1;
		leftGroup.addCards(group.cards);

		//----
		const rightGroup = this.findRightGroup(groups, group.id);

		rightGroup.cards[0].linkedPrevious = card;
		card.linkedNext = rightGroup.cards[0];

		const lastGroupCardIndex = group.cards.length - 1;
		group.addCards(rightGroup.cards);

		//----


		linkHandler.updateGroupsRemove(group);
		this.http.put(
			`${environment.serverUrl}/panel/cards/links`,
			leftGroup.cards.slice(lastLeftGroupCardIndex)
		).subscribe();
	}

	// endregion

	// region Global cards map

	findOrderCards(
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

	findUnassignedGroups(type: string, status: string): CardsGroup[] {
		let section = this.unassignedSections.find(section => section.name == status);
		section = section ? section : this.unassignedSections.find(section => section.name == type);
		return section.findGroups();
	}

	findCardGroup(groups: CardsGroup[], cardPanelId: string): CardsGroup {
		return groups.find(group => group.cards.find(card => card.panelId == cardPanelId) != undefined);
	}

	private findPreviousCards(cards: Card[], card: Card, linkedCards: Card[] = []) {
		if (card.linkedPrevious) {
			const previousCard = cards.find((c: Card) => c.panelId == card.linkedPrevious.panelId);
			linkedCards.push(previousCard);
			this.findPreviousCards(cards, previousCard, linkedCards);
		}
		return linkedCards;
	}

	private findNextCards(cards: Card[], card: Card, linkedCards: Card[] = []) {
		if (card.linkedNext) {
			const nextCard = cards.find((c: Card) => c.panelId == card.linkedNext.panelId);
			linkedCards.push(nextCard);
			this.findNextCards(cards, nextCard, linkedCards);
		}
		return linkedCards;
	}

	private initAssignedDaysCardsObjects(assignedCardsGroups: CardsGroup[], daysMechanics: DaysMechanics): any {
		this.assignedDaysCardsGroups = {};

		for (let dayTime in daysMechanics) {
			this.assignedDaysCardsGroups[dayTime] = {};

			for (let mechanic of daysMechanics[dayTime]) {
				const assignedDayCardsGroups = assignedCardsGroups.filter(cardsGroup => {
					return cardsGroup.cards[0].day.getTime() == +dayTime && cardsGroup.cards[0].mechanicCode == mechanic.code
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

	private handleAssignedMovementGroupsLinks(day: Date, mechanicCode: string, line: number, start: Date, end: Date): void {
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

	private handleUnassignedMovementGroupsLinks(orderNumber: number, type: string, status: string): void {
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

	private addFinishedCardsGroup(group: CardsGroup): void {
		this.finishedCardsGroups.push(group);
		CardPositionService.sortUnassignedGroups(this.finishedCardsGroups);
		CardPositionService.updateUnassignedGroupsLeft(this.finishedCardsGroups);
	}

	private removeFinishedCardsGroup(group: CardsGroup): void {
		const index = this.finishedCardsGroups.findIndex(g => g.id == group.id);
		this.finishedCardsGroups.splice(index, 1);
	}

	private addAssignedCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		/* Se usa concat en lugar de push para que no modifique el array original, y se actualice antes de tiempo en
		*  mechanic-line.component. Haciendo el push, el array cardsGroups del mechanic-line.component se actualiza aquí
		*  en lugar de en el propio componente */
		this.assignedDaysCardsGroups[day.getTime()][mechanicCode] =
			UtilsService.sort(
				this.assignedDaysCardsGroups[day.getTime()][mechanicCode].concat([group]),
				(g) => g.start
			);
		this.assignedCardsGroups = this.assignedCardsGroups.concat(group);
	}

	private removeAssignedCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		this.assignedDaysCardsGroups[day.getTime()][mechanicCode] =
			this.assignedDaysCardsGroups[day.getTime()][mechanicCode].filter(g => g.id != group.id);
		this.assignedCardsGroups = this.assignedCardsGroups.filter(g => g.id != group.id);
	}

	private addUnassignedCardsGroup(group: CardsGroup, index: number): void {
		const groups = this.findUnassignedGroups(group.type, group.status);
		if (index) {
			groups.splice(index, 0, group);
		} else {
			groups.push(group);
			CardPositionService.sortUnassignedGroups(groups);
		}
		CardPositionService.updateUnassignedGroupsLeft(groups);
	}

	private removeUnassignedCardsGroup(group: CardsGroup): void {
		const groups = this.findUnassignedGroups(group.type, group.status);
		const index = groups.findIndex(g => g.id == group.id);
		groups.splice(index, 1);
		this.unassignedCardsGroups = this.unassignedCardsGroups.filter((g: CardsGroup) => g.id != group.id);

		/* Además de actualizar los elementos de los grupos, se actualiza su posición */
		CardPositionService.updateUnassignedGroupsLeft(groups);
	}

	// region Finders

	findDayGroups(day: Date): CardsGroup[] {
		return [].concat(...Object.values(this.assignedDaysCardsGroups[day.getTime()]));
	}

	findDayMechanicGroups(day: Date, mechanicCode: string): CardsGroup[] {
		return this.assignedDaysCardsGroups[day.getTime()][mechanicCode];
	}

	findLineGroups(day: Date, mechanicCode: string, line: number): CardsGroup[] {
		return this.findDayMechanicGroups(day, mechanicCode).filter(group => group.line == line);
	}

	findLineCards(day: Date, mechanicCode: string, line: number): Card[] {
		const groups = this.findDayMechanicGroups(day, mechanicCode).filter(group => group.cards[0].line == line);
		return [].concat(...groups.map(group => group.cards));
	}

	private findLeftAssignedNextCard(day: Date, mechanicCode: string, line: number, orderNumber: number, start: Date): Card {
		return this.findLineCards(day, mechanicCode, line).find(card => {
			return card.order.number == orderNumber && card.end.getTime() == start.getTime()
		});
	}

	private findRightAssignedNextCard(day: Date, mechanicCode: string, line: number, orderNumber: number, end: Date): Card {
		return this.findLineCards(day, mechanicCode, line).find(card => {
			return card.order.number == orderNumber && card.start.getTime() == end.getTime()
		});
	}

	private findLeftUnassignedNextCard(panelId: string, type: string, status: string): Card {
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

	private findRightUnassignedNextCard(panelId: string, type: string, status: string): Card {
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

	private findLeftOrderGroup(groups: CardsGroup[], groupId: string, orderNumber: number): CardsGroup {
		const group = this.findLeftGroup(groups, groupId);
		return group && group.cards[0].order.number == orderNumber ? group : undefined;
	}

	private findRightOrderGroup(groups: CardsGroup[], groupId: string, orderNumber: number): CardsGroup {
		const group = this.findRightGroup(groups, groupId);
		return group && group.cards[0].order.number == orderNumber ? group : undefined;
	}

	private findNextGroup(groups: CardsGroup[], groupId: string, offset: number): CardsGroup {
		const groupIndex = groups.findIndex(g => g.id == groupId);
		return groups[groupIndex + offset];
	}

	private findLeftGroup(groups: CardsGroup[], groupId: string): CardsGroup {
		const groupIndex = groups.findIndex(g => g.id == groupId);
		return groupIndex > -1 && groupIndex > 0 ? groups[groupIndex - 1] : undefined;
	}

	private findRightGroup(groups: CardsGroup[], groupId): CardsGroup {
		const groupIndex = groups.findIndex(g => g.id == groupId);
		return groupIndex > -1 && groupIndex < groups.length - 1 ? groups[groupIndex + 1] : undefined;
	}

	private findLeftAssignedGroup(groups: CardsGroup[], start: Date): CardsGroup {
		return groups.find(group => group.end.getTime() == start.getTime());
	}

	private findRightAssignedGroup(groups: CardsGroup[], end: Date): CardsGroup {
		return groups.find(group => group.start.getTime() == end.getTime());
	}

	private findOrderGroups(groups: CardsGroup[], orderNumber: number): CardsGroup[] {
		return groups.filter(group => group.cards[0].order.number == orderNumber);
	}

	private sortLinkedCards(cards: Card[]): Card[] {
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

	// endregion

	// region Quarter saturation

	checkQuarterSaturation(day: Date): QuartersSaturation {
		const dayGroups = this.findDayGroups(day);
		const dayMechanics = this.mechanicsService.findDayMechanics(day);

		const quartersSaturation = {};
		dayGroups.forEach((group: CardsGroup) => {
			const startMinutes = UtilsService.roundFloor(
				UtilsService.calcMinutesFromDate(group.start),
				Constants.QUARTERS.STEP_15
			);
			const endMinutes = UtilsService.roundCeil(
				UtilsService.calcMinutesFromDate(group.end),
				Constants.QUARTERS.STEP_15
			);
			for (let quarter = startMinutes; quarter < endMinutes; quarter = quarter + Constants.QUARTERS.STEP_15) {
				if (!quartersSaturation[quarter]) {
					const mechanics = this.findQuarterMechanics(dayMechanics, quarter);
					quartersSaturation[quarter] = new QuarterSaturation(0, mechanics.length);
				}
				quartersSaturation[quarter].cards++;
			}
		});
		NotificationService.notifyQuartersSaturation(new DayQuartersSaturation(day, quartersSaturation));
		return quartersSaturation;
	}

	findQuarterMechanics(dayMechanics: Mechanic[], quarter: number): Mechanic[] {
		return dayMechanics.filter((mechanic: Mechanic) => {
			return mechanic.schedule.intervals.find((interval: ScheduleInterval) =>
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

	findCardTypeBehaviour(type: string): CardTypeBehaviour {
		return this.cardTypeBehaviour[type] || this.cardTypeBehaviour[Constants.DEFAULT];
	}

	findCardModeAction(mode: string): CardModeAction {
		return this.cardModeAction[mode];
	}

	updateCardMode(group: CardsGroup, mode: string): void {
		group.mode = mode;
		NotificationService.notifyMechanicLine(group.cards[0].day, group.cards[0].mechanicCode);
	}

	// endregion

	// region Division

	cutCard(group: CardsGroup, groupX: number, x: number): void {
		const clickedCard = this.findClickedCard(group.cards, groupX, x);
		const clickedCardIndex = group.cards.findIndex((card: Card) => card.panelId == clickedCard.panelId);
		const cardLeft = groupX + DimensionsService.calcWidthFromDuration(
			this.findCardsDuration(group.cards.slice(0, clickedCardIndex))
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
		const clickedCard = this.findClickedCard(group.cards, groupX, x);
		if (clickedCard.duration >= Constants.VALUE.CARD_MIN_DURATION * 2) {
			const [leftCardDuration, rightCardDuration] = [
				UtilsService.roundCeil(clickedCard.duration / 2, 5),
				UtilsService.roundFloor(clickedCard.duration / 2, 5)
			];
			this.divideCard(clickedCard, group, leftCardDuration, rightCardDuration);
		}
	}

	private findClickedCard(cards: Card[], groupX: number, x: number): Card {
		return cards.find((card: Card, index: number) => {
			const leftCardsDuration = this.findCardsDuration(cards.slice(0, index+1));
			const leftCardsWidth = DimensionsService.calcWidthFromDuration(leftCardsDuration);
			return groupX + leftCardsWidth > x
		});
	}

	private findCardsDuration(cards: Card[]): number {
		return UtilsService.sum(cards, Constants.PROPERTY.DURATION);
	}

	divideCard(card: Card, group: CardsGroup, leftCardDuration: number, rightCardDuration: number): void {
		const newCard = this.createLeftCard(card, leftCardDuration);
		this.updateRightCard(card, newCard.end, rightCardDuration);
		this.updateGroups(group, newCard, card);
	}

	private createLeftCard(card: Card, duration: number): Card {
		const newCard = card.clone();
		newCard.setDuration(duration);
		return newCard;
	}

	private updateRightCard(card: Card, newStart: Date, duration: number): void {
		card.setStart(newStart);
		card.setDuration(duration);
		card.linkedPrevious = undefined;
		card.linkedNext = undefined;
	}

	private updateGroups(group: CardsGroup, newCard: Card, card: Card): void {
		/* Se obtienen las fichas divididas de una orden y grupo. Como estas pueden estar en distintas
		*  agrupaciones de fichas y días, se tiene que buscar en todas las fichas asignadas y no asignadas */
		const dividedCards = this.findOrderCards(card.order.number).filter((c: Card) =>
			c.group.code == card.group.code
		);
		/* Sólo se actualiza el divisionIndex de las fichas a la derecha de la cortada */
		const dividedCardsToUpdate = dividedCards.filter((c: Card) => c.panelId >= card.panelId);
		const oldDivisionIndexes = this.updateCardsDivisionIndexes(dividedCardsToUpdate, card);

		const cardGroupIndex = group.cards.findIndex((c: Card) => c.panelId == card.panelId);
		const leftDividedCards = group.cards.slice(0, cardGroupIndex);
		const newGroup = new CardsGroup(leftDividedCards.concat(newCard), group.left);
		group.removeCards(cardGroupIndex, group.cards.length);
		this.updateDivisionLinks(newGroup, group);

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
			this.handleAddAssignedCardsGroup(card.day, card.mechanicCode, newGroup);
		} else {
			this.handleAddUnassignedCardsGroup(newGroup);
		}
	}

	private updateCardsDivisionIndexes(dividedCardsToUpdate: Card[], card: Card): number[] {
		const oldDivisionIndexes = [];
		dividedCardsToUpdate.forEach((c: Card) => {
			oldDivisionIndexes.push(c.divisionIndex);
			c.setDivisionIndex(c.divisionIndex + 1);
		});
		return oldDivisionIndexes;
	}

	private updateDivisionLinks(newGroup: CardsGroup, group: CardsGroup): void {
		this.relateCardsLinks(newGroup.cards);
		this.relateCardsLinks(group.cards);
	}

	private relateCardsLinks(cards: Card[]): void {
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

}
