import {GroupColor} from "./group-color";

export class Group {

	code: number;
	color: GroupColor;
	name: string;
	shortName: string;

	constructor(group: any) {
		this.code = group.code;
		this.color = new GroupColor(group.color);
		this.name = group.name;
		this.shortName = group.shortName;
	}

}
