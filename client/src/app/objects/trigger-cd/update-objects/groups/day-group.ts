import {Dayjs} from "dayjs";
import {CardsGroup} from "../../../cards-group";
import {GroupUpdate} from "./group-update";

export class DayGroup {

	day: Dayjs;
	group: CardsGroup;
	groupUpdate: GroupUpdate;

	constructor(day: Dayjs = undefined, group: CardsGroup = undefined) {
		this.day = day;
		this.group = group;
	}

}
