import {DayGroup} from "./update-objects/groups/day-group";
import {TriggerMap} from "./trigger-maps/trigger-map";

export class GroupsUpdateObjects implements TriggerMap {

	[key: string]: DayGroup;

}
