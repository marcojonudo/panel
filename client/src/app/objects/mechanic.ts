import {Constants} from "./constants";
import {PersonalData} from "./personal-data";
import {Schedule} from "./schedule";
import {Skill} from "./skill";
import {AppointmentSchedule} from "./appointment-schedule";
import {ScheduleInterval} from "./schedule-interval";
import {DimensionsService} from "../services/dimensions.service";
import {AppointmentsService} from "../services/appointments.service";

export class Mechanic {

	id: number;
	day: Date;
	code: string;
	panelPosition: string;
	personalData: PersonalData;
	skills: Skill[];
	highlightedSkills: Skill[];
	schedules: ScheduleInterval[] = [];
	lines: number;
	showInPanel: boolean;
	height: number;
	appointments: AppointmentSchedule[];
	jobLineType: string;
	fixed: boolean;

	constructor(
		day: Date,
		mechanic: any,
		skills: any[],
		highlightedSkills: Skill[]
	) {
		this.id = mechanic.id;
		this.day = day;
		this.code = mechanic.employee.code;
		this.panelPosition = mechanic.panelPosition;
		this.personalData = new PersonalData(mechanic.employee);
		/* Las líneas de taller y tienda no tienen habilidades */
		if (mechanic.employee.employeeSkills) {
			this.skills = skills.map(skill => {
				const children = skill.children.map(child => {
					const employeeSkill = mechanic.employee.employeeSkills.find(s => s.skill.name == child.name);
					return new Skill(child, employeeSkill ? employeeSkill.skillExpertise.level : undefined);
				});
				/* La experiencia es siempre undefined, ya que las categorías padre no tienen especialización por parte de
				*  los empleados. Sólo sirven para estructurar las habilidades */
				return new Skill(skill, undefined, children);
			});
			this.highlightedSkills = highlightedSkills.map(skill => {
				const employeeSkill = mechanic.employee.employeeSkills.find(s => s.skill.name == skill.name);
				return new Skill(skill, employeeSkill ? employeeSkill.skillExpertise.level : undefined);
			});
		}
		if (mechanic.schedule.morningStart) {
			this.schedules.push(new ScheduleInterval(mechanic.schedule.morningStart, mechanic.schedule.morningEnd))
		}
		if (mechanic.schedule.afternoonStart) {
			this.schedules.push(new ScheduleInterval(mechanic.schedule.afternoonStart, mechanic.schedule.afternoonEnd))
		}
		this.lines = mechanic.lines;
		this.showInPanel = mechanic.showInPanel;
		this.height = this.lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;
		this.appointments = mechanic.appointments.map((appointment: any) =>
			new AppointmentSchedule(
				this,
				AppointmentsService.findAppointmentType(appointment.appointmentTypeCode),
				appointment.schedule.start,
				appointment.schedule.end
			)
		);
		this.jobLineType = mechanic.jobLineType;
		this.fixed = Constants.FIXED_MECHANIC_CODES.indexOf(this.code) > -1;
	}

	setLines(lines: number): void {
		this.lines = lines;
		this.height = this.lines * DimensionsService.lineHeight;
	}

}
