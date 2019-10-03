export class Skill {

	name: string;
	code: string;
	backgroundColor: string;
	color: string;
	expertise: string;
	children: Skill[];

	constructor(skill: any, expertise: string = undefined, children: Skill[] = []) {
		this.name = skill.name;
		this.code = skill.code;
		this.backgroundColor = skill.backgroundColor;
		this.color = skill.color;
		this.expertise = expertise;
		this.children = children;
	}

}
