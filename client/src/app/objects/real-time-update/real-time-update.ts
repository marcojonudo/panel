import {RealTimeService} from "../../services/real-time.service";

export abstract class RealTimeUpdate {

	abstract update(realTimeService: RealTimeService): void;

}
