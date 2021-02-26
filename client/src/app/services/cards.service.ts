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
import {CardPositionService} from "./card-position.service";
import {ReplaceCardModeAction} from "../objects/card-mode-action/replace-card-mode-action";
import {DropzoneService} from "./dropzone.service";
import {Dropzone} from "../objects/dropzone-type/dropzone";
import {WarningToast} from "../objects/toasts/warning-toast";
import {Dayjs} from "dayjs";
import {Observable} from "rxjs/internal/Observable";
import {HourQuarter} from "../objects/hour-quarter";
import {CardDurationHandler} from "../objects/card-duration/card-duration-handler";
import {AssignedCardDurationHandler} from "../objects/card-duration/assigned-card-duration-handler";
import {Vehicle} from "../objects/vehicle";
import {Order} from "../objects/order";
import {UpdateDurationInfo} from "../objects/card-duration/update-duration-info";
import {AuxiliaryReplacement} from "../objects/auxiliary-replacement";
import {AssignedDropzone} from "../objects/dropzone-type/assigned-dropzone";
import {UnassignedDropzone} from "../objects/dropzone-type/unassigned-dropzone";

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
	private static _finishedGroups: CardsGroup[];
	private static _unassignedGroups: CardsGroup[];
	private static _unassignedTypesGroups: GroupedTypeCards;

	private static _unassignedSections: UnassignedSection[];
	private static _cardTypeBehaviour: {[key: string]: CardTypeBehaviour};
	private static _cardModeAction: {[key: string]: any};

	private static _auxiliaryGroup: CardsGroup;
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

		CardsService.unassignedTypesGroups = {};
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

	static get finishedGroups(): CardsGroup[] {
		return this._finishedGroups;
	}

	static set finishedGroups(value: CardsGroup[]) {
		this._finishedGroups = value;
	}

	static get unassignedTypesGroups(): GroupedTypeCards {
		return this._unassignedTypesGroups;
	}

	static set unassignedTypesGroups(value: GroupedTypeCards) {
		this._unassignedTypesGroups = value;
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

	static get auxiliaryGroup(): CardsGroup {
		return this._auxiliaryGroup;
	}

	static set auxiliaryGroup(value: CardsGroup) {
		this._auxiliaryGroup = value;
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

		this.unassignedAuxiliaryCardsGroups = this.initUnassignedGroups(unassignedAuxiliaryCards);
		this.finishedGroups = this.initAssignedGroups(finishedCards);

		this.unassignedCards = notFinishedCards.filter(card => !card.day);
		this.unassignedGroups = this.initUnassignedGroups(this.unassignedCards);
		this.unassignedTypesGroups = this.initUnassignedTypesGroups(this.unassignedGroups);

		this.assignedCards = notFinishedCards.filter(card => card.day);
		this.assignedGroups = this.initAssignedGroups(this.assignedCards);
		this.initAssignedDaysCardsObjects(this.assignedGroups, daysMechanics);

		console.log('Cards', this.cards);
		console.log('Auxiliary cards groups', this.unassignedAuxiliaryCardsGroups);
		console.log('Finished cards groups', this.finishedGroups);
		console.log('Unassigned cards groups', this.unassignedGroups);
		console.log('Unassigned types cards groups', this.unassignedTypesGroups);
		console.log('Assigned cards groups', this.assignedGroups);
		console.log('Assigned days cards groups', this.assignedDaysCardsGroups);
	}

	private static initUnassignedGroups(unassignedCards: Card[]): CardsGroup[] {
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

	private static initUnassignedTypesGroups(groups: CardsGroup[]): any {
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

	static initAssignedGroups(assignedCards: Card[]) {
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

	static checkNotifyEcommerceCards(unassignedGroups: CardsGroup[] = this.unassignedGroups): void {
		const ecommerceGroups = unassignedGroups.filter((group: CardsGroup) =>
			group.cards[0].order.creatorCode == Constants.ECOMMERCE_USER_CODE
		);
		if (ecommerceGroups.length) {
			NotificationService.notifyToast(
				new WarningToast(Constants.MESSAGE.UNASSIGNED_ECOMMERCE_GROUPS(ecommerceGroups))
			)
		}
	}

	// endregion

	// region Translate card

	static removeFromAssigned(cardsGroup: CardsGroup, day: Dayjs, mechanicCode: string): any {
		this.handleAssignedMovementGroupsLinks(
			day,
			mechanicCode,
			cardsGroup.line,
			cardsGroup.start,
			cardsGroup.end
		);
		this.handleRemoveAssignedGroup(day, mechanicCode, cardsGroup);
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
		this.handleAddAssignedGroup(day, newMechanicCode, cardsGroup);
		this.updateQuartersSaturation(day)
	}

	static removeFromUnassigned(group: CardsGroup, notify: boolean = true): void {
		this.handleUnassignedMovementGroupsLinks(group.cards[0].order.number, group.type, group.status);
		this.handleRemoveUnassignedGroup(group, notify);
	}

	static addToUnassigned(group: CardsGroup, notify: boolean = false): void {
		this.handleUnassignedMovementGroupsLinks(group.cards[0].order.number, group.type, group.status);
		this.handleAddUnassignedGroup(group, undefined, notify);
	}

	createDbCards(cards: Card[]): void {
		this.http.post(Url.cards(), cards, {params: {updateLinks: "true"}}).subscribe();
	}

	updateDbCardsPosition(cards: Card[], updateLinks = false): void {
		this.http.patch(Url.cardsPosition(), cards, {params: {updateLinks: `${updateLinks}`}}).subscribe();
	}

	updateDbCardsDuration(cards: Card[]): void {
		this.http.put(Url.cardsDuration(), cards).subscribe();
	}

	updateDbCardsLinks(cards: Card[]): void {
		this.http.patch(Url.cardsLinks(), cards).subscribe();
	}

	resetDbCardsLinks(cards: Card[]): Observable<any> {
		return this.http.patch(Url.resetCardsLinks(), cards);
	}

	static updateFinishedGroup(group: CardsGroup) {
		group.status = Constants.CARD_STATUS.FINISHED;
		for (const card of group.cards) {
			card.status = Constants.CARD_STATUS.FINISHED;
			/* Se definen las propiedades last para poder manejar los contadores de citas */
			card.setMechanicCode(undefined);
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

	static checkNewCard(groups: CardsGroup[]): boolean {
		return groups[0].cards[0].type == Constants.CARD_TYPE.AUXILIARY && !groups[0].mechanicCode;
	}

	static updatePositionProperties(
		groups: CardsGroup[], day: Dayjs, mechanicCode: string, line: number, start: Dayjs
	): void {
		groups.forEach((group: CardsGroup, i: number) => {
			group.day = day;
			group.mechanicCode = mechanicCode;
			group.line = line;
			group.setStart(i == 0 ? start : groups[i-1].end);
			group.cards.forEach((card: Card, i: number) => {
				card.setDay(day);
				card.setMechanicCode(mechanicCode);
				card.setLine(line);
				card.setStart(i == 0 ? group.start : group.cards[i-1].end);
			})
			group.setId();
		});
	}

	static updateAuxiliaryOrderCode(card: Card, group: CardsGroup, linkedIndex: number): void {
		let currentIndex = this.findCurrentAuxiliaryIndex();
		card.order.code = `${card.order.code.substring(0, 1)}${currentIndex+1}`;
		card.order.number = currentIndex + 1;
		card.linkedIndex = linkedIndex;
		card.panelId = CardsService.buildPanelId(card);

		/* Si el índice es 0 (primera ficha del grupo), se actualiza también su id para reflejar el cambio de
		*  numeración */
		if (linkedIndex == 0) {
			group.id = card.panelId;
		}
	}

	private static findCurrentAuxiliaryIndex(groups: CardsGroup[] = this.assignedGroups): number {
		const assignedAuxiliaryGroups = groups.filter((group: CardsGroup) =>
			group.cards[0].type == Constants.CARD_TYPE.AUXILIARY
		);

		let currentIndex = 0;
		assignedAuxiliaryGroups.forEach((group: CardsGroup) => {
			const index = +group.cards[0].order.code.substring(1);
			if (index > currentIndex) {
				currentIndex = index;
			}
		});
		return currentIndex;
	}

	public static buildPanelId(card: Card): string {
		return `${card.order.code}-${card.group.code}-${card.linkedIndex}-${card.divisionIndex}`;
	}

	static handleAddAssignedGroup(
		day: Dayjs,
		mechanicCode: string,
		group: CardsGroup,
		notifyImmediately: boolean = false
	): void {
		this.addAssignedGroup(day, mechanicCode, group);
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

	static handleRemoveAssignedGroup(
		day: Dayjs,
		mechanicCode: string,
		group: CardsGroup,
		notifyImmediately: boolean = false
	): void {
		this.removeAssignedGroup(day, mechanicCode, group);
		NotificationService.notifyMechanicLine(day, mechanicCode, notifyImmediately);
	}

	static handleAddUnassignedGroup(group: CardsGroup, index: number = undefined, notify: boolean = true): void {
		this.addUnassignedGroup(group, index);
		if (notify) {
			NotificationService.notifyBand(undefined, [group]);
		}
	}

	static handleRemoveUnassignedGroup(group: CardsGroup, notify: boolean = true): void {
		this.removeUnassignedGroup(group);
		if (notify) {
			NotificationService.notifyBand(undefined, [group]);
		}
	}

	static addFinishedGroup(group: CardsGroup): void {
		this.finishedGroups.push(group);
		CardPositionService.sortUnassignedGroups(this.finishedGroups);
		CardPositionService.updateUnassignedGroupsLeft(this.finishedGroups);
	}

	static removeFinishedCardsGroup(group: CardsGroup): void {
		const index = this.finishedGroups.findIndex(g => g.id == group.id);
		this.finishedGroups.splice(index, 1);
		CardPositionService.sortUnassignedGroups(this.finishedGroups);
		CardPositionService.updateUnassignedGroupsLeft(this.finishedGroups);
	}

	private static addAssignedGroup(day: Dayjs, mechanicCode: string, group: CardsGroup): void {
		/* Se busca el grupo cuya comienzo sea superior al del grupo a añadir, para hacer en la posición anterior y que
		*  la lista quede ordenada */
		const mechanicGroupStartIndex = this.findDayMechanicGroups(day, mechanicCode).findIndex((g: CardsGroup) =>
			g.start.isAfter(group.start)
		);
		if (mechanicGroupStartIndex != -1) {
			this.assignedDaysCardsGroups[day.valueOf()][mechanicCode].splice(
				mechanicGroupStartIndex, 0, group
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

	private static removeAssignedGroup(day: Dayjs, mechanicCode: string, group: CardsGroup): void {
		const index = this.assignedDaysCardsGroups[day.valueOf()][mechanicCode].findIndex((g: CardsGroup) =>
			g.id == group.id
		);
		const allGroupsIndex = this.assignedGroups.findIndex((g: CardsGroup) => g.id == group.id);
		this.assignedDaysCardsGroups[day.valueOf()][mechanicCode].splice(index, 1);
		this.assignedGroups.splice(allGroupsIndex, 1);
	}

	private static addUnassignedGroup(group: CardsGroup, index: number): void {
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

	private static removeUnassignedGroup(group: CardsGroup): void {
		const groups = this.findUnassignedGroups(group.type, group.status);
		const index = groups.findIndex(g => g.id == group.id);
		groups.splice(index, 1);
		this.unassignedGroups = this.unassignedGroups.filter((g: CardsGroup) => g.id != group.id);

		/* Además de actualizar los elementos de los grupos, se actualiza su posición */
		CardPositionService.updateUnassignedGroupsLeft(groups);
	}

	static getAddGroupDelay(group: CardsGroup): number {
		return group.mode == Constants.GROUP_MODE.DRAG
			? Constants.VALUE.CARD_MOVEMENT_DURATION - Constants.VALUE.CARD_MOVEMENT_DURATION_OFFSET : 0;
	}

	// endregion

	// region Duration

	static handleCardDurationUpdate(
		card: Card,
		widthIncrease: number,
		mechanic: Mechanic,
		handler: CardDurationHandler,
		dragWhenReducing: boolean
	): UpdateDurationInfo {
		const durationIncrease = DimensionsService.calcDurationFromWidth(widthIncrease);
		const groups = handler.findGroups(card);
		const group = this.findCardGroup(groups, card.panelId);

		/* Si la ficha se está reduciendo, no es necesario hacer comprobaciones relativas a los límites del horario
		*  u otros grupos desplazados, ya que no los afectaría */
		if (widthIncrease < 0) {
			/* Se actualiza la duración sólo si la ficha supera el valor mínimo */
			if (card.duration > Constants.VALUE.CARD_MIN_DURATION) {
				const updatedGroups = dragWhenReducing ? handler.validateDurationUpdate(group, card, mechanic) : [];
				return handler.updateDuration(card, group, durationIncrease, widthIncrease, updatedGroups);
			}
			return new UpdateDurationInfo();
		}

		/* Si se está aumentando el tamaño de una ficha, se debe comprobar si este sobresale del horario en el que
		*  está asignada */
		const updatedGroups = handler.validateDurationUpdate(group, card, mechanic);
		if (updatedGroups == undefined) {
			return new UpdateDurationInfo();
		}

		return handler.updateDuration(card, group, durationIncrease, widthIncrease, updatedGroups);
	}

	// endregion

	// region Link handlers

	static checkShowHandler(card: Card, nextGroup: CardsGroup): boolean {
		/* En las fichas auxiliares no asignadas, no se muestra el handler */
		if (card.type == Constants.CARD_TYPE.AUXILIARY && !card.mechanicCode) {
			return false
		}
		/* Si no hay ningún grupo justo a la izquierda de la ficha, no se muestra el icono para unir */
		if (!nextGroup) {
			return false;
		}

		/* Se muestra el icono sólo si el grupo a la izquierda es de la misma orden */
		return nextGroup.cards[0].order.number == card.order.number;
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

	cutCardByHalf(group: CardsGroup, groupX: number, x: number): CardsGroup[] {
		const clickedCard = CardsService.findClickedCard(group.cards, groupX, x);
		if (clickedCard.duration >= Constants.VALUE.CARD_MIN_DURATION * 1.5) {
			const newDuration = UtilsService.roundCeil(clickedCard.duration / 2, 5);
			if (newDuration * 2 > clickedCard.duration) {
				const mechanic = MechanicsService.findMechanic(group.day, group.mechanicCode);
				const translatedGroups = new AssignedCardDurationHandler().validateDurationUpdate(
					group, clickedCard, mechanic
				);
				/* Sólo se actualiza la duración si, a desplazar otros grupos (al redondear hacia arriba al dividir, se
				*  podrían añadir 5 minutos a una ficha y esta desplazar otras) estos no se salen de los horarios */
				if (translatedGroups != undefined) {
					this.divideCard(clickedCard, group, newDuration, newDuration, translatedGroups);
					return translatedGroups;
				}
			} else {
				this.divideCard(clickedCard, group, newDuration, newDuration);
			}
		}
		return [];
	}

	private static findClickedCard(cards: Card[], groupX: number, xLeft: number): Card {
		return cards.find((card: Card, index: number) => {
			const leftCardsDuration = CardsService.findCardsDuration(cards.slice(0, index+1));
			const leftCardsWidth = DimensionsService.calcWidthFromDuration(leftCardsDuration);
			return groupX + leftCardsWidth > xLeft;
		});
	}

	private static findCardsDuration(cards: Card[]): number {
		return UtilsService.sum(cards, Constants.PROPERTY.DURATION);
	}

	divideCard(
		card: Card,
		group: CardsGroup,
		leftCardDuration: number,
		rightCardDuration: number,
		translatedGroups: CardsGroup[] = [],
		updateDb: boolean = true
	): void {
		CardsService.updateCard(card, leftCardDuration);
		const newRightCard = CardsService.createCard(card, card.end, rightCardDuration);
		const dividedCards = this.updateDividedCards(card, newRightCard);
		const groupTranslatedCards = this.updateGroups(group, card, newRightCard);
		const allUpdatedCards = dividedCards.concat(groupTranslatedCards);

		const translatedCards = [];
		translatedGroups.forEach((g: CardsGroup) => {
			g.cards.forEach((c: Card) => {
				c.setStart(c.start.add(5, Constants.DAY_JS.m));
				translatedCards.push(c);
			});
			g.setStart(g.start.add(5, Constants.DAY_JS.m));
		});
		if (updateDb) {
			this.updateDividedDbCards(allUpdatedCards, translatedCards);
		}
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

		CardsService.updateDivisionCardsLinks(dividedCards);
		dividedCards.splice(0, 0, dividedCards.splice(1, 1)[0]);
		return dividedCards;
	}

	static resetCardsLinks(cards: Card[]): void {
		cards.forEach((card: Card, i: number) => {
			card.linkedPrevious = undefined;
			card.linkedNext = undefined;
		});
	}

	private static updateDivisionCardsLinks(cards: Card[]): void {
		cards.forEach((card: Card, i: number) => {
			if (i != 0) {
				card.dividedPrevious = cards[i-1].clone();
			}
			if (i != cards.length - 1) {
				card.dividedNext = cards[i+1].clone();
			}
		});
	}

	static updateCardsLinks(cards: Card[]): void {
		cards.forEach((card: Card, i: number) => {
			if (i != 0) {
				card.linkedPrevious = cards[i-1].clone();
			}
			if (i != cards.length - 1) {
				card.linkedNext = cards[i+1].clone();
			}
		});
	}

	private updateGroups(group: CardsGroup, card: Card, newRightCard: Card): Card[] {
		const cardGroupIndex = group.cards.findIndex((c: Card) => c.panelId == card.panelId);
		const rightDividedCards = group.cards.slice(cardGroupIndex + 1);
		group.removeCards(0, cardGroupIndex + 1);

		/* Si se amplía la duración de las fichas, puede tener que actualizarse el comienzo de otras del nuevo grupo */
		const groupTranslatedCards = rightDividedCards.length
			? CardsService.updateRightGroupCardsOffset(newRightCard, rightDividedCards) : [];
		const newGroup = new CardsGroup(
			[newRightCard].concat(rightDividedCards),
			DimensionsService.calcLeftFromStart(group.end)
		);
		CardsService.updateLinkedLinks(newGroup, group);
		if (card.day) {
			CardsService.handleAddAssignedGroup(card.day, card.mechanicCode, newGroup);
		} else {
			CardsService.handleAddUnassignedGroup(newGroup);
		}
		return groupTranslatedCards;
	}

	private static updateRightGroupCardsOffset(newRightCard: Card, rightDividedCards: Card[]): Card[] {
		/* Esta condición se cumple si al desplazar una ficha central (con otras agrupadas a su derecha) se divide a
		*  la mitad, y al redondear su duración es 5 minutos mayor. Estas fichas de la derecha deben corregir su inicio
		*  con esos 5 minutos de retraso */
		const offset = newRightCard.end.diff(rightDividedCards[0].start, Constants.DAY_JS.m);
		if (offset > 0) {
			rightDividedCards.forEach((card: Card) => {
				card.setStart(card.start.add(offset, Constants.DAY_JS.m));
			});
			return rightDividedCards;
		}
		return [];
	}

	private static updateLinkedLinks(newGroup: CardsGroup, group: CardsGroup): void {
		this.updateCardsLinks(newGroup.cards);
		this.updateCardsLinks(group.cards);
	}

	private updateDividedDbCards(allUpdatedCards: Card[], translatedCards: Card[]): void {
		this.http.post(Url.cardsDivision(), allUpdatedCards).subscribe();
		if (translatedCards.length) {
			this.updateDbCardsPosition(translatedCards);
		}
	}

	// endregion

	// region Auxiliary replacement

	replaceGroup(group: CardsGroup, auxiliaryGroup: CardsGroup = CardsService.auxiliaryGroupToReplace): void {
		/* Los reemplazos siempre son de fichas auxiliares ya asignadas, por fichas no asignadas */
		const originDropzone: UnassignedDropzone = <UnassignedDropzone> DropzoneService.findDropzone(group.cards[0]);
		const destinyDropzone: AssignedDropzone = <AssignedDropzone> DropzoneService.findDropzone(auxiliaryGroup.cards[0]);

		const auxiliaryGroups = CardsService.findAuxiliaryGroups(auxiliaryGroup.cards[0].order.code);
		const groups = CardsService.unassignedGroups.filter((g: CardsGroup) =>
			g.cards[0].order.code == group.cards[0].order.code
		);
		const auxiliaryReplacements = CardsService.findAuxiliaryReplacement(auxiliaryGroups, groups);
		console.log('Auxiliary replacements', auxiliaryReplacements);
		const notValidatedAuxReplacements = this.handleAuxiliaryReplacements(
			auxiliaryReplacements, originDropzone, destinyDropzone
		);

		if (notValidatedAuxReplacements.length) {
			console.log('Not validated auxiliary replacements', notValidatedAuxReplacements);
			notValidatedAuxReplacements.forEach((auxReplacement: AuxiliaryReplacement) => {
				const message = auxReplacement.validationInfo
					? Constants.MESSAGE.NOT_REPLACED_ALL_CARDS(auxReplacement.differentCards)
					: Constants.MESSAGE.NO_REPLACEMENT_SPACE(auxReplacement.group)
				NotificationService.notifyToast(new WarningToast(message));
			});
		}
	}

	private handleAuxiliaryReplacements(
		auxiliaryReplacements: AuxiliaryReplacement[],
		originDropzone: UnassignedDropzone,
		destinyDropzone: AssignedDropzone
	): AuxiliaryReplacement[] {
		const notValidatedAuxReplacements = [];
		auxiliaryReplacements.forEach((auxiliaryReplacement: AuxiliaryReplacement) => {
			const auxGroup = auxiliaryReplacement.auxiliaryGroup;
			const duration = CardsService.findCardsDuration(auxiliaryReplacement.coincidentCards);
			const validateInfo = destinyDropzone.validateOverlappedGroups(
				auxGroup,
				CardsService.findDayMechanicGroups(auxGroup.day, auxGroup.mechanicCode),
				auxGroup.line,
				auxGroup.start,
				auxGroup.start.add(duration, Constants.DAY_JS.m),
				destinyDropzone.interval
			);
			if (validateInfo) {
				/* Si el número de fichas coincide, el grupo al completo reemplaza el auxiliar */
				if (auxiliaryReplacement.coincidentCards.length == auxiliaryReplacement.group.cards.length) {
					this.deleteReplacedGroup(auxGroup, destinyDropzone);
					CardsService.updateReplacementGroup(
						auxiliaryReplacement.group,
						validateInfo.groups,
						auxGroup.line,
						validateInfo.newStart,
						originDropzone,
						destinyDropzone
					);
				} else {
					/* Si no coincide el número de fichas, hay que formar nuevos grupos con las fichas que sustituirán
					*  a las auxiliares */
					const [group, newGroup] = CardsService.buildNewReplacementGroups(auxiliaryReplacement);
					this.deleteReplacedGroup(auxGroup, destinyDropzone);
					this.resetDbCardsLinks(group.cards.concat(newGroup.cards)).subscribe(() => {
						CardsService.updateReplacementGroup(
							newGroup,
							validateInfo.groups,
							auxGroup.line,
							validateInfo.newStart,
							originDropzone,
							destinyDropzone
						);
					});
					notValidatedAuxReplacements.push(auxiliaryReplacement);
				}
			} else {
				auxiliaryReplacement.validationInfo = validateInfo;
				notValidatedAuxReplacements.push(auxiliaryReplacement);
			}
		});
		return notValidatedAuxReplacements;
	}

	private static findAuxiliaryGroups(orderCode: string, groups: CardsGroup[] = this.assignedGroups): CardsGroup[] {
		return groups.filter((group: CardsGroup) => group.cards[0].order.code == orderCode);
	}

	private static findAuxiliaryReplacement(
		auxiliaryGroups: CardsGroup[], groups: CardsGroup[]
	): AuxiliaryReplacement[] {
		return auxiliaryGroups.map((auxGroup: CardsGroup) => {
			const auxColors = auxGroup.cards.map((c: Card) => c.group.color.code);
			const coincidentGroup = groups.find((group: CardsGroup) =>
				group.cards.find((c: Card) => auxColors.indexOf(c.group.color.code) != -1) != undefined
			);
			const coincidentCards = [];
			if (coincidentGroup) {
				auxColors.forEach((color: string) => {
					const card = coincidentGroup.cards.find((c: Card) => c.group.color.code == color);
					if (card) {
						coincidentCards.push(card);
					}
				});
			}
			return new AuxiliaryReplacement(auxGroup, coincidentGroup, coincidentCards);
		})
	}

	private static buildNewReplacementGroups(auxiliaryReplacement: AuxiliaryReplacement): CardsGroup[] {
		/* Se gestionan las acciones relacionadas con la actualización del grupo no asignado */
		const group = this.handleReplacementGroupUpdate(
			auxiliaryReplacement.group, auxiliaryReplacement.coincidentCards
		);
		const newGroup = this.handleReplacementGroupCreation(auxiliaryReplacement.coincidentCards);
		return [group, newGroup];
	}

	static handleReplacementGroupUpdate(group: CardsGroup, coincidentCards: Card[]): CardsGroup {
		CardsService.resetCardsLinks(group.cards);
		group.removeGroupCards(coincidentCards);
		CardsService.updateCardsLinks(group.cards);
		/* Al quitar fichas de agrupaciones no asignadas, es necesario actualizar la propiedad 'left' para
		*  los de su derecha se coloquen en la posición correcta */
		CardPositionService.updateUnassignedGroupsLeft(
			CardsService.findUnassignedGroups(group.cards[0].type, group.cards[0].status)
		);
		return group;
	}

	static handleReplacementGroupCreation(coincidentCards: Card[]): CardsGroup {
		const newGroup = new CardsGroup(coincidentCards);
		CardsService.updateCardsLinks(newGroup.cards);
		return newGroup;
	}

	static updateReplacementGroup(
		group: CardsGroup,
		groups: CardsGroup[],
		line: number,
		newStart: Dayjs,
		originDropzone: UnassignedDropzone,
		destinyDropzone: AssignedDropzone
	): void {
		originDropzone.removeGroup(group);
		const allGroups = [group].concat(groups);
		destinyDropzone.updateProperties(allGroups, newStart, line, destinyDropzone.mechanic);
		destinyDropzone.addGroup(group, allGroups);
	}

	private deleteReplacedGroup(groupToReplace: CardsGroup, destinyDropzone: Dropzone): void {
		destinyDropzone.removeGroup(groupToReplace);
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

	// region Order

	static updateCardOrder(card: Card, order: Order, vehicle: Vehicle): void {
		card.order = order;
		card.vehicle = vehicle;
	}

	// endregion

	syncJpdv(): Observable<any> {
		return this.http.post(Url.syncJpdv(), undefined);
	}

}
