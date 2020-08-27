import {PersonalData} from "./personal-data";

export class Employee {

	code: string;
	personalData: PersonalData;

	constructor(employee: any) {
		this.code = employee.code;
		this.personalData = new PersonalData(employee);
	}

}
