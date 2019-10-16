import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Card} from "../objects/card";
import {Mechanic} from "../objects/mechanic";
import {TimeService} from "./time.service";
import {UtilsService} from "./utils.service";
import {DaysService} from "./days.service";
import {Order} from "../objects/order";

import {CardsGroup} from "../objects/cards-group";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/internal/Subject";
import {environment} from "../../environments/environment";
import {CardUpdate} from "../objects/update-cards/card-update";
import {CardUpdateAdd} from "../objects/update-cards/card-update-add";
import {CardUpdateRemove} from "../objects/update-cards/card-update-remove";
import {CardUpdateWidth} from "../objects/update-cards/card-update-width";
import {Constants} from "../objects/constants";

@Injectable({
	providedIn: 'root'
})
export class CardsService {

	private cards: Card[];
	private unassignedCards: Card[];
	private _unassignedCardsGroups: CardsGroup[];
	private assignedCards: Card[];
	private assignedCardsGroups: CardsGroup[];
	private _assignedDaysCardsGroups: any;

	private unassignedCardsGroupsSubject: Subject<CardUpdate>;
	private _unassignedCardsGroups$: Observable<CardUpdate>;

	private assignedDaysCardsGroupsSubjects: any;
	private _assignedDaysCardsGroups$: any;

	private maxScheduleWidthSubscription: any;

	constructor(
		private daysService: DaysService,
		private timeService: TimeService,
		private http: HttpClient
	) {	}

	// region Getters / setters

	get unassignedCardsGroups(): CardsGroup[] {
		return this._unassignedCardsGroups;
	}

	set unassignedCardsGroups(value: CardsGroup[]) {
		this._unassignedCardsGroups = value;
	}

	get unassignedCardsGroups$(): Observable<CardUpdate> {
		return this._unassignedCardsGroups$;
	}

	set unassignedCardsGroups$(value: Observable<CardUpdate>) {
		this._unassignedCardsGroups$ = value;
	}

	get assignedDaysCardsGroups(): any {
		return this._assignedDaysCardsGroups;
	}

	set assignedDaysCardsGroups(value: any) {
		this._assignedDaysCardsGroups = value;
	}

	get assignedDaysCardsGroups$(): any {
		return this._assignedDaysCardsGroups$;
	}

	set assignedDaysCardsGroups$(value: any) {
		this._assignedDaysCardsGroups$ = value;
	}

	// endregion

	// region Init

	init(cards: Card[]) {
		this.cards = cards;

		this.unassignedCards = this.cards.filter(card => !card.day);
		this.unassignedCardsGroups = this.initGroupedUnassignedCards(this.unassignedCards);

		this.assignedCards = this.cards.filter(card => card.day);
		this.assignedCardsGroups = this.initAssignedCardsGroups(this.assignedCards);
		this.initAssignedDaysCardsObjects(this.assignedCardsGroups, this.daysService.daysMechanics);

		this.unassignedCardsGroupsSubject = new Subject<CardUpdate>();
		this.unassignedCardsGroups$ = this.unassignedCardsGroupsSubject.asObservable();

		this.maxScheduleWidthSubscription = this.timeService.maxScheduleWidth$.subscribe(() => {
			this.updateDimensions();
			this.notifyAll();
		});

		console.log('Cards', this.cards);
		console.log('Unassigned cards groups', this.unassignedCardsGroups);
		console.log('Assigned cards groups', this.assignedCardsGroups);
		console.log('Assigned days cards groups', this.assignedDaysCardsGroups);
	}

	private initGroupedUnassignedCards(unassignedCards: Card[]): CardsGroup[] {
		let groups = [];
		let processedCards = [];
		for (let card of unassignedCards) {
			const processed = processedCards.indexOf(card) > -1;
			if (!processed) {
				const linkedCards = this.findLinkedCards(unassignedCards, card, [card]);
				groups.push(new CardsGroup(linkedCards));
				processedCards = processedCards.concat(linkedCards);
			}
		}
		return groups;
	}

	private findLinkedCards(cards: Card[], card: Card, linkedCards: Card[]): Card[] {
		if (card.linkedNextId) {
			const linkedNextCard = cards.find(c => c.linkedPreviousId == card.id);
			linkedCards.push(linkedNextCard);
			this.findLinkedCards(cards, linkedNextCard, linkedCards);
		}
		return linkedCards;
	}

	private initAssignedCardsGroups(assignedCards: Card[]) {
		return this.getGroupedCards(assignedCards);
	}

	private initAssignedDaysCardsObjects(assignedCardsGroups: CardsGroup[], daysMechanics: any): any {
		this.assignedDaysCardsGroups = {};
		this.assignedDaysCardsGroupsSubjects = {};
		this.assignedDaysCardsGroups$ = {};

		for (let dayTime in daysMechanics) {
			this.assignedDaysCardsGroups[dayTime] = {};
			this.assignedDaysCardsGroupsSubjects[dayTime] = {};
			this.assignedDaysCardsGroups$[dayTime] = {};

			for (let mechanic of daysMechanics[dayTime]) {
				this.assignedDaysCardsGroups[dayTime][mechanic.code] = assignedCardsGroups.filter(cardsGroup => {
					return cardsGroup.cards[0].day.getTime() == +dayTime && cardsGroup.cards[0].mechanicCode == mechanic.code
				});

				const subject = new Subject<CardUpdate>();
				const observable = subject.asObservable();
				this.assignedDaysCardsGroupsSubjects[dayTime][mechanic.code] = subject;
				this.assignedDaysCardsGroups$[dayTime][mechanic.code] = observable;
			}
		}
	}

	private getGroupedCards(cards: Card[]) {
		let groupedCards: CardsGroup[] = [];
		for (let card of cards) {
			const index = groupedCards.findIndex(cardsGroup =>
				cardsGroup.cards && this.cardInGroup(cardsGroup.cards, card) != undefined
			);
			if (index == -1) {
				groupedCards.push(new CardsGroup([card]))
			} else {
				groupedCards[index].addCard(card);
			}
		}
		return groupedCards;
	}

	private cardInGroup(cards: Card[], card: Card) {
		return cards.find(groupCard => groupCard.linkedPreviousId == card.id || groupCard.linkedNextId == card.id)
	}

	private updateDimensions() {
		this.unassignedCardsGroups.forEach((cardsGroup: CardsGroup) => {
			cardsGroup.cards.forEach((card) => {
				card.width = this.timeService.calcWidth(card.duration);
			});
		});
		for (let dayTime in this.assignedDaysCardsGroups) {
			for (let mechanic in this.assignedDaysCardsGroups[dayTime]) {
				this.assignedDaysCardsGroups[dayTime][mechanic].forEach((cardsGroup: CardsGroup) => {
					cardsGroup.cards.forEach((card: Card) => {
						card.width = this.timeService.calcWidth(card.duration);
					});
					cardsGroup.left = this.timeService.calcLeft(cardsGroup.cards[0].start);
				});
			}
		}
	}

	// endregion

	// region Translate card

	removeFromOrigin(cardsGroup: CardsGroup): any {
		if (cardsGroup.cards[0].mechanicCode) {
			const card = cardsGroup.cards[0];
			this.handleMovementGroupsLinks(
				card.day,
				card.mechanicCode,
				cardsGroup.lastLine,
				cardsGroup.lastStart,
				cardsGroup.lastEnd
			);

			this.handleRemoveAssignedCardsGroup(card.day, card.mechanicCode, cardsGroup);
		} else {
			const cardsGroupIndex = this.unassignedCardsGroups.findIndex(group => group.id == cardsGroup.id);
			this.unassignedCardsGroups = this.unassignedCardsGroups.filter((g, i) => i != cardsGroupIndex);
			const cardUpdateRemove = new CardUpdateRemove(cardsGroup);
			this.notifyUnassigned(cardUpdateRemove);
		}
	}

	updateTranslatedCards(cardsGroup: CardsGroup, newMechanic: Mechanic) {
		if (newMechanic) {
			cardsGroup.cards.forEach(card => {
				card.day = newMechanic.day;
				card.mechanicCode = newMechanic.code;
			});
		} else {
			this.resetCardsGroup(cardsGroup);
		}

		this.addToDestiny(newMechanic, cardsGroup);
		this.http.put(`${environment.serverUrl}/panel/cards/position`, cardsGroup.cards).subscribe();
	}

	private addToDestiny(newMechanic: Mechanic, cardsGroup: CardsGroup): void {
		if (newMechanic) {
			/* Al añadir un grupo a una línea, se comprueba si tiene grupos al lado para activar o desactivar los
			*  iconos de los enlaces */
			this.handleMovementGroupsLinks(
				newMechanic.day,
				newMechanic.code,
				cardsGroup.line,
				cardsGroup.start,
				cardsGroup.end
			);
			this.handleAddAssignedCardsGroup(newMechanic.day, newMechanic.code, cardsGroup);
		} else {
			this.unassignedCardsGroups.push(cardsGroup);
			const cardUpdateAdd = new CardUpdateAdd(cardsGroup);

			this.notifyUnassigned(cardUpdateAdd);
		}
	}

	private handleMovementGroupsLinks(day: Date, mechanicCode: string, line: number, start: Date, end: Date): void {
		const lineGroups = this.findLineGroups(day, mechanicCode, line);
		const leftGroup = lineGroups.find(group => group.end.getTime() == start.getTime());
		const rightGroup = lineGroups.find(group => group.start.getTime() == end.getTime());
		if (leftGroup) {
			leftGroup.cards[leftGroup.cards.length-1].possibleLinkedNextId =
				!leftGroup.cards[leftGroup.cards.length-1].possibleLinkedNextId;
		}
		if (rightGroup) {
			rightGroup.cards[0].possibleLinkedPreviousId = !rightGroup.cards[0].possibleLinkedPreviousId;
		}
	}

	private resetCardsGroup(cardsGroup: CardsGroup) {
		cardsGroup.left = undefined;

		for (let card of cardsGroup.cards) {
			this.resetCard(card);
		}
	}

	private resetCard(card: Card): void {
		card.day = undefined;
		card.mechanicCode = undefined;
		card.left = undefined;
		card.start = undefined;
		card.end = undefined;
	}

	// endregion

	// region Global cards map

	handleAddAssignedCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		this.addCardsGroup(day, mechanicCode, group);
		this.notifyAssigned(day, mechanicCode, new CardUpdateAdd(group));
	}

	handleRemoveAssignedCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		this.removeCardsGroup(day, mechanicCode, group);
		this.notifyAssigned(day, mechanicCode, new CardUpdateRemove(group));
	}

	addCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		/* Se usa concat en lugar de push para que no modifique el array original, y se actualice antes de tiempo en
		*  mechanic-line.component. Haciendo el push, el array cardsGroups del mechanic-line.component se actualiza aquí
		*  en lugar de en el propio componente */
		this.assignedDaysCardsGroups[day.getTime()][mechanicCode] =
			this.assignedDaysCardsGroups[day.getTime()][mechanicCode].concat([group]);
	}

	removeCardsGroup(day: Date, mechanicCode: string, group: CardsGroup): void {
		this.assignedDaysCardsGroups[day.getTime()][mechanicCode] =
			this.assignedDaysCardsGroups[day.getTime()][mechanicCode].filter(g => g.id != group.id);
	}

	// endregion

	// region Update width

	updateCardDuration(card: Card, width: number): void {
		card.width = width;
		card.duration = this.timeService.calcDurationFromWidth(card.width);
		this.http.put(`${environment.serverUrl}/panel/cards/duration`, card).subscribe();
	}

	// endregion

	// region Find cards (groups)

	getAssignedCards(day: Date, mechanicCode: string) {
		return this.assignedDaysCardsGroups[day.getTime()][mechanicCode];
	}

	findLineGroups(day: Date, mechanicCode: string, line: number): CardsGroup[] {
		return this.getAssignedCards(day, mechanicCode).filter(group => group.line == line);
	}

	findLineCards(day: Date, mechanicCode: string, line: number): Card[] {
		const groups = this.getAssignedCards(day, mechanicCode).filter(group => group.cards[0].line == line);
		return [].concat(...groups.map(group => group.cards));
	}

	private findCardsGroup(groups: CardsGroup[], cardId: number): CardsGroup {
		return groups.find(group => group.cards.find(card => card.id == cardId) != undefined);
	}

	// endregion

	// region Link handlers

	findLeftNextCard(card: Card, direction: string): Card {
		return card.start ?
			this.findLeftAssignedNextCard(card.day, card.mechanicCode, card.line, card.order.number, card.start) :
			this.findUnassignedNextCard(card.id, direction);
	}

	findRightNextCard(card: Card, direction: string): Card {
		return card.start ?
			this.findRightAssignedNextCard(card.day, card.mechanicCode, card.line, card.order.number, card.end) :
			this.findUnassignedNextCard(card.id, direction);
	}

	private findLeftAssignedNextCard(day: Date, mechanicCode: string, line: number, orderNumber: number, start: Date): Card {
		return this.findLineCards(day, mechanicCode, line).find(card => {
			return card.order.number == orderNumber &&card.end.getTime() == start.getTime()
		});
	}

	private findRightAssignedNextCard(day: Date, mechanicCode: string, line: number, orderNumber: number, end: Date): Card {
		return this.findLineCards(day, mechanicCode, line).find(card => {
			return card.order.number == orderNumber && card.start.getTime() == end.getTime()
		});
	}

	findUnassignedNextCard(id: number, direction: string): Card {
		const group = this.findUnassignedCardGroup(id);
		const cardIndex = group.cards.findIndex(card => card.id == id);
		if (direction == Constants.NEXT_CARD_DIRECTION.LEFT) {
			return cardIndex > 0 ? group.cards[cardIndex-1] : undefined;
		} else {
			return cardIndex < group.cards.length-1 ? group.cards[cardIndex+1] : undefined;
		}
	}

	private findUnassignedCardGroup(cardId: number): CardsGroup {
		return this.unassignedCardsGroups.find(group => {
			return group.cards.find(card => card.id == cardId) != undefined;
		});
	}

	unlink(card: Card, direction: string): void {
		/* Se obtienen los grupos de la línea o sin asignar, y a continuación el grupo al que pertence la ficha */
		const cardsGroups =
			card.start ? this.findLineGroups(card.day, card.mechanicCode, card.line) : this.unassignedCardsGroups;
		const group = this.findCardsGroup(cardsGroups, card.id);

		/* Se actualizan las propiedades de las fichas */
		let offset;
		const cardIndex = group.cards.findIndex(c => c.id == card.id);
		if (direction == Constants.NEXT_CARD_DIRECTION.RIGHT) {
			card.linkedNextId = undefined;
			group.cards[cardIndex+1].linkedPreviousId = undefined;
			offset = 1;
		} else {
			card.linkedPreviousId = undefined;
			group.cards[cardIndex-1].linkedNextId = undefined;
			offset = 0;
		}

		/* Se definen los nuevos grupos, tanto el nuevo como la actualización de fichas del antiguo */
		const newGroup = new CardsGroup(
			group.cards.slice(cardIndex+offset, group.cards.length),
			this.timeService.calcLeft(group.cards[cardIndex+offset].start)
		);
		group.removeCards(cardIndex+offset, group.cards.length - (cardIndex+offset));

		this.handleAddAssignedCardsGroup(card.day, card.mechanicCode, newGroup);
	}

	linkPrevious(card: Card): void {
		//TODO Revisar movida al mover fichas, que vuelven a su posicion original
		const cardsGroups =
			card.start ? this.findLineGroups(card.day, card.mechanicCode, card.line) : this.unassignedCardsGroups;
		const group = this.findCardsGroup(cardsGroups, card.id);
		const leftGroup = cardsGroups.find(group => group.end.getTime() == card.start.getTime());

		leftGroup.cards[leftGroup.cards.length-1].linkedNextId = card.id;
		card.linkedPreviousId = leftGroup.cards[leftGroup.cards.length-1].id;

		leftGroup.addCards(group.cards);
		this.handleRemoveAssignedCardsGroup(card.day, card.mechanicCode, group);
	}

	linkNext(card: Card): void {
		const cardsGroups =
			card.start ? this.findLineGroups(card.day, card.mechanicCode, card.line) : this.unassignedCardsGroups;
		const group = this.findCardsGroup(cardsGroups, card.id);
		const rightGroup = cardsGroups.find(group => group.start.getTime() == card.end.getTime());

		rightGroup.cards[0].linkedPreviousId = card.id;
		card.linkedNextId = rightGroup.cards[0].id;

		group.addCards(rightGroup.cards);
		this.handleRemoveAssignedCardsGroup(card.day, card.mechanicCode, rightGroup);
	}

	// endregion

	// region Notify

	private notifyAll(): void {
		this.notifyUnassigned(new CardUpdateWidth());
		this.notifyAllAssigned();
	}

	private notifyUnassigned(cardUpdate: CardUpdate): void {
		this.unassignedCardsGroupsSubject.next(cardUpdate);
	}

	private notifyAllAssigned(): void {
		for (let dayTime in this.assignedDaysCardsGroupsSubjects) {
			for (let mechanic in this.assignedDaysCardsGroupsSubjects[dayTime]) {
				const dayMechanicCards = this.assignedDaysCardsGroups[dayTime][mechanic];
				if (dayMechanicCards.length) {
					this.assignedDaysCardsGroupsSubjects[dayTime][mechanic].next(
						new CardUpdateWidth(dayMechanicCards)
					)
				}
			}
		}
	}

	private notifyAssigned(day: Date, mechanicCode: string, cardUpdate: CardUpdate): void {
		this.assignedDaysCardsGroupsSubjects[day.getTime()][mechanicCode].next(cardUpdate);
	}

	// endregion

}
