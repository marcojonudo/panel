import {RealTimeCardUpdate} from "./real-time-card-update";
import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";

export class RealTimeCardUpdateDuration extends RealTimeCardUpdate {

	update(realTimeService: RealTimeService, cards: Card[]): void {
		realTimeService.updateDuration(cards);
	}

}
