import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {Mechanic} from "../mechanic";

export class RealTimeMechanicUpdateLines extends RealTimeUpdate {

	private readonly mechanic: Mechanic;

	constructor(mechanics: any) {
		super();
		mechanics[0].day = new Date(mechanics[0].day);
		this.mechanic = mechanics[0];
	}

	update(realTimeService: RealTimeService): void {
		realTimeService.updateLines(this.mechanic);
	}

}
