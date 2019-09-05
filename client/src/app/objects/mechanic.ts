import {Constants} from "./constants";
import {PersonalData} from "./personal-data";
import {Schedule} from "./schedule";

export class Mechanic {

	day: Date;
	position: string;
	personalData: PersonalData;
	schedule: Schedule;
	lines: number;
	height: number;

	constructor(day: Date, position: string, personalData: any, schedule: any, lines: number) {
		this.day = day;
		this.position = position;
		this.personalData = new PersonalData(personalData);
		this.schedule = new Schedule(schedule);
		this.lines = lines;
		this.height = lines * Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

}
