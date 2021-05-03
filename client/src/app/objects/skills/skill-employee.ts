import {Skill} from "./skill";
import {Dayjs} from "dayjs";
import * as dayjs from "dayjs";

export class SkillEmployee {

    skill: Skill;
    employeeCode: string;
    expertise: string;
    month: Dayjs;

    constructor(skillEmployee: any) {
        this.skill = new Skill(skillEmployee.skill);
        this.employeeCode = skillEmployee.employeeCode;
        this.expertise = skillEmployee.expertise;
        this.expertise = skillEmployee.expertise;
        this.month = skillEmployee.month ? dayjs(skillEmployee.month) : undefined;
    }

}
