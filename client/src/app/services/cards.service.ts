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

@Injectable({
	providedIn: 'root'
})
export class CardsService {

	private cards: Card[];
	private unassignedCards: Card[];
	private unassignedCardsGroups: CardsGroup[];
	private assignedCards: Card[];
	private assignedCardsGroups: CardsGroup[];
	private assignedDaysCardsGroups: any;

	private unassignedCardsGroupsSubject: BehaviorSubject<any>;
	private _unassignedCardsGroups$: Observable<any>;

	private assignedDaysCardsGroupsSubjects: any;
	private _assignedDaysCardsGroups$: any;

	private widthSubscription: any;

	constructor(
		private daysService: DaysService,
		private timeService: TimeService,
		private http: HttpClient
	) {
		// this.http.get('http://localhost:8083/panel/get')
		// 	.subscribe((data: any) => {
		// 		console.log(data);
		// 		const cards = data.cards.map(card => {
		// 			return new Card(card);
		// 		});
		// 		this.init(cards);
		// 	});
		// this.cards = [
		// 	new Card(1, undefined, undefined, undefined, 30, undefined, undefined, new Order(1), undefined, undefined),
		// 	new Card(2, undefined, undefined, undefined, 15, undefined, undefined, new Order(1), undefined, undefined),
		// 	new Card(14, undefined, undefined, undefined, 15, undefined, undefined, new Order(1), undefined, undefined),
		// 	new Card(3, undefined, undefined, undefined, 60, undefined, undefined, new Order(2), undefined, undefined),
		// 	new Card(4, undefined, undefined, undefined, 45, undefined, undefined, new Order(3), undefined, undefined),
		// 	new Card(15, undefined, undefined, undefined, 60, undefined, undefined, new Order(3), undefined, undefined),
		// 	new Card(16, undefined, undefined, undefined, 50, undefined, undefined, new Order(12), undefined, undefined),
		// 	new Card(17, undefined, undefined, undefined, 40, undefined, undefined, new Order(13), undefined, undefined),
		// 	new Card(18, undefined, undefined, undefined, 45, undefined, undefined, new Order(14), undefined, undefined),
		// 	new Card(19, undefined, undefined, undefined, 25, undefined, undefined, new Order(15), undefined, undefined),
		// 	new Card(20, undefined, undefined, undefined, 20, undefined, undefined, new Order(16), undefined, undefined),
		// 	new Card(21, undefined, undefined, undefined, 35, undefined, undefined, new Order(17), undefined, undefined),
		// 	new Card(22, undefined, undefined, undefined, 15, undefined, undefined, new Order(18), undefined, undefined),
		// 	new Card(23, undefined, undefined, undefined, 30, undefined, undefined, new Order(19), undefined, undefined),
		// 	new Card(5, "2019-06-25", "A", '09:00:00', 30, '09:30:00', 0, new Order(4), undefined, 6),
		// 	new Card(6, "2019-06-25", "A", '09:30:00', 15, '09:45:00', 0, new Order(4), 5, undefined),
		// 	new Card(7, "2019-06-25", "A", '10:00:00', 30, '10:45:00', 1, new Order(5), undefined, undefined),
		// 	new Card(8, "2019-06-25", "A", '11:30:00', 15, '11:45:00', 0, new Order(6), undefined, undefined),
		// 	new Card(9, "2019-06-25", "A", '12:00:00', 30, '12:30:00', 1, new Order(7), undefined, undefined),
		// 	new Card(10, "2019-06-25", "B", '09:00:00', 30, '09:30:00', 1, new Order(8), undefined, undefined),
		// 	new Card(11, "2019-06-26", "C", '09:00:00', 30, '09:30:00', 1, new Order(9), undefined, undefined),
		// 	new Card(12, "2019-06-27", "A", '09:00:00', 30, '09:30:00', 0, new Order(10), undefined, undefined),
		// 	new Card(13, "2019-06-27", "D", '09:00:00', 30, '09:30:00', 1, new Order(11), undefined, undefined),
		// ];
		// this.cards = [];
	}

	// region Getters / setters

	get unassignedCardsGroups$(): Observable<any> {
		return this._unassignedCardsGroups$;
	}

	set unassignedCardsGroups$(value: Observable<any>) {
		this._unassignedCardsGroups$ = value;
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

		this.unassignedCardsGroupsSubject = new BehaviorSubject<any>(this.unassignedCardsGroups);
		this.unassignedCardsGroups$ = this.unassignedCardsGroupsSubject.asObservable();

		this.widthSubscription = this.timeService.intervalWidth$.subscribe(() => {
			this.initDimensions();
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
		if (card.linkedPrevId) {
			const linkedPrevCard = cards.find(c => c.id == card.linkedPrevId);
			linkedCards.push(linkedPrevCard);
			this.findLinkedCards(cards, linkedPrevCard, linkedCards);
		}
		if (card.linkedNextId) {
			const linkedNextCard = cards.find(c => c.id == card.linkedNextId);
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
				const cardsGroup = assignedCardsGroups.filter(cardsGroup => {
					return cardsGroup.cards[0].day.getTime() == +dayTime && cardsGroup.cards[0].mechanicCode == mechanic.position
				});
				this.assignedDaysCardsGroups[dayTime][mechanic.position] = cardsGroup;

				const subject = new BehaviorSubject<any>(cardsGroup);
				const observable = subject.asObservable();
				this.assignedDaysCardsGroupsSubjects[dayTime][mechanic.position] = subject;
				this.assignedDaysCardsGroups$[dayTime][mechanic.position] = observable;
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
				groupedCards[index].cards.push(card);
			}
		}
		return groupedCards;
	}

	private cardInGroup(cards: Card[], card: Card) {
		return cards.find(groupCard => groupCard.linkedPrevId == card.id || groupCard.linkedNextId == card.id)
	}

	private initDimensions() {
		this.unassignedCardsGroups = this.unassignedCardsGroups.map((cardsGroup: CardsGroup) => {
			return this.initCardsGroupDimensions(cardsGroup, false);
		});
		for (let dayTime in this.assignedDaysCardsGroups) {
			for (let mechanic in this.assignedDaysCardsGroups[dayTime]) {
				this.assignedDaysCardsGroups[dayTime][mechanic] = this.assignedDaysCardsGroups[dayTime][mechanic].map((cardsGroup: CardsGroup) => {
					return this.initCardsGroupDimensions(cardsGroup, true);
				});
			}
		}
	}

	private initCardsGroupDimensions(cardsGroup: CardsGroup, calculateLeft: boolean) {
		let newCardsGroup = cardsGroup.clone();
		newCardsGroup.cards.forEach((card) => {
			card.width = this.calculateWidth(card.duration);
		});

		if (calculateLeft) {
			// const start = UtilsService.parseTimeFromString(newCardsGroup.cards[0].start);
			newCardsGroup.left = this.calculateLeft(newCardsGroup.cards[0].start);
			// newCardsGroup.start = newCardsGroup.cards[0].start;
		}
		return newCardsGroup;
	}

	// endregion

	// region Translate card

	removeFromOrigin(cardsGroup: CardsGroup): any {
		if (cardsGroup.cards[0].mechanicCode) {
			const card = cardsGroup.cards[0];
			const cardsGroupIndex = this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode].indexOf(cardsGroup);
			this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode].splice(cardsGroupIndex, 1);

			console.log('[cardsService] assignedDaysCards.next()');
			console.time('[cardsService] assignedDaysCards.next()');
			this.assignedDaysCardsGroupsSubjects[card.day.getTime()][card.mechanicCode].next(
				this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode]
			);
			console.timeEnd('[cardsService] assignedDaysCards.next()');
		} else {
			const cardsGroupIndex = this.unassignedCardsGroups.indexOf(cardsGroup);
			this.unassignedCardsGroups.splice(cardsGroupIndex, 1);

			console.log('[cardsService] unassignedCards.next()');
			console.time('[cardsService] unassignedCards.next()');
			this.notifyUnassigned();
			console.timeEnd('[cardsService] unassignedCards.next()');
		}
	}

	updateTranslatedCards(cardsGroup: CardsGroup, newMechanic: Mechanic) {
		if (newMechanic) {
			cardsGroup.cards.forEach(card => {
				card.day = newMechanic.day;
				card.mechanicCode = newMechanic.position;
			});
		} else {
			this.resetCardsGroup(cardsGroup);
		}

		console.log(cardsGroup);
		this.addToDestiny(newMechanic, cardsGroup);
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
	}

	private addToDestiny(newMechanic: Mechanic, cardsGroup: CardsGroup): void {
		if (newMechanic) {
			this.assignedDaysCardsGroups[newMechanic.day.getTime()][newMechanic.position].push(cardsGroup);
			console.log('notifyAssigned');
			console.time('notifyAssigned');
			this.notifyAssigned(newMechanic.day, newMechanic.position);
			console.timeEnd('notifyAssigned');
		} else {
			this.unassignedCardsGroups.push(cardsGroup);
			console.time('notifyUnassigned');
			this.notifyUnassigned();
			console.timeEnd('notifyUnassigned');
		}
	}

	// endregion

	// region Update width

	updateCardDuration(card: Card, width: number): void {
		card.width = width;
		card.duration = this.timeService.calculateDuration(card.width);
	}

	// endregion

	// region Update properties

	private calculateLeft(start: Date) {
		return this.timeService.calculateLeft(start);
	}

	private calculateStart(left: number, day: Date): Date {
		return this.timeService.calculateStart(left, day);
	}

	private calculateWidth(duration: number): number {
		return this.timeService.calculateWidth(duration);
	}

	calculateDuration(width: number): number {
		return this.timeService.calculateDuration(width);
	}

	// endregion

	// region Notify

	private notifyAll(): void {
		this.notifyUnassigned();
		this.notifyAllAssigned();
	}

	private notifyUnassigned(): void {
		this.unassignedCardsGroupsSubject.next(this.unassignedCardsGroups);
	}

	private notifyAllAssigned(): void {
		for (let dayTime in this.assignedDaysCardsGroupsSubjects) {
			for (let mechanic in this.assignedDaysCardsGroupsSubjects[dayTime]) {
				this.assignedDaysCardsGroupsSubjects[dayTime][mechanic].next(this.assignedDaysCardsGroups[dayTime][mechanic])
			}
		}
	}

	private notifyAssigned(day: Date, mechanicCode: string): void {
		this.assignedDaysCardsGroupsSubjects[day.getTime()][mechanicCode].next(this.assignedDaysCardsGroups[day.getTime()][mechanicCode]);
	}

	// endregion

	private findCardsDuration(cards: Card[]): number {
		return cards.map(card => card.duration).reduce((a, b) => a + b, 0);
	}

	private findCardsGroupsWidth(cardsGroups: CardsGroup[]): number {
		let cards = [];
		cardsGroups.forEach(cardsGroup => cards.push(...cardsGroup.cards));
		return cards.map(card => card.width).reduce((a, b) => a + b, 0);
	}


	getAssignedCards(day: Date, mechanicCode: string) {
		return this.assignedDaysCardsGroups[day.getTime()][mechanicCode];
	}

}
