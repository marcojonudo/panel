import {CardsService} from "../../services/cards.service";

export interface UnassignedSection {

	cardsService: CardsService;
	name: string;
	dropzoneType: string;

	findGroups();

}
