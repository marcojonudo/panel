import {SkillStyle} from "./skill-style";

export class SkillCode {

    code: string;
    style: SkillStyle;
    order: number;

    constructor(skillCode: any) {
        this.code = skillCode.code;
        this.style = new SkillStyle(skillCode.style);
        this.order = skillCode.order;
    }

}
