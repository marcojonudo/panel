import {GroupColor} from "./group-color";
import {AppointmentType} from "./appointment-type";

export class Group {

	code: number;
	color: GroupColor;
	name: string;
	shortName: string;
	appointmentType: AppointmentType;

	constructor(group: any) {
		this.code = group.code;
		this.color = new GroupColor(group.color);
		this.name = group.name;
		this.shortName = group.shortName;
		this.appointmentType = new AppointmentType(group.appointmentType);
	}

}
