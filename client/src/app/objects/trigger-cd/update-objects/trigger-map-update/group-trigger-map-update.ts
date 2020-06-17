import {TriggerMapUpdate} from "./trigger-map-update";
import {GroupsTriggerMap} from "../../trigger-maps/groups-trigger-map";

export interface GroupTriggerMapUpdate extends TriggerMapUpdate {

	groupId: string;

	updateTriggerMap(triggerMap: GroupsTriggerMap, groupId: string, type: string, value: any): void;

}
