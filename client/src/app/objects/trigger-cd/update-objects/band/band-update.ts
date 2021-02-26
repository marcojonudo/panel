import {GroupUpdate} from "../groups/group-update";

export class BandUpdate {

	section: string;
	groupsUpdate: GroupUpdate[];

	constructor(section: string, groupsUpdate: GroupUpdate[]) {
		this.section = section;
		this.groupsUpdate = groupsUpdate;
	}

}
