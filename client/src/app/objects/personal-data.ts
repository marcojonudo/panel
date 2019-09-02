import {UtilsService} from "../services/utils.service";
import {Constants} from "./constants";

export class PersonalData {

	name: string;
	surnames: string[];

	constructor(personalData: any) {
		this.name = personalData.name;
		this.surnames = personalData.surnames;
	}

}
