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

@Injectable({
	providedIn: 'root'
})
export class CardsService {

	private cards: Card[];
	private unassignedCards: Card[];
	private assignedCards: Card[];
	private assignedDaysCards: any;

	private unassignedCardsSubject: BehaviorSubject<any>;
	private _unassignedCards$: Observable<any>;

	private assignedDaysCardsSubjects: any;
	private _assignedDaysCards$: any;

	private widthSubscription: any;

	constructor(
		private daysService: DaysService,
		private timeService: TimeService,
		private cardPositionService: CardPositionService
	) {
		this.cards = [
			new Card(1, undefined, undefined, undefined, 30, undefined, false, new Order(1)),
			new Card(2, undefined, undefined, undefined, 15, undefined, false, new Order(1)),
			new Card(3, undefined, undefined, undefined, 60, undefined, false, new Order(2)),
			new Card(4, undefined, undefined, undefined, 45, undefined, false, new Order(3)),
			new Card(5, "2019-06-25", "A", '09:00:00', 30, '09:30:00', true, new Order(4)),
			new Card(6, "2019-06-25", "A", '10:00:00', 15, '10:15:00', false, new Order(4)),
			new Card(7, "2019-06-25", "A", '11:00:00', 30, '11:30:00', true, new Order(5)),
			new Card(8, "2019-06-25", "A", '11:30:00', 15, '11:45:00', true, new Order(6)),
			new Card(9, "2019-06-25", "A", '12:00:00', 30, '12:30:00', false, new Order(7)),
			new Card(10, "2019-06-25", "B", '09:00:00', 30, '09:30:00', true, new Order(8)),
			new Card(11, "2019-06-26", "C", '09:00:00', 30, '09:30:00', false, new Order(9)),
			new Card(12, "2019-06-27", "A", '09:00:00', 30, '09:30:00', false, new Order(10)),
			new Card(13, "2019-06-27", "D", '09:00:00', 30, '09:30:00', true, new Order(11))
		];

		this.assignedDaysCards = {};
		this.assignedDaysCardsSubjects = {};
		this.assignedDaysCards$ = {};

		this.unassignedCards = this.cards.filter(card => !card.day);

		this.assignedCards = this.cards.filter(card => card.day);
		this.initAssignedDaysCardsObjects(this.assignedCards, this.daysService.daysMechanics);

		this.unassignedCardsSubject = new BehaviorSubject<any>(this.unassignedCards);
		this.unassignedCards$ = this.unassignedCardsSubject.asObservable();

		this.widthSubscription = this.timeService.intervalWidth$.subscribe(intervalWidth => {
			this.calculatePosition(this.unassignedCards.concat(this.assignedCards));
			this.notifyAll();
		});

		console.log('Unassigned cards', this.unassignedCards);
		console.log('Assigned days cards', this.assignedDaysCards);
		console.log('Assigned days cards subjects', this.assignedDaysCardsSubjects);
		console.log('Assigned days cards observables', this.assignedDaysCards$);
	}

	// region Getters / setters

	get unassignedCards$(): Observable<any> {
		return this._unassignedCards$;
	}

	set unassignedCards$(value: Observable<any>) {
		this._unassignedCards$ = value;
	}

	get assignedDaysCards$(): any {
		return this._assignedDaysCards$;
	}

	set assignedDaysCards$(value: any) {
		this._assignedDaysCards$ = value;
	}

	// endregion

	// region Init

	initAssignedDaysCardsObjects(assignedCards: Card[], daysMechanics: any): any {
		for (let day in daysMechanics) {
			this.assignedDaysCards[day] = {};
			this.assignedDaysCardsSubjects[day] = {};
			this.assignedDaysCards$[day] = {};

			for (let mechanic of daysMechanics[day]) {
				const cards = assignedCards.filter(card => card.day == day && card.mechanicCode == mechanic.position);
				this.assignedDaysCards[day][mechanic.position] = cards;

				const subject = new BehaviorSubject<any>(cards);
				const observable = subject.asObservable();
				this.assignedDaysCardsSubjects[day][mechanic.position] = subject;
				this.assignedDaysCards$[day][mechanic.position] = observable;
			}
		}
	}

	// endregion

	// region Translate card

	removeCardFromOrigin(card: Card): any {
		if (card.mechanicCode) {
			const cardIndex = this.assignedDaysCards[card.day][card.mechanicCode].indexOf(card);
			this.assignedDaysCards[card.day][card.mechanicCode].splice(cardIndex, 1);

			this.assignedDaysCardsSubjects[card.day][card.mechanicCode].next(this.assignedDaysCards[card.day][card.mechanicCode]);
		} else {
			const cardIndex = this.unassignedCards.indexOf(card);
			this.unassignedCards.splice(cardIndex, 1);

			this.unassignedCardsSubject.next(this.unassignedCards);
		}
	}

	updateTranslatedCard(card: Card, newMechanic: Mechanic, position: Coordinates) {
		if (newMechanic) {
			card.day = newMechanic.day;
			card.mechanicCode = newMechanic.position;

			card.left = position.x - 180;
			card.start = this.calculateStart(card.left);
			card.topLine = position.topLine;
		} else {
			this.resetCard(card);
		}

		this.addToDestiny(newMechanic, card);
	}

	private resetCard(card: Card): void {
		card.day = undefined;
		card.mechanicCode = undefined;
		card.left = undefined;
		card.start = undefined;
		card.topLine = undefined;
	}

	private addToDestiny(newMechanic: Mechanic, card: Card): void {
		if (newMechanic) {
			this.assignedDaysCards[newMechanic.day][newMechanic.position].push(card);
			this.notifyAssigned(newMechanic.day, newMechanic.position);
		} else {
			this.unassignedCards.push(card);
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

	private calculatePosition(cards: Card[]) {
		for (let card of cards) {
			if (card.start) {
				const start = UtilsService.parseTimeFromString(card.start);
				card.left = this.calculateLeft(start);
			}
			card.width = this.calculateWidth(card.duration);
		}
	}

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
		this.unassignedCardsSubject.next(this.unassignedCards);
	}

	private notifyAllAssigned(): void {
		for (let day in this.assignedDaysCardsSubjects) {
			for (let mechanic in this.assignedDaysCardsSubjects[day]) {
				this.assignedDaysCardsSubjects[day][mechanic].next(this.assignedDaysCards[day][mechanic])
			}
		}
	}

	private notifyAssigned(day: string, mechanicCode: string): void {
		this.assignedDaysCardsSubjects[day][mechanicCode].next(this.assignedDaysCards[day][mechanicCode]);
	}

	// endregion

}
