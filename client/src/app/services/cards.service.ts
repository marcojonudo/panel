import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Card} from "../objects/card";
import {Mechanic} from "../objects/mechanic";
import {TimeService} from "./time.service";
import {UtilsService} from "./utils.service";
import {CardPositionService} from "./card-position.service";
import {DaysService} from "./days.service";
import {Coordinates} from "../objects/coordinates";
import {Order} from "../objects/order";
import {CardsGroup} from "../objects/cards-group";

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
		private timeService: TimeService
	) {
		this.cards = [
			new Card(1, undefined, undefined, undefined, 30, undefined, false, new Order(1), undefined, undefined),
			new Card(2, undefined, undefined, undefined, 15, undefined, false, new Order(1), undefined, undefined),
			new Card(14, undefined, undefined, undefined, 15, undefined, false, new Order(1), undefined, undefined),
			new Card(3, undefined, undefined, undefined, 60, undefined, false, new Order(2), undefined, undefined),
			new Card(4, undefined, undefined, undefined, 45, undefined, false, new Order(3), undefined, undefined),
			new Card(15, undefined, undefined, undefined, 60, undefined, false, new Order(3), undefined, undefined),
			new Card(16, undefined, undefined, undefined, 50, undefined, false, new Order(12), undefined, undefined),
			new Card(17, undefined, undefined, undefined, 40, undefined, false, new Order(13), undefined, undefined),
			new Card(18, undefined, undefined, undefined, 45, undefined, false, new Order(14), undefined, undefined),
			new Card(19, undefined, undefined, undefined, 25, undefined, false, new Order(15), undefined, undefined),
			new Card(20, undefined, undefined, undefined, 20, undefined, false, new Order(16), undefined, undefined),
			new Card(21, undefined, undefined, undefined, 35, undefined, false, new Order(17), undefined, undefined),
			new Card(22, undefined, undefined, undefined, 15, undefined, false, new Order(18), undefined, undefined),
			new Card(23, undefined, undefined, undefined, 30, undefined, false, new Order(19), undefined, undefined),
			new Card(5, "2019-06-25", "A", '09:00:00', 30, '09:30:00', true, new Order(4), undefined, 6),
			new Card(6, "2019-06-25", "A", '09:30:00', 15, '09:45:00', true, new Order(4), 5, undefined),
			new Card(7, "2019-06-25", "A", '11:00:00', 30, '11:30:00', true, new Order(5), undefined, undefined),
			new Card(8, "2019-06-25", "A", '11:30:00', 15, '11:45:00', true, new Order(6), undefined, undefined),
			new Card(9, "2019-06-25", "A", '12:00:00', 30, '12:30:00', false, new Order(7), undefined, undefined),
			new Card(10, "2019-06-25", "B", '09:00:00', 30, '09:30:00', true, new Order(8), undefined, undefined),
			new Card(11, "2019-06-26", "C", '09:00:00', 30, '09:30:00', false, new Order(9), undefined, undefined),
			new Card(12, "2019-06-27", "A", '09:00:00', 30, '09:30:00', false, new Order(10), undefined, undefined),
			new Card(13, "2019-06-27", "D", '09:00:00', 30, '09:30:00', true, new Order(11), undefined, undefined),
		];

		this.unassignedCards = this.cards.filter(card => !card.day);
		this.unassignedCardsGroups = this.initGroupedUnassignedCards(this.unassignedCards);

		this.assignedCards = this.cards.filter(card => card.day);
		this.assignedCardsGroups = this.initAssignedCardsGroups(this.assignedCards);
		this.initAssignedDaysCardsObjects(this.assignedCardsGroups, this.daysService.daysMechanics);

		this.unassignedCardsGroupsSubject = new BehaviorSubject<any>(this.unassignedCardsGroups);
		this.unassignedCardsGroups$ = this.unassignedCardsGroupsSubject.asObservable();

		this.widthSubscription = this.timeService.intervalWidth$.subscribe(() => {
			console.log('CALCULATING');
			this.initDimensions();
			// this.initWidth(this.unassignedCardsGroups.concat(this.assignedCardsGroups));
			// this.initWidth(this.unassignedCards.concat(this.assignedCards));
			// this.initLeft(this.assignedCardsGroups);
			this.notifyAll();
		});

		console.log('Unassigned cards groups', this.unassignedCardsGroups);
		console.log('Assigned cards groups', this.assignedCardsGroups);
		console.log('Assigned days cards groups', this.assignedDaysCardsGroups);
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

	private initGroupedUnassignedCards(unassignedCards: Card[]) {
		return UtilsService.groupList(unassignedCards, (card) => card.order.number).map(groupedCards => {
			return new CardsGroup(groupedCards)
		});
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
				const cardsGroup = assignedCardsGroups.filter(cardsGroup =>
					cardsGroup.cards[0].day.getTime() == dayTime && cardsGroup.cards[0].mechanicCode == mechanic.position
				);
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
			newCardsGroup.start = newCardsGroup.cards[0].start;
		}
		return newCardsGroup;
	}

	// endregion

	// region Translate card

	removeCardsFromOrigin(cardsGroup: CardsGroup): any {
		if (cardsGroup.cards[0].mechanicCode) {
			const card = cardsGroup.cards[0];
			const cardsGroupIndex = this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode].indexOf(cardsGroup);
			this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode].splice(cardsGroupIndex, 1);

			// for (let card of cards) {
			// 	const cardIndex = this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode].indexOf(card);
			// 	this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode].splice(cardIndex, 1);
			// }

			this.assignedDaysCardsGroupsSubjects[card[0].day.getTime()][card[0].mechanicCode].next(
				this.assignedDaysCardsGroups[card[0].day.getTime()][card[0].mechanicCode]
			);
		} else {
			const cardsGroupIndex = this.unassignedCardsGroups.indexOf(cardsGroup);
			// this.unassignedCardsGroups.find((cardsGroup, index) => {
			// 	if (cardsGroup.cards == cards) {
			// 		cardsIndex = index;
			// 		return true;
			// 	}
			// });
			this.unassignedCardsGroups.splice(cardsGroupIndex, 1);

			console.log('[cardsService] unassignedCards.next()');
			console.time('[cardsService] unassignedCards.next()');
			this.unassignedCardsGroupsSubject.next(this.unassignedCardsGroups);
			console.timeEnd('[cardsService] unassignedCards.next()');
		}
	}

	updateTranslatedCards(cardsGroup: CardsGroup, newMechanic: Mechanic, position: Coordinates) {
		if (newMechanic) {
			cardsGroup.left = position.x - 180;
			console.time('updateCards');
			cardsGroup.cards.forEach((card, index) => {
				card.day = newMechanic.day;
				card.mechanicCode = newMechanic.position;

				// card.left = position.x - 180;
				// console.log(cardsGroup.cards.slice(0, index));
				console.log(cardsGroup.left);
				// const cardsDuration = cardsGroup.cards.slice(0, index).map(card => card.duration).reduce((a, b) => a + b, 0);
				// console.log(cardsDuration, this.calculateWidth(cardsDuration));
				const cardLeft = cardsGroup.left + 1;//cardsGroup.cards.slice(0, index).reduce((a, b) => a.duration + b.duration, 0)
				// card.start = this.calculateStart(cardLeft);
				card.topLine = position.topLine;

			});
			console.timeEnd('updateCards');
		} else {
			for (let card of cardsGroup.cards) {
				this.resetCard(card);
			}
		}

		this.addToDestiny(newMechanic, cardsGroup);
	}

	private resetCard(card: Card): void {
		card.day = undefined;
		card.mechanicCode = undefined;
		card.left = undefined;
		card.start = undefined;
		card.topLine = undefined;
	}

	private addToDestiny(newMechanic: Mechanic, cardsGroup: CardsGroup): void {
		if (newMechanic) {
			this.assignedDaysCardsGroups[newMechanic.day.getTime()][newMechanic.position].push(cardsGroup);
			// for (let card of cards) {
			// 	this.assignedDaysCardsGroups[newMechanic.day.getTime()][newMechanic.position].push(card);
			// }
			console.log('notifyAssigned');
			console.time('notifyAssigned');
			this.notifyAssigned(newMechanic.day, newMechanic.position);
			console.timeEnd('notifyAssigned');
		} else {
			this.unassignedCardsGroups.push(cardsGroup);
			// for (let card of cards) {
			// 	this.unassignedCards.push(card);
			// }
			this.notifyUnassigned();
		}
	}

	// endregion

	// region Update with

	updateCardDuration(card: Card, width: number): void {
		card.width = width;
		card.duration = this.timeService.calculateDuration(card.width);
	}

	// endregion

	// region Update properties

	private calculateLeft(start: Date) {
		return this.timeService.calculateLeft(start);
	}

	private calculateStart(left: number): string {
		return this.timeService.calculateStart(left);
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

	// private notify(cards: Card[], type: CardAssignedType) {
	// 	if (type == CardAssignedType.UNASSIGNED) {
	// 		this.notifyUnassigned();
	// 	} else {
	// 		this.notifyAssigned(cards[0].day, cards[0].mechanicCode)
	// 	}
	// }

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

}
