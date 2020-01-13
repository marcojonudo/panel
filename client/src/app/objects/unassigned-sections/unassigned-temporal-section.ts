import {CardsGroup} from "../cards-group";
import {CardsService} from "../../services/cards.service";
import {UnassignedSection} from "./unassigned-section";
import {Constants} from "../constants";

export class UnassignedTemporalSection implements UnassignedSection {

	cardsService: CardsService;
	name: string;
	dropzoneType: string;

	constructor(cardsService: CardsService, name: string) {
		this.cardsService = cardsService;
		this.name = name;
		this.dropzoneType = Constants.DROPZONE_TYPE.TEMPORAL;
	}

	findGroups(): CardsGroup[] {
		return this.cardsService.unassignedTemporalCardsGroups;
	}

}
