import {HourQuarter} from "../../hour-quarter";
import {MechanicSkillsUpdate} from "../update-objects/mechanic-skills/mechanic-skills-update";
import {AppointmentsCounterUpdate} from "../update-objects/appointments-counter/appointments-counter-update";
import {LateralPanelInfo} from "../../lateral-panel-info/lateral-panel-info";
import {MechanicLineUpdate} from "../update-objects/mechanic-line/mechanic-line-update";
import {MechanicGroupUpdate} from "../update-objects/groups/mechanic-group-update";
import {AppointmentsCounter} from "../../appointments-counter";

export class DayTriggerTypes {

	saturatedQuarters: HourQuarter[];
	mechanicSkills: MechanicSkillsUpdate;
	lateralPanel: LateralPanelInfo;
	appointmentsCounter: AppointmentsCounterUpdate;
	mechanicLine: MechanicLineUpdate[];
	groups: MechanicGroupUpdate[];

	constructor(saturatedQuarters: HourQuarter[], appointmentsCounter: AppointmentsCounter) {
		this.saturatedQuarters = saturatedQuarters;
		this.mechanicSkills = new MechanicSkillsUpdate();
		this.lateralPanel = undefined;
		this.appointmentsCounter = new AppointmentsCounterUpdate(appointmentsCounter);
		this.mechanicLine = [new MechanicLineUpdate()];
		this.groups = [new MechanicGroupUpdate()];
	}

}
