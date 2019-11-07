import {RealTimeUpdate} from "./real-time-update";
import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";

export class RealTimeCardUpdateDuration extends RealTimeUpdate {

	private readonly cards: Card[];

	constructor(cards: any[]) {
		super();
		this.cards = cards.map(c => new Card(c, false));
	}

	update(realTimeService: RealTimeService): void {
		realTimeService.updateDuration(this.cards);
	}

}
