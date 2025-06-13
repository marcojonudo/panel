import {SkillCode} from "./skill-code";
import {SkillStyle} from "./skill-style";
import {SkillCategory} from "./skill-category";

export class Skill {

    name: string;
    code: SkillCode;
    expertisePercentage: number;
	style: SkillStyle;
	category: SkillCategory;
    order: number;
    children: Skill[];

    constructor(skill: any) {
        this.name = skill.name;
        this.code = skill.code ? new SkillCode(skill.code) : undefined;
        this.expertisePercentage = skill.expertisePercentage;
        this.category = new SkillCategory(skill.category);
        this.style = new SkillStyle(skill.style);
        this.order = skill.order;
        this.children = skill.children.map(skill => new Skill(skill));
    }

}
