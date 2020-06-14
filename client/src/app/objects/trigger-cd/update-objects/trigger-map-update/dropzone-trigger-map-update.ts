import {Dayjs} from "dayjs";
import {TriggerMapUpdate} from "./trigger-map-update";
import {DropzonesTriggerMap} from "../../trigger-maps/dropzones-trigger-map";

export interface DropzoneTriggerMapUpdate extends TriggerMapUpdate {

	start: Dayjs;

	updateTriggerMap(triggerMap: DropzonesTriggerMap, start: Dayjs, type: string, value: any): void;

}
