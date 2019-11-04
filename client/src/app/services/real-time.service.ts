import {Injectable} from '@angular/core';
import {Card} from "../objects/card";
import {CardsService} from "./cards.service";
import {TimeService} from "./time.service";
import {RealTimeUpdateInfo} from "../objects/real-time-update/real-time-update-info";
import {environment} from "../../environments/environment";
import {RealTimeCardUpdatePosition} from "../objects/real-time-update/real-time-card-update-position";

@Injectable({
	providedIn: 'root'
})
export class RealTimeService {

	private readonly UPDATE_TYPE = {
		position: () => new RealTimeCardUpdatePosition()
	};

	constructor(
		private cardsService: CardsService,
		private timeService: TimeService
	) {
		this.connectUpdatePublisher();
	}

	connectUpdatePublisher(): void {
		const eventSource = new EventSource(`${environment.serverUrl}/panel/publisher`);
		eventSource.onmessage = event => {
			const updateInfo: RealTimeUpdateInfo = JSON.parse(event.data);
			console.log('Received update info:', updateInfo);
			const updateType = this.UPDATE_TYPE[updateInfo.updateId]();
			updateType.update(this, updateInfo.cards.map(c => new Card(c)));
		};
	}

	updatePosition(cards: Card[]): void {
		/* En función de si la ficha estaba asignada antes de moverse en otro terminal o no, se busca en los
		*  grupos asignados o en los de la cinta */
		const groups = cards[0].lastDay ?
			this.cardsService.findLineGroups(cards[0].lastDay, cards[0].lastMechanicCode, cards[0].lastLine) :
			this.cardsService.unassignedCardsGroups;
		const group = this.cardsService.findCardGroup(groups, cards[0].id);

		/* En este caso, left se calcula a partir de la hora que ya tiene asignada la ficha (ya se ha movido antes en
		*  otro terminal) */
		const left = this.timeService.calcLeft(cards[0].start);
		this.cardsService.updatePosition(group, cards[0].day, cards[0].line, left);

		this.cardsService.removeFromOrigin(group);
		this.cardsService.updateTranslatedCards(group, cards[0].day, cards[0].mechanicCode, false);
	}

}
