import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {Mechanic} from "../mechanic";

export class RealTimeMechanicUpdateJobLineType extends RealTimeUpdate {

	private readonly mechanic: Mechanic;

	constructor(mechanic: any) {
		super();
		this.mechanic = new Mechanic(mechanic);
	}

	update(): void {
		RealTimeService.updateMechanicJobLineType(this.mechanic);
	}

}
