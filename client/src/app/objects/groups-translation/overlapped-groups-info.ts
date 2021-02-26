import {CardsGroup} from "../cards-group";
import {Dayjs} from "dayjs";

export class OverlappedGroupsInfo {

	groups: CardsGroup[];
	newStart: Dayjs;
	newEnd: Dayjs;

	constructor(groups: CardsGroup[] = [], newEnd: Dayjs = undefined) {
		this.groups = groups;
		this.newEnd = newEnd;
	}

	setNewStart(newStart: Dayjs): OverlappedGroupsInfo {
		this.newStart = newStart;
		return this;
	}

}
