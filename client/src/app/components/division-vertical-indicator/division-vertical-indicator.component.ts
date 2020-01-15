import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Constants} from "../../objects/constants";
import {ContextMenuInfo} from "../../objects/context-menu-info";
import {UtilsService} from "../../services/utils.service";
import {DimensionsService} from "../../services/dimensions.service";

@Component({
	selector: 'app-division-vertical-indicator',
	templateUrl: './division-vertical-indicator.component.html',
	styleUrls: ['./division-vertical-indicator.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DivisionVerticalIndicatorComponent {

	@Input() contextMenuInfo: ContextMenuInfo;

	get lineDefaultHeight(): number {
		return Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

	roundToCardInterval(left: number): number {
		return Constants.VALUE.MECHANIC_INFO_WIDTH +
			UtilsService.roundFloor(left - Constants.VALUE.MECHANIC_INFO_WIDTH, DimensionsService.intervalWidth);
	}

}
