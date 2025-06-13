import {Constants} from "./constants";
import {EmployeeData} from "./employee-data";
import {DimensionsService} from "../services/dimensions.service";
import {AppointmentsService} from "../services/appointments.service";
import {Dayjs} from "dayjs";
import {UtilsService} from "../services/utils.service";
import * as dayjs from "dayjs";
import {Skill} from "./skills/skill";
import {ScheduleInterval} from "./schedule-interval";
import {MechanicPanelInfo} from "./mechanic-panel-info";
import {SkillEmployee} from "./skills/skill-employee";
import {MechanicAppointment} from "./mechanic-appointment";

export class Mechanic {

	id: number;
	employeeData: EmployeeData;
	day: Dayjs;
	code: string;
	panelInfo: MechanicPanelInfo;
	skills: Skill[];
	skillEmployees: SkillEmployee[];
	intervals: ScheduleInterval[];
	showInPanel: boolean;
	height: number;
	appointments: MechanicAppointment[];
	jobLineType: string;
	fixed: boolean;

	constructor(mechanic: any, highlightedSkills: Skill[] = [], skillEmployees: SkillEmployee[] = []) {
		this.id = mechanic.id;
		this.employeeData = new EmployeeData(mechanic.employeeData);
		this.day = dayjs(mechanic.day);
		this.code = this.employeeData.code;
		this.panelInfo = new MechanicPanelInfo(mechanic.mechanicPanelInfo);

		const intervals = mechanic.intervals.map((interval: any, i: number) =>
			new ScheduleInterval(
				dayjs(`${mechanic.day} ${interval.start}`, Constants.DATE_TIME_FORMAT.yyyy_MM_dd_HH_mm),
				dayjs(`${mechanic.day} ${interval.end}`, Constants.DATE_TIME_FORMAT.yyyy_MM_dd_HH_mm)
			)
		)
		this.intervals = UtilsService.sort(intervals, (interval: ScheduleInterval) => interval.start);
		this.skills = highlightedSkills;
		this.skillEmployees = skillEmployees;
		this.showInPanel = mechanic.showInPanel;
		this.height = this.panelInfo.lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;
		this.appointments = mechanic.appointments.map((appointment: any) =>
			new MechanicAppointment(
				AppointmentsService.findAppointmentType(appointment.appointmentTypeCode), appointment, this.day
			)
		);
		this.jobLineType = mechanic.jobLineType;
		this.fixed = Constants.FIXED_MECHANIC_CODES.indexOf(this.code) > -1;
	}

	setLines(lines: number): void {
		this.panelInfo.lines = lines;
		this.height = this.panelInfo.lines * DimensionsService.lineHeight;
	}

}
