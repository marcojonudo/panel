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

	private unassignedCardsGroupsSubject: Subject<any>;
	private _unassignedCardsGroups$: Observable<any>;

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

	get unassignedCardsGroups$(): Observable<any> {
		return this._unassignedCardsGroups$;
	}

	set unassignedCardsGroups$(value: Observable<any>) {
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

		this.unassignedCardsGroupsSubject = new Subject<any>();
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
				this.assignedDaysCardsGroups[dayTime][mechanic.position] = assignedCardsGroups.filter(cardsGroup => {
					return cardsGroup.cards[0].day.getTime() == +dayTime && cardsGroup.cards[0].mechanicCode == mechanic.position
				});

				const subject = new Subject<any>();
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

	private updateDimensions() {
		this.unassignedCardsGroups.forEach((cardsGroup: CardsGroup) => {
			cardsGroup.cards.forEach((card) => {
				card.width = this.calculateWidth(card.duration);
			});
		});
		for (let dayTime in this.assignedDaysCardsGroups) {
			for (let mechanic in this.assignedDaysCardsGroups[dayTime]) {
				this.assignedDaysCardsGroups[dayTime][mechanic].forEach((cardsGroup: CardsGroup) => {
					cardsGroup.cards.forEach((card: Card) => {
						card.width = this.calculateWidth(card.duration);
					});
					cardsGroup.left = this.calculateLeft(cardsGroup.cards[0].start);
				});
			}
		}
	}

	// endregion

	// region Translate card

	removeFromOrigin(cardsGroup: CardsGroup): any {
		if (cardsGroup.cards[0].mechanicCode) {
			const card = cardsGroup.cards[0];
			const cardsGroupIndex = this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode].indexOf(cardsGroup);
			this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode].splice(cardsGroupIndex, 1);

			// console.time('[cardsService] assignedDaysCards.next()');
			this.assignedDaysCardsGroupsSubjects[card.day.getTime()][card.mechanicCode].next(
				this.assignedDaysCardsGroups[card.day.getTime()][card.mechanicCode]
			);
			// console.timeEnd('[cardsService] assignedDaysCards.next()');
		} else {
			const cardsGroupIndex = this.unassignedCardsGroups.findIndex(group => group.id == cardsGroup.id);
			this.unassignedCardsGroups = this.unassignedCardsGroups.filter((g, i) => i != cardsGroupIndex);

			this.notifyUnassigned();
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

		this.addToDestiny(newMechanic, cardsGroup);
		this.http.put(`${environment.serverUrl}/panel/cards/position`, cardsGroup.cards).subscribe();
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
			this.assignedDaysCardsGroups[newMechanic.day.getTime()][newMechanic.position] =
				this.assignedDaysCardsGroups[newMechanic.day.getTime()][newMechanic.position].concat(cardsGroup);
			this.notifyAssigned(newMechanic.day, newMechanic.position);
		} else {
			this.unassignedCardsGroups.push(cardsGroup);
			this.notifyUnassigned();
		}
	}

	handleCardsGroupsListUpdate(cardsGroups: CardsGroup[], newCardsGroups: CardsGroup[]): CardsGroup[] {
		const removedGroupIndex = cardsGroups.findIndex(group =>
			!newCardsGroups.find(g => g.id == group.id)
		);

		let replacedCardsGroups;
		/* this.unassignedCardsGroups tiene un grupo que no tiene unassignedCardsGroup; es decir, se ha
		*  sacado un grupo de la cinta */
		if (removedGroupIndex > -1) {
			cardsGroups.splice(removedGroupIndex, 1);
		} else {
			/* Si la longitud es la misma, es que se ha modificado el zoom (ancho) del grid y de las fichas */
			if (cardsGroups.length == newCardsGroups.length) {
				replacedCardsGroups = newCardsGroups;
			} else {
				/* Si no falta sobra niguna ficha en this.unassignedCardsGroup, significa que unassigendCardsGroups
				*  tiene una nueva; es decir, se ha soltado un grupo en la cinta (última posición) */
				cardsGroups.push(newCardsGroups[newCardsGroups.length - 1]);
			}
		}

		return replacedCardsGroups;
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
