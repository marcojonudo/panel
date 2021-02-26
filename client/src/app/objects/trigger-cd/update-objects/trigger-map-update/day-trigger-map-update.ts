import {Dayjs} from "dayjs";
import {TriggerMapUpdate} from "./trigger-map-update";
import {DaysTriggerMap} from "../../trigger-maps/days-trigger-map";

export interface DayTriggerMapUpdate extends TriggerMapUpdate {

	day: Dayjs;

	updateTriggerMap(triggerMap: DaysTriggerMap, day: Dayjs, type: string, value: any): void;

}
