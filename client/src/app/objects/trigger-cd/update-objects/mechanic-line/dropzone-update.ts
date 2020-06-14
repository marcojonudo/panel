import {Dayjs} from "dayjs";
import {Constants} from "../../../constants";
import {DropzoneTriggerMapUpdate} from "../trigger-map-update/dropzone-trigger-map-update";
import {DropzonesTriggerMap} from "../../trigger-maps/dropzones-trigger-map";

export class DropzoneUpdate implements DropzoneTriggerMapUpdate {

	type: string;
	start: Dayjs;
	value: boolean;

	constructor(start: Dayjs = undefined, value: boolean = true) {
		this.type = Constants.UPDATE_OBJECT.DROPZONE;
		this.start = start;
		this.value = value;
	}

	updateTriggerMap(
		dropzonesTriggerMap: DropzonesTriggerMap,
		start: Dayjs,
		type: string = this.type,
		value: Boolean = this.value
	): void {
		dropzonesTriggerMap[start.valueOf()] = this;
	}

}
