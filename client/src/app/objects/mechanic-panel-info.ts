export class MechanicPanelInfo {

	id: number;
	position: string;
	lines: number;
	jobLineType: string;

	constructor(mechanicPanelInfo: any) {
		this.id = mechanicPanelInfo.id;
		this.position = mechanicPanelInfo.position;
		this.lines = mechanicPanelInfo.lines;
		this.jobLineType = mechanicPanelInfo.jobLineType;
	}

}
