import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {Mechanic} from "../mechanic";

export class RealTimeMechanicUpdatePosition extends RealTimeUpdate {

	private readonly mechanics: Mechanic[];

	constructor(mechanics: any) {
		super();
		mechanics.forEach(m => m.day = new Date(m.day));
		this.mechanics = mechanics;
	}

	update(realTimeService: RealTimeService): void {
		realTimeService.updateMechanicPosition(this.mechanics);
	}

}
