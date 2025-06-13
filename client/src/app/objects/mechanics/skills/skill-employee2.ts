import { Dayjs } from "dayjs";
import * as dayjs from "dayjs";

export class SkillEmployee2 {

	skillCode: string;
	employeeCode: string;
	expertise: string;
	month: Dayjs;

	constructor(skillEmployee: any) {
		this.skillCode = skillEmployee.skillCode;
		this.employeeCode = skillEmployee.employeeCode;
		this.expertise = skillEmployee.expertise;
		this.expertise = skillEmployee.expertise;
		this.month = skillEmployee.month ? dayjs(skillEmployee.month) : undefined;
	}

}
