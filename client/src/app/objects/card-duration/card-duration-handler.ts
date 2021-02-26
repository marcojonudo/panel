import {CardsGroup} from "../cards-group";
import {Card} from "../card";
import {Mechanic} from "../mechanic";
import {UpdateDurationInfo} from "./update-duration-info";

export interface CardDurationHandler {

	findGroups(card: Card): CardsGroup[];

	updateDuration(
		card: Card,
		group: CardsGroup,
		durationIncrease: number,
		widthIncrease: number,
		updatedGroups: CardsGroup[]
	): UpdateDurationInfo;

	updateNextGroupsPosition(groups: CardsGroup[], widthStep: number, durationStep: number): Card[];

	validateDurationUpdate(group: CardsGroup, card: Card, mechanic: Mechanic): CardsGroup[];

}
