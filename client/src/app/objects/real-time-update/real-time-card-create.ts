import {RealTimeUpdate} from "./real-time-update";
import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";
import {CardsService} from "../../services/cards.service";

export class RealTimeCardCreate extends RealTimeUpdate {

	private realTimeService: RealTimeService;
	private readonly cards: Card[];

	constructor(realTimeService: RealTimeService, cards: any[]) {
		super();
		this.realTimeService = realTimeService;
		this.cards = cards.map(c => new Card(c, false));
	}

	update(): void {
		this.realTimeService.createCards(this.cards);
	}

}
