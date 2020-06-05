import {Dayjs} from "dayjs";
import {DropzoneUpdate} from "../update-objects/dropzone-update";

export class DayMechanic {

	day: Dayjs;
	mechanicCode: string;
	dropzoneUpdate: DropzoneUpdate;

	constructor(day: Dayjs = undefined, mechanicCode: string = undefined, updateDropzone: boolean = undefined) {
		this.day = day;
		this.mechanicCode = mechanicCode;
		this.dropzoneUpdate = updateDropzone || (!day && !mechanicCode) ? new DropzoneUpdate() : undefined;
	}

}
