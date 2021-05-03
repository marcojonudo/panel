export class SkillStyle {

    color: string;
    backgroundColor: string;

    constructor(skillStyle: any) {
        this.color = skillStyle.color;
        this.backgroundColor = skillStyle.backgroundColor;
    }

    toStyle(): any {
        return {
            'color': this.color,
            'background-color': this.backgroundColor
        }
    }

}
