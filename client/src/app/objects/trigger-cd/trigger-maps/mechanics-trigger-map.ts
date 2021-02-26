import {MechanicTriggerTypes} from "./mechanic-trigger-types";
import {Mechanic} from "../../mechanic";
import {TriggerMap} from "./trigger-map";

export class MechanicsTriggerMap implements TriggerMap {

	[key: string]: MechanicTriggerTypes;

	constructor(mechanics: Mechanic[]) {
		mechanics.forEach((mechanic: Mechanic) => {
			this[mechanic.code] = new MechanicTriggerTypes();
		});
	}

}
