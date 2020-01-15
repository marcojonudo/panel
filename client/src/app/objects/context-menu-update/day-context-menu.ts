import {ContextMenuInfo} from "../context-menu-info";

export class DayContextMenu {

	day: Date;
	contextMenuInfo: ContextMenuInfo;

	constructor(day: Date = undefined, contextMenuInfo: ContextMenuInfo = undefined) {
		this.day = day;
		this.contextMenuInfo = contextMenuInfo;
	}

}
