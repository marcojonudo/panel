export class EmployeeData {

	code: string;
	name: string;
	surnames: string[];
	completeName: string;

	constructor(employeeData: any) {
		this.code = employeeData.code;
		this.name = employeeData.name;
		this.surnames = [];
		if (employeeData.surname1) this.surnames.push(employeeData.surname1)
		if (employeeData.surname2) this.surnames.push(employeeData.surname2)
		this.completeName = `${this.name} ${this.surnames ? this.surnames.map(s => `${s.charAt(0)}.`).join(" ") : ''}`;
	}

}
