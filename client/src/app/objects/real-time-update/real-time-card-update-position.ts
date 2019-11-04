import {RealTimeCardUpdate} from "./real-time-card-update";
import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";

export class RealTimeCardUpdatePosition extends RealTimeCardUpdate {

	update(realTimeService: RealTimeService, cards: Card[]): void {
		realTimeService.updatePosition(cards);
	}

}
