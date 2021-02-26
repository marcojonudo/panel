import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {Mechanic} from "../mechanic";

export class RealTimeMechanicUpdateLines extends RealTimeUpdate {

	private readonly mechanic: Mechanic;

	constructor(mechanics: any) {
		super();
		this.mechanic = new Mechanic(mechanics[0]);
	}

	update(): void {
		RealTimeService.updateLines(this.mechanic);
	}

}
