import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ContextMenuInfo} from "../../objects/context-menu/context-menu-info";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-context-menu',
	templateUrl: './context-menu.component.html',
	styleUrls: ['./context-menu.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {

	@Input() contextMenuInfo: ContextMenuInfo;

	get groupType(): string {
		return Constants.CONTEXT_MENU_TYPE.GROUP;
	}

	get dragScheduleType(): string {
		return Constants.CONTEXT_MENU_TYPE.DRAG_SCHEDULE;
	}

	findLeft(x: number): number {
		return x;
	}

	checkShowContextMenu(type: string, contextMenuInfoType: string = this.contextMenuInfo.type) {
		return type == contextMenuInfoType;
	}

}
