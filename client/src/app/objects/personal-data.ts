
export class PersonalData {

	name: string;
	surnames: string[];
	completeName: string;

	constructor(personalData: any) {
		this.name = personalData.name;
		this.surnames = personalData.surnames;
		this.completeName = `${this.name} ${this.surnames.map(s => `${s.charAt(0)}.`).join(" ")}`;
	}

}
