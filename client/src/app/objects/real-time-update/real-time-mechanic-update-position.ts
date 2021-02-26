import {RealTimeUpdate} from "./real-time-update";
import {RealTimeService} from "../../services/real-time.service";
import {Mechanic} from "../mechanic";

export class RealTimeMechanicUpdatePosition extends RealTimeUpdate {

	private realTimeService: RealTimeService;
	private readonly mechanics: Mechanic[];

	constructor(realTimeService: RealTimeService, mechanics: any) {
		super();
		this.realTimeService = realTimeService;
		this.mechanics = mechanics.map(mechanic => new Mechanic(mechanic));
	}

	update(): void {
		this.realTimeService.updateMechanicPosition(this.mechanics);
	}

}
