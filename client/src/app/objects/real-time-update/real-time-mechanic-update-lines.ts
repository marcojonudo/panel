import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {Mechanic} from "../mechanic";

export class RealTimeMechanicUpdateLines extends RealTimeUpdate {

	private readonly mechanic: Mechanic;

	constructor(mechanic: any) {
		super();
		mechanic.day = new Date(mechanic.day);
		this.mechanic = mechanic;
	}

	update(realTimeService: RealTimeService): void {
		realTimeService.updateLines(this.mechanic);
	}

}
