import {RealTimeCardUpdate} from "./real-time-card-update";
import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";

export class RealTimeCardUpdateLinks extends RealTimeCardUpdate {

	update(realTimeService: RealTimeService, cards: Card[]): void {
		realTimeService.updateLinks(cards);
	}

}
