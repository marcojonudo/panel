import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {Mechanic} from "../mechanic";

export class RealTimeMechanicUpdateLines extends RealTimeUpdate {

	private realTimeService: RealTimeService;
	private readonly mechanic: Mechanic;

	constructor(realTimeService: RealTimeService, mechanics: any) {
		super();
		this.realTimeService = realTimeService;
		this.mechanic = new Mechanic(mechanics[0]);
	}

	update(): void {
		this.realTimeService.updateLines(this.mechanic);
	}

}
