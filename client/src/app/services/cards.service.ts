import {Injectable} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {Card} from "../objects/card";
import {TimeService} from "./time.service";
import {DaysService} from "./days.service";

import {CardsGroup} from "../objects/cards-group";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/internal/Subject";
import {environment} from "../../environments/environment";
import {UnassignedCardUpdate} from "../objects/update-cards/unassigned-card-update";
import {UnassignedCardUpdateTrigger} from "../objects/update-cards/unassigned-card-update-trigger";
import {Constants} from "../objects/constants";
import {UtilsService} from "./utils.service";
import {Schedule} from "../objects/schedule";
import {DayCardUpdate} from "../objects/update-days-cards/day-card-update";
import {DayCardUpdateTrigger} from "../objects/update-days-cards/day-card-update-trigger";
import {AppointmentsService} from "./appointments.service";
import {GroupedTypeCards} from "../objects/grouped-type-cards";
import {UnassignedTypeSection} from "../objects/unassigned-sections/unassigned-type-section";
import {UnassignedFinishedSection} from "../objects/unassigned-sections/unassigned-finished-section";
import {UnassignedSection} from "../objects/unassigned-sections/unassigned-section";

@Injectable({
	providedIn: 'root'
})
export class CardsService {

	private cards: Card[];
	private unassignedCards: Card[];
	private assignedCards: Card[];

	private assignedCardsGroupsSubject: Subject<DayCardUpdate>;
	private _assignedCardsGroups$: Observable<DayCardUpdate>;

	private unassignedCardsGroupsSubject: Subject<UnassignedCardUpdate>;
	private _unassignedCardsGroups$: Observable<UnassignedCardUpdate>;

	private _assignedDaysCardsGroups$: any;
	private _assignedDaysCardsGroups: any;
	private _assignedCardsGroups: CardsGroup[];
	private _finishedCardsGroups: CardsGroup[];
	private _unassignedCardsGroups: CardsGroup[];
	private _unassignedTypesCardsGroups: GroupedTypeCards;

	private _unassignedSections: UnassignedSection[];

	private _overlappedGroups: CardsGroup[];

	constructor(
		private daysService: DaysService,
		private timeService: TimeService,
		private appointmentsService: AppointmentsService,
		private http: HttpClient
	) {
		this.overlappedGroups = [];

		this.unassignedSections = [
			new UnassignedTypeSection(this, Constants.CARD_TYPE.TODAY),
			new UnassignedTypeSection(this, Constants.CARD_TYPE.APPOINTMENT),
			new UnassignedTypeSection(this, Constants.CARD_TYPE.PENDING),
			new UnassignedFinishedSection(this, Constants.CARD_STATUS.FINISHED)
		];
	}

	// region Getters / setters

	get unassignedCardsGroups(): CardsGroup[] {
		return this._unassignedCardsGroups;
	}

	set unassignedCardsGroups(value: CardsGroup[]) {
		this._unassignedCardsGroups = value;
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

	get assignedCardsGroups$(): Observable<DayCardUpdate> {
		return this._assignedCardsGroups$;
	}

	set assignedCardsGroups$(value: Observable<DayCardUpdate>) {
		this._assignedCardsGroups$ = value;
	}

	get assignedDaysCardsGroups(): any {
		return this._assignedDaysCardsGroups;
	}

	set assignedDaysCardsGroups(value: any) {
		this._assignedDaysCardsGroups = value;
	}

	get overlappedGroups(): CardsGroup[] {
		return this._overlappedGroups;
	}

	set overlappedGroups(value: CardsGroup[]) {
		this._overlappedGroups = value;
	}

	get unassignedCardsGroups$(): Observable<UnassignedCardUpdate> {
		return this._unassignedCardsGroups$;
	}

	set unassignedCardsGroups$(value: Observable<UnassignedCardUpdate>) {
		this._unassignedCardsGroups$ = value;
	}

	get unassignedSections(): UnassignedSection[] {
		return this._unassignedSections;
	}

	set unassignedSections(value: UnassignedSection[]) {
		this._unassignedSections = value;
	}

	// endregion

	// region Init

	init(cards: Card[]) {
		this.cards = cards;

		const finishedCards = this.cards.filter(card => card.status == Constants.CARD_STATUS.FINISHED);
		const notFinishedCards = this.cards.filter(card => card.status != Constants.CARD_STATUS.FINISHED);

		this.finishedCardsGroups = this.initAssignedCardsGroups(finishedCards);

		this.unassignedCards = notFinishedCards.filter(card => !card.day);
		this.unassignedCardsGroups = this.initUnassignedCardsGroups(this.unassignedCards);
		this.unassignedTypesCardsGroups = this.initUnassignedTypesCardsGroups(this.unassignedCardsGroups);

		this.assignedCards = notFinishedCards.filter(card => card.day);
		this.assignedCardsGroups = this.initAssignedCardsGroups(this.assignedCards);
		this.initAssignedDaysCardsObjects(this.assignedCardsGroups, this.daysService.daysMechanics);
		this.assignedCardsGroupsSubject = new Subject<DayCardUpdate>();
		this.assignedCardsGroups$ = this.assignedCardsGroupsSubject.asObservable();

		this.unassignedCardsGroupsSubject = new Subject<UnassignedCardUpdate>();
		this.unassignedCardsGroups$ = this.unassignedCardsGroupsSubject.asObservable();

		console.log('Cards', this.cards);
		console.log('Finished cards groups', this.finishedCardsGroups);
		console.log('Unassigned cards groups', this.unassignedCardsGroups);
		console.log('Unassigned types cards groups', this.unassignedTypesCardsGroups);
		console.log('Assigned cards groups', this.assignedCardsGroups);
		console.log('Assigned days cards groups', this.assignedDaysCardsGroups);
	}

	private initUnassignedCardsGroups(unassignedCards: Card[]): CardsGroup[] {
		UtilsService.sort(unassignedCards, (c) => c.order.code);
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
			const alreadyProcessedCard = processedCards.find(c => c.id == card.id);
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

	removeFromFinished(group: CardsGroup): any {
		// this.handleAssignedMovementGroupsLinks(
		// 	day,
		// 	mechanicCode,
		// 	cardsGroup.lastLine,
		// 	cardsGroup.lastStart,
		// 	cardsGroup.lastEnd
		// );
		this.handleRemoveFinishedCardsGroup(group);
	}

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
			cardsGroup.lastLine,
			cardsGroup.lastStart,
			cardsGroup.lastEnd
		);
		this.handleRemoveAssignedCardsGroup(day, mechanicCode, cardsGroup);
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
		groupsToUpdate: CardsGroup[],
		cardsGroup: CardsGroup,
		day: Date = undefined,
		newMechanicCode: string,
		updateDb: boolean = true
	) {
		cardsGroup.status = Constants.CARD_STATUS.DEFAULT;
		cardsGroup.cards.forEach((card: Card) => {
			card.setDay(day);
			card.setMechanicCode(newMechanicCode);
			card.status = Constants.CARD_STATUS.DEFAULT;
		});

		// /* Si en un terminal se mueven fichas y hay solapadas, y después se actualiza en tiempo real de otro
		// *  terminal distinto, las primeras fichas solapadas no deben tenerse en cuenta en este último caso. Por lo
		// *  tanto, la lista debe resetearse una vez usada */
		// this.overlappedGroups = [];
		// this.appointmentsService.updateAppointmentsCounter(cardsGroup.cards);
		if (updateDb) {
			this.http.put(
				`${environment.serverUrl}/panel/cards/position`,
				[].concat(...groupsToUpdate.map(g => g.cards))
			).subscribe();
		}
	}

	updateFinishedGroup(group: CardsGroup) {
		group.status = Constants.CARD_STATUS.FINISHED;
		for (const card of group.cards) {
			card.status = Constants.CARD_STATUS.FINISHED;
		}
		this.resetCardsGroup(group);
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

	updateAppointmentsPanel(group: CardsGroup): void {
		this.appointmentsService.updateAppointmentsCounter(group.cards);
	}

	removeFromOrigin(cardsGroup: CardsGroup): any {
		const card = cardsGroup.cards[0];
		if (card.mechanicCode) {
			this.handleAssignedMovementGroupsLinks(
				card.day,
				card.mechanicCode,
				cardsGroup.lastLine,
				cardsGroup.lastStart,
				cardsGroup.lastEnd
			);

			this.handleRemoveAssignedCardsGroup(card.day, card.mechanicCode, cardsGroup);
		} else {
			this.handleUnassignedMovementGroupsLinks(cardsGroup.cards[0].order.number, cardsGroup.type, cardsGroup.status);
			this.handleRemoveUnassignedCardsGroup(cardsGroup);
		}
	}

	updateTranslatedCards(
		cardsGroup: CardsGroup,
		day: Date = undefined,
		newMechanicCode: string = undefined,
		updateDb: boolean = true
	) {
		if (newMechanicCode) {
			cardsGroup.cards.forEach(card => {
				card.setDay(day);
				card.setMechanicCode(newMechanicCode);
			});
		} else {
			this.resetCardsGroup(cardsGroup);
		}

		this.addToDestiny(cardsGroup, day, newMechanicCode);
		this.appointmentsService.updateAppointmentsCounter(cardsGroup.cards);
		if (updateDb) {
			this.http.put(
				`${environment.serverUrl}/panel/cards/position`,
				cardsGroup.cards.concat(...this.overlappedGroups.map(g => g.cards))
			).subscribe();

			/* Si en un terminal se mueven fichas y hay solapadas, y después se actualiza en tiempo real de otro
			*  terminal distinto, las primeras fichas solapadas no deben tenerse en cuenta en este último caso. Por lo
			*  tanto, la lista debe resetearse una vez usada */
			this.overlappedGroups = [];
		}
	}

	updatePosition(group: CardsGroup, day: Date, line: number, left: number) {
		/* Sólo se puede mover un grupo a la vez, ya que es lo que se arrastra cuando se desplazan fichas por el
		*  panel; sin embargo, en caso de haber solapamientos, son varios los que deben ser actualizados. Por ese
		*  motivo se usa un array en lugar de un sólo grupo */
		group.left = left;

		group.cards.forEach((card, index) => {
			const leftCardsDuration = UtilsService.sum(group.cards.slice(0, index), 'duration');
			card.setLine(line);
			card.setStart(
				this.timeService.calcStart(group.left + this.timeService.calcWidthFromDuration(leftCardsDuration),
				day
			));
			// card.end = UtilsService.addMinutes(card.start, card.duration);
		});
		group.line = line;
		group.start = group.cards[0].start;
		group.end = group.cards[group.cards.length - 1].end;
	}

	handleCardDurationUpdate(card: Card, widthIncrease: number): Card[] {
		const durationIncrease = this.timeService.calcDurationFromWidth(widthIncrease);
		const group = this.findCardGroup(this.findLineGroups(card.day, card.mechanicCode, card.line), card.id);

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
		const schedule = this.daysService.findMechanic(card.day, card.mechanicCode).schedule;
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
		card.setWidth(widthIncrease, durationIncrease);
		group.cards.forEach(c => {
			if (c.id != card.id && c.start > card.start) {
				c.start = UtilsService.addMinutes(c.start, durationIncrease);
				c.end = UtilsService.addMinutes(c.start, c.duration);
			}
		});

		group.end = UtilsService.addMinutes(group.end, durationIncrease);
		this.notifyAssigned();
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
		this.http.put(`${environment.serverUrl}/panel/cards/duration`, cards).subscribe();
	}

	handleAddFinishedCardsGroup(group: CardsGroup): void {
		this.addFinishedCardsGroup(group);
		this.notifyUnassigned();
	}

	handleRemoveFinishedCardsGroup(group: CardsGroup): void {
		this.removeFinishedCardsGroup(group);
		this.notifyUnassigned();
	}

	handleAddAssignedCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		this.addAssignedCardsGroup(day, mechanicCode, group);
		this.notifyAssigned();
	}

	handleRemoveAssignedCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		this.removeAssignedCardsGroup(day, mechanicCode, group);
		this.notifyAssigned();
	}

	handleAddUnassignedCardsGroup(group: CardsGroup): void {
		this.addUnassignedCardsGroup(group);
		this.notifyUnassigned(new UnassignedCardUpdateTrigger(group));
	}

	handleRemoveUnassignedCardsGroup(group: CardsGroup, notify: boolean = true): void {
		this.removeUnassignedCardsGroup(group);
		if (notify) {
			this.notifyUnassigned(new UnassignedCardUpdateTrigger(group));
		}
	}

	findLeftNextCard(card: Card): Card {
		return card.start ?
			this.findLeftAssignedNextCard(card.day, card.mechanicCode, card.line, card.order.number, card.start) :
			this.findLeftUnassignedNextCard(card.id, card.type, card.status);
	}

	findRightNextCard(card: Card): Card {
		return card.start ?
			this.findRightAssignedNextCard(card.day, card.mechanicCode, card.line, card.order.number, card.end) :
			this.findRightUnassignedNextCard(card.id, card.type, card.status);
	}

	// endregion

	// region Update left

	unlink(card: Card, direction: string, updateDb: boolean = true): void {
		let findGroups, createGroup, handleUpdate;
		if (card.start) {
			findGroups = () => this.findLineGroups(card.day, card.mechanicCode, card.line);
			createGroup = (cards, group, cardIndex, offset) => new CardsGroup(cards, this.timeService.calcLeftFromStart(group.cards[cardIndex + offset].start));
			handleUpdate = (newGroup) => this.handleAddAssignedCardsGroup(card.day, card.mechanicCode, newGroup)
		} else {
			findGroups = () => this.unassignedTypesCardsGroups[card.type];
			createGroup = (cards) => new CardsGroup(cards);
			handleUpdate = (newGroup) => this.handleAddUnassignedCardsGroup(newGroup)
		}

		/* Se obtienen los grupos de la línea o sin asignar, y a continuación el grupo al que pertence la ficha */
		const cardsGroups = findGroups();
		const group = this.findCardGroup(cardsGroups, card.id);

		/* Se actualizan las propiedades de las fichas */
		const cardIndex = group.cards.findIndex(c => c.id == card.id);
		let offset = this.updateLinks(card, group, cardIndex, direction);

		/* Se definen los nuevos grupos, tanto el nuevo como la actualización de fichas del antiguo */
		const newGroup = createGroup(
			group.cards.slice(cardIndex + offset, group.cards.length),
			group, cardIndex, offset
		);
		group.removeCards(cardIndex + offset, group.cards.length - (cardIndex + offset));

		handleUpdate(newGroup);
		if (updateDb) {
			this.http.put(
				`${environment.serverUrl}/panel/cards/links`,
				[group.cards[group.cards.length - 1], newGroup.cards[0]]
			).subscribe();
		}
	}

	// endregion

	// region Update width

	updateLinks(card: Card, group: CardsGroup, cardIndex: number, direction: string): number {
		let offset;
		if (direction == Constants.NEXT_CARD_DIRECTION.RIGHT) {
			card.linkedNextId = undefined;
			group.cards[cardIndex + 1].linkedPreviousId = undefined;
			offset = 1;
		} else {
			card.linkedPreviousId = undefined;
			group.cards[cardIndex - 1].linkedNextId = undefined;
			offset = 0;
		}
		return offset;
	}

	linkPrevious(card: Card): void {
		let findGroups, handleUpdate;
		if (card.start) {
			findGroups = () => this.findLineGroups(card.day, card.mechanicCode, card.line);
			handleUpdate = (group) => this.handleRemoveAssignedCardsGroup(card.day, card.mechanicCode, group)
		} else {
			findGroups = () => this.unassignedTypesCardsGroups[card.type];
			handleUpdate = (group) => this.handleRemoveUnassignedCardsGroup(group)
		}

		const groups = findGroups();
		const group = this.findCardGroup(groups, card.id);
		const leftGroup = this.findLeftGroup(groups, group.id);

		leftGroup.cards[leftGroup.cards.length - 1].linkedNextId = card.id;
		card.linkedPreviousId = leftGroup.cards[leftGroup.cards.length - 1].id;

		const lastLeftGroupCardIndex = leftGroup.cards.length - 1;
		leftGroup.addCards(group.cards);
		handleUpdate(group);
		this.http.put(
			`${environment.serverUrl}/panel/cards/links`,
			leftGroup.cards.slice(lastLeftGroupCardIndex)
		).subscribe();
	}

	linkNext(card: Card, updateDb: boolean = true): void {
		let findGroups, handleUpdate;
		if (card.start) {
			findGroups = () => this.findLineGroups(card.day, card.mechanicCode, card.line);
			handleUpdate = (group) => this.handleRemoveAssignedCardsGroup(card.day, card.mechanicCode, group)
		} else {
			findGroups = () => this.unassignedTypesCardsGroups[card.type];
			handleUpdate = (group) => this.handleRemoveUnassignedCardsGroup(group)
		}
		const groups = findGroups();
		const group = this.findCardGroup(groups, card.id);
		const rightGroup = this.findRightGroup(groups, group.id);

		rightGroup.cards[0].linkedPreviousId = card.id;
		card.linkedNextId = rightGroup.cards[0].id;

		const lastGroupCardIndex = group.cards.length - 1;
		group.addCards(rightGroup.cards);
		handleUpdate(rightGroup);
		if (updateDb) {
			this.http.put(
				`${environment.serverUrl}/panel/cards/links`,
				group.cards.slice(lastGroupCardIndex)
			).subscribe();
		}
	}

	getAssignedCardsGroups(day: Date, mechanicCode: string): CardsGroup[] {
		return this.assignedDaysCardsGroups[day.getTime()][mechanicCode];
	}

	findLineGroups(day: Date, mechanicCode: string, line: number): CardsGroup[] {
		return this.getAssignedCardsGroups(day, mechanicCode).filter(group => group.line == line);
	}

	findLineCards(day: Date, mechanicCode: string, line: number): Card[] {
		const groups = this.getAssignedCardsGroups(day, mechanicCode).filter(group => group.cards[0].line == line);
		return [].concat(...groups.map(group => group.cards));
	}

	// endregion

	// region Global cards map

	findUnassignedGroups(type: string, status: string): CardsGroup[] {
		let section = this.unassignedSections.find(section => section.name == status);
		section = section ? section : this.unassignedSections.find(section => section.name == type);
		return section.findGroups();
	}

	findCardGroup(groups: CardsGroup[], cardId: number): CardsGroup {
		return groups.find(group => group.cards.find(card => card.id == cardId) != undefined);
	}

	private findPreviousCards(cards: Card[], card: Card, linkedCards: Card[] = []) {
		if (card.linkedPreviousId) {
			const previousCard = cards.find(c => c.id == card.linkedPreviousId);
			linkedCards.push(previousCard);
			this.findPreviousCards(cards, previousCard, linkedCards);
		}
		return linkedCards;
	}

	private findNextCards(cards: Card[], card: Card, linkedCards: Card[] = []) {
		if (card.linkedNextId) {
			const nextCard = cards.find(c => c.id == card.linkedNextId);
			linkedCards.push(nextCard);
			this.findNextCards(cards, nextCard, linkedCards);
		}
		return linkedCards;
	}

	private initAssignedDaysCardsObjects(assignedCardsGroups: CardsGroup[], daysMechanics: any): any {
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

	private cardInGroup(cards: Card[], card: Card): boolean {
		return cards.find(groupCard =>
			groupCard.linkedPreviousId == card.id || groupCard.linkedNextId == card.id
		) != undefined;
	}

	// endregion

	// region Link handlers checks

	private addToDestiny(cardsGroup: CardsGroup, day: Date, newMechanicCode: string): void {
		if (newMechanicCode) {
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
		} else {
			this.handleUnassignedMovementGroupsLinks(cardsGroup.cards[0].order.number, cardsGroup.type, cardsGroup.status);
			this.handleAddUnassignedCardsGroup(cardsGroup);
		}
	}

	private handleAssignedMovementGroupsLinks(day: Date, mechanicCode: string, line: number, start: Date, end: Date): void {
		const groups = this.findLineGroups(day, mechanicCode, line);
		const leftGroup = this.findLeftAssignedGroup(groups, start);
		const rightGroup = this.findRightAssignedGroup(groups, end);

		if (leftGroup) {
			leftGroup.cards[leftGroup.cards.length - 1].possibleLinkedNextId =
				!leftGroup.cards[leftGroup.cards.length - 1].possibleLinkedNextId;
		}
		if (rightGroup) {
			rightGroup.cards[0].possibleLinkedPreviousId = !rightGroup.cards[0].possibleLinkedPreviousId;
		}
	}

	private handleUnassignedMovementGroupsLinks(orderNumber: number, type: string, status: string): void {
		const groups = this.findUnassignedGroups(type, status);
		const orderGroups = this.findOrderGroups(groups, orderNumber);
		orderGroups.forEach(group => {
			group.cards.forEach(card => {
				card.possibleLinkedPreviousId = !card.possibleLinkedPreviousId;
				card.possibleLinkedNextId = !card.possibleLinkedNextId;
			});
		});
	}

	// endregion

	// region Link handlers actions

	private addFinishedCardsGroup(group: CardsGroup): void {
		this.finishedCardsGroups.push(group);
		UtilsService.sort(this.finishedCardsGroups, (g) => g.cards[0].order.code);
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

	private addUnassignedCardsGroup(group: CardsGroup): void {
		this.unassignedTypesCardsGroups[group.type] = this.unassignedTypesCardsGroups[group.type].concat([group]);
		UtilsService.sort(this.unassignedTypesCardsGroups[group.type], (g) => g.cards[0].order.code);
	}

	private removeUnassignedCardsGroup(group: CardsGroup): void {
		const index = this.unassignedTypesCardsGroups[group.type].findIndex(g => g.id == group.id);
		this.unassignedTypesCardsGroups[group.type].splice(index, 1);
	}

	// endregion

	// region Find cards and groups

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

	private findLeftUnassignedNextCard(id: number, type: string, status: string): Card {
		const groups = this.findUnassignedGroups(type, status);
		const group = this.findCardGroup(groups, id);
		const cardIndex = group.cards.findIndex(card => card.id == id);
		if (cardIndex > 0) {
			return group.cards[cardIndex - 1];
		} else {
			const leftGroup = this.findLeftOrderGroup(groups, group.id, group.cards[0].order.number);
			return leftGroup ? leftGroup.cards[leftGroup.cards.length - 1] : undefined;
		}
	}

	private findRightUnassignedNextCard(id: number, type: string, status: string): Card {
		const groups = this.findUnassignedGroups(type, status);
		const group = this.findCardGroup(groups, id);
		const cardIndex = group.cards.findIndex(card => card.id == id);
		if (cardIndex < group.cards.length - 1) {
			return group.cards[cardIndex + 1];
		} else {
			const rightGroup = this.findRightOrderGroup(groups, group.id, group.cards[0].order.number);
			return rightGroup ? rightGroup.cards[0] : undefined;
		}
	}

	private findLeftOrderGroup(groups: CardsGroup[], groupId: number, orderNumber: number): CardsGroup {
		const group = this.findLeftGroup(groups, groupId);
		return group && group.cards[0].order.number == orderNumber ? group : undefined;
	}

	private findRightOrderGroup(groups: CardsGroup[], groupId: number, orderNumber: number): CardsGroup {
		const group = this.findRightGroup(groups, groupId);
		return group && group.cards[0].order.number == orderNumber ? group : undefined;
	}

	private findLeftGroup(groups: CardsGroup[], groupId): CardsGroup {
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
			if (!a.linkedPreviousId || !b.linkedNextId) {
				return -1
			}
			else if (!a.linkedNextId || !b.linkedPreviousId) {
				return 1
			}
			return 0;
		});
		return cards;
	}

	// endregion

	// region Notify

	notifyAll(): void {
		this.notifyUnassigned();
		this.notifyAssigned();
	}

	notifyUnassigned(cardUpdate: UnassignedCardUpdate = new UnassignedCardUpdateTrigger()): void {
		this.unassignedCardsGroupsSubject.next(cardUpdate);
	}

	notifyAssigned(dayCardUpdate: DayCardUpdate = new DayCardUpdateTrigger()): void {
		this.assignedCardsGroupsSubject.next(dayCardUpdate);
	}

	// endregion

}
