import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {Mechanic} from "../mechanic";

export class RealTimeMechanicUpdateJobLineType extends RealTimeUpdate {

	private realTimeService: RealTimeService;
	private readonly mechanic: Mechanic;

	constructor(realTimeService: RealTimeService, mechanic: any) {
		super();
		this.realTimeService = realTimeService;
		this.mechanic = new Mechanic(mechanic);
	}

	update(): void {
		this.realTimeService.updateMechanicJobLineType(this.mechanic);
	}

}
