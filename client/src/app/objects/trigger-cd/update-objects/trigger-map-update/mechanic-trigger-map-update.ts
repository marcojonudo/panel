import {TriggerMapUpdate} from "./trigger-map-update";
import {MechanicsTriggerMap} from "../../trigger-maps/mechanics-trigger-map";

export interface MechanicTriggerMapUpdate extends TriggerMapUpdate {

	mechanicCode: string;

	updateTriggerMap(triggerMap: MechanicsTriggerMap, mechanicCode: string, type: string, value: any): void;

}
