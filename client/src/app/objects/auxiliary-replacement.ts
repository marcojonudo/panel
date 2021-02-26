import {CardsGroup} from "./cards-group";
import {Card} from "./card";
import {OverlappedGroupsInfo} from "./groups-translation/overlapped-groups-info";

export class AuxiliaryReplacement {

	auxiliaryGroup: CardsGroup;
	group: CardsGroup;
	coincidentCards: Card[];
	differentCards: Card[];
	validationInfo: OverlappedGroupsInfo;

	constructor(auxiliaryGroup: CardsGroup, group: CardsGroup, coincidentCards: Card[]) {
		this.auxiliaryGroup = auxiliaryGroup;
		this.group = group;
		this.coincidentCards = coincidentCards;
		this.differentCards = group.cards.filter(card =>
			this.coincidentCards.find(c => c.panelId == card.panelId) == undefined
		);
	}

}
