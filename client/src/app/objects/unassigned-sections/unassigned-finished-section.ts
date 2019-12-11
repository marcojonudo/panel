import {CardsGroup} from "../cards-group";
import {CardsService} from "../../services/cards.service";
import {UnassignedSection} from "./unassigned-section";

export class UnassignedFinishedSection implements UnassignedSection {

	cardsService: CardsService;
	name: string;

	constructor(cardsService: CardsService, name: string) {
		this.cardsService = cardsService;
		this.name = name;
	}

	findGroups(): CardsGroup[] {
		return this.cardsService.finishedCardsGroups;
	}

}
