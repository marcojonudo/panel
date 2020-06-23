import {CardsGroup} from "../../cards-group";
import {Card} from "../../card";

export interface SideCardLinkHandler {

	findAssignedGroup(groups: CardsGroup[], card: Card): CardsGroup;

	findUnassignedGroup(groups: CardsGroup[], groupId: string): CardsGroup;

	unlink(card: Card, group: CardsGroup): Card[];

	link(group: CardsGroup, leftGroup: CardsGroup, card: Card): CardsGroup[];

}
