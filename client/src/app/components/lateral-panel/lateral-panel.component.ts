import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {LateralPanelInfo} from "../../objects/lateral-panel-info/lateral-panel-info";
import {Constants} from "../../objects/constants";
import {animate, style, transition, trigger} from "@angular/animations";
import {Dayjs} from "dayjs";

@Component({
	selector: 'app-lateral-panel',
	templateUrl: './lateral-panel.component.html',
	styleUrls: ['./lateral-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateralPanelComponent {

	@Input() day: Dayjs;
	@Input() info: LateralPanelInfo;

	// region Getters / setters

	get lateralPanelWidth(): number {
		return Constants.VALUE.LATERAL_PANEL_WIDTH;
	}

	get mechanicSkillsType(): string {
		return Constants.UPDATE_OBJECT.MECHANIC_SKILLS;
	}

	get cardDetailsType(): string {
		return Constants.LATERAL_PANEL_INFO_TYPE.CARD_DETAILS;
	}

	get appointmentsDetailsType(): string {
		return Constants.LATERAL_PANEL_INFO_TYPE.APPOINTMENTS_DETAILS;
	}

	// endregion

	findLateralPanelWidth(): number {
		return this.info && this.info.show ? this.lateralPanelWidth : 0;
	}

	checkShow(type: string, info: LateralPanelInfo = this.info): boolean {
		return info && info.type == type;
	}

	findParams(type: string, info: LateralPanelInfo = this.info): any {
		return this.checkShow(type) ? info.params : undefined;
	}

}
