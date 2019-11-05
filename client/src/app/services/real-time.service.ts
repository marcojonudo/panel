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

	private _sessionId: string;

	constructor(
		private cardsService: CardsService,
		private timeService: TimeService
	) {
		this.connectUpdatePublisher();
	}

	// region Getters / setters

	get sessionId(): string {
		return this._sessionId;
	}

	set sessionId(value: string) {
		this._sessionId = value;
	}

	// endregion

	connectUpdatePublisher(): void {
		const eventSource = new EventSource(`${environment.serverUrl}/panel/publisher`);
		eventSource.onmessage = event => {
			if (event.lastEventId != this.sessionId) {
				const updateInfo: RealTimeUpdateInfo = JSON.parse(event.data);
				console.log('Received update info:', updateInfo);
				const updateType = this.UPDATE_TYPE[updateInfo.updateId]();
				updateType.update(this, updateInfo.cards.map(c => new Card(c, false)));
			}
		};
	}

	updatePosition(cards: Card[]): void {
		/* En función de si la ficha estaba asignada antes de moverse en otro terminal o no, se busca en los
		*  grupos asignados o en los de la cinta */
		const allGroups = cards[0].lastDay ?
			this.cardsService.assignedCardsGroups :
			this.cardsService.unassignedCardsGroups;

		/* Si se mueve un grupo con varias fichas, para cada una de ellas se actualizaría la posición del grupo. Para
		*  evitarlo, se almacenan los grupos ya procesados para no volver a hacerlo */
		const processedGroups = [];
		cards.forEach(card => {
			const group = this.cardsService.findCardGroup(allGroups, card.id);
			if (group && processedGroups.indexOf(group) == -1) {
				/* En este caso, left se calcula a partir de la hora que ya tiene asignada la ficha (ya se ha movido antes en
				*  otro terminal) */
				const left = this.timeService.calcLeft(card.start);
				this.cardsService.updatePosition(group, card.day, card.line, left);

				this.cardsService.removeFromOrigin(group);
				this.cardsService.updateTranslatedCards(group, card.day, card.mechanicCode, false);

				processedGroups.push(group);
			}
		});
	}

}
