import {Constants} from "../../constants";
import {UpdateObject} from "./update-object";
import {DropzonesUpdateObjects} from "../dropzones-update-objects";
import {Dayjs} from "dayjs";

export class DropzoneUpdate implements UpdateObject {

	type: string;
	value: Boolean;

	constructor(value: Boolean = new Boolean) {
		this.type = Constants.UPDATE_OBJECT.DROPZONE;
		this.value = value;
	}

	updateObjects(
		dropzonesUpdateObjects: DropzonesUpdateObjects,
		start: Dayjs,
		value: Boolean = this.value,
		type: string = this.type
	): void {
		dropzonesUpdateObjects[start.valueOf()] = value;
	}

}
