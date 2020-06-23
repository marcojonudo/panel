import {CardsGroup} from "../cards-group";
import {Card} from "../card";
import {SideCardLinkHandler} from "./side/side-card-link-handler";

export interface CardLinkHandler {

	findGroups(card: Card): CardsGroup[];

	findNextGroup(card: Card, sideLinkHandler: SideCardLinkHandler): CardsGroup;

	unlink(card: Card, sideLinkHandler: SideCardLinkHandler): Card[];

	link(card: Card, sideLinkHandler: SideCardLinkHandler): Card[];

}
