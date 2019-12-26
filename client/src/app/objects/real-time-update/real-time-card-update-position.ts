import {RealTimeUpdate} from "./real-time-update";
import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";
import {CardsService} from "../../services/cards.service";

export class RealTimeCardUpdatePosition extends RealTimeUpdate {

	private readonly cards: Card[];

	constructor(cardsService: CardsService, cards: any[]) {
		super();
		this.cards = cards.map(c => new Card(c, cardsService.buildPanelId(cards, c), false));
	}

	update(realTimeService: RealTimeService): void {
		realTimeService.updatePosition(this.cards);
	}

}
