import {HourQuarter} from "../../hour-quarter";
import {MechanicSkillsUpdate} from "../update-objects/mechanic-skills/mechanic-skills-update";
import {AppointmentDayUpdate} from "../update-objects/appointments-counter/appointment-day-update";
import {LateralPanelInfo} from "../../lateral-panel-info/lateral-panel-info";
import {MechanicLineUpdate} from "../update-objects/mechanic-line/mechanic-line-update";
import {MechanicGroupUpdate} from "../update-objects/groups/mechanic-group-update";
import {AppointmentDay} from "../../appointments/appointment-day";

export class DayTriggerTypes {

	saturatedQuarters: HourQuarter[];
	mechanicSkills: MechanicSkillsUpdate;
	lateralPanel: LateralPanelInfo;
	appointmentDay: AppointmentDayUpdate;
	mechanicLine: MechanicLineUpdate[];
	groups: MechanicGroupUpdate[];

	constructor(saturatedQuarters: HourQuarter[], appointmentDay: AppointmentDay) {
		this.saturatedQuarters = saturatedQuarters;
		this.mechanicSkills = new MechanicSkillsUpdate();
		this.lateralPanel = undefined;
		console.log('new day trigger type appointment day', appointmentDay);
		this.appointmentDay = new AppointmentDayUpdate(appointmentDay);
		this.mechanicLine = [new MechanicLineUpdate()];
		this.groups = [new MechanicGroupUpdate()];
	}

}
