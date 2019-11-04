import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";

export abstract class RealTimeCardUpdate {

	abstract update(realTimeService: RealTimeService, cards: Card[]): void;

}
