export class Skill {

	name: string;
	code: string;
	backgroundColor: string;
	color: string;
	expertise: string;

	constructor(skill: any, expertise: string = undefined) {
		this.name = skill.name;
		this.code = skill.code;
		this.backgroundColor = skill.backgroundColor;
		this.color = skill.color;
		this.expertise = expertise;
	}

}
