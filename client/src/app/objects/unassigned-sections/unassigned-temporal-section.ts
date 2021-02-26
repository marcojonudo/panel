import {CardsGroup} from "../cards-group";
import {CardsService} from "../../services/cards.service";
import {UnassignedSection} from "./unassigned-section";
import {Constants} from "../constants";

export class UnassignedAuxiliarySection implements UnassignedSection {

	name: string;
	dropzoneType: string;

	constructor(name: string) {
		this.name = name;
		this.dropzoneType = Constants.DROPZONE_TYPE.AUXILIARY;
	}

	findGroups(): CardsGroup[] {
		return CardsService.unassignedAuxiliaryCardsGroups;
	}

}
