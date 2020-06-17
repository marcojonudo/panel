import {GenericUpdate} from "./generic-update";
import {ContextMenuInfo} from "../../../context-menu/context-menu-info";

export class ContextMenuUpdate implements GenericUpdate {

	trigger: boolean;
	contextMenuInfo: ContextMenuInfo;

	constructor(contextMenuInfo: ContextMenuInfo, trigger: boolean = false) {
		this.contextMenuInfo = contextMenuInfo;
		this.trigger = trigger;
	}

}
