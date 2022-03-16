export class JobLineType {

	name: string;
	code: string;
	color: string;

	constructor(jobLineType: any) {
		this.name = jobLineType.name;
		this.code = jobLineType.code;
		this.color = jobLineType.color;
	}

}
