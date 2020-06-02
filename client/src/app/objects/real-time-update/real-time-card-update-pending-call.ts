import {RealTimeUpdate} from "./real-time-update";
import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";

export class RealTimeCardUpdatePendingCall extends RealTimeUpdate {

	private realTimeService: RealTimeService;
	private readonly cards: Card[];

	constructor(realTimeService: RealTimeService, cards: any[]) {
		super();
		this.realTimeService = realTimeService;
		this.cards = cards.map(c => new Card(c, false));
	}

	update(): void {
		this.realTimeService.updatePendingCall(this.cards[0]);
	}

}
