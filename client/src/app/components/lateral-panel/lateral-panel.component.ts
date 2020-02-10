import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {LateralPanelInfo} from "../../objects/lateral-panel-info/lateral-panel-info";
import {Constants} from "../../objects/constants";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'app-lateral-panel',
	templateUrl: './lateral-panel.component.html',
	styleUrls: ['./lateral-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateralPanelComponent {

	@Input() info: LateralPanelInfo;

	// region Getters / setters

	get lateralPanelWidth(): number {
		return Constants.VALUE.LATERAL_PANEL_WIDTH;
	}

	// endregion

	findLateralPanelWidth(): number {
		return this.info && this.info.show ? this.lateralPanelWidth : 0;
	}

	checkShowSkills(info: LateralPanelInfo = this.info): boolean {
		return info && info.type == Constants.LATERAL_PANEL_INFO_TYPE.SKILLS;
	}

	checkShowCardDetails(info: LateralPanelInfo = this.info): boolean {
		return info && info.type == Constants.LATERAL_PANEL_INFO_TYPE.CARD_DETAILS;
	}

	checkShowAppointmentsDetails(info: LateralPanelInfo = this.info): boolean {
		return info && info.type == Constants.LATERAL_PANEL_INFO_TYPE.APPOINTMENTS_DETAILS;
	}

}
