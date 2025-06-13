import * as dayjs from "dayjs";
import { EmployeeData } from '../employee-data';
import { Dayjs } from 'dayjs';
import { MechanicPanelInfo } from '../mechanic-panel-info';
import { SkillEmployee } from '../skills/skill-employee';
import { MechanicAppointment } from '../mechanic-appointment';
import { Constants } from '../constants';
import { ScheduleInterval2 } from './schedule-interval2';
import { SkillEmployee2 } from './skills/skill-employee2';

export class Mechanic2 {

	id: number;
	employeeData: EmployeeData;
	day: Dayjs;
	code: string;
	panelInfo: MechanicPanelInfo;
	skills: SkillEmployee[];
	intervals: ScheduleInterval2[];
	height: number;
	appointments: MechanicAppointment[];

	constructor(mechanic: any) {
		this.id = mechanic.id;
		this.employeeData = new EmployeeData(mechanic.employeeData);
		this.day = dayjs(mechanic.day);
		this.code = this.employeeData.code;
		this.panelInfo = new MechanicPanelInfo(mechanic.panelInfo);
		this.intervals = mechanic.intervals.map(i => new ScheduleInterval2(this.day, i));
		this.skills = mechanic.skills.map(s => new SkillEmployee2(s));
		this.height = this.panelInfo.lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;

		// this.appointments = mechanic.appointments.map((appointment: any) =>
		// 	new MechanicAppointment(
		// 		AppointmentsService.findAppointmentType(appointment.appointmentTypeCode), appointment, this.day
		// 	)
		// );
	}

	// setLines(lines: number): void {
	// 	this.panelInfo.lines = lines;
	// 	this.height = this.panelInfo.lines * DimensionsService.lineHeight;
	// }

}
