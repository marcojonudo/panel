export class SkillCategory {

    code: string;
    name: string;
    jobPositionGroupCode: string;

    constructor(skillCategory: any) {
        this.code = skillCategory.code;
        this.name = skillCategory.name;
        this.jobPositionGroupCode = skillCategory.jobPositionGroupCode;
    }

}
