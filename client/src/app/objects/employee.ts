export class Employee {

	code: string;
	name: string;
	surname1: string;
	surname2: string;
	surnames: string[];
	shortName: string;
	completeName: string;

	constructor(employee: any) {
		this.code = employee.code;
		this.name = employee.name;
		this.surname1 = employee.surname1;
		this.surname2 = employee.surname2;
		this.surnames = [this.surname1, this.surname2].filter(surname => surname != undefined);
		this.shortName = `${this.name} ${this.surnames ? this.surnames.map(s => `${s.charAt(0)}.`).join(" ") : ''}`;
		this.completeName = `${this.name} ${this.surnames ? this.surnames.join(" ") : ''}`;
	}

}
