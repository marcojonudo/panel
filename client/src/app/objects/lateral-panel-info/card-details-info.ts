import {LateralPanelInfo} from "./lateral-panel-info";
import {Constants} from "../constants";
import {Card} from "../card";

export class CardDetailsInfo implements LateralPanelInfo {

	type: string;
	params: Card;
	show: boolean;

	constructor(card: Card) {
		this.type = Constants.LATERAL_PANEL_INFO_TYPE.CARD_DETAILS;
		this.params = card;
		this.show = card != undefined;
	}

}
