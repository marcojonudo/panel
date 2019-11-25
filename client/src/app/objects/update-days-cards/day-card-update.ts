import {CardsGroup} from "../cards-group";

export interface DayCardUpdate {

	day: Date;
	mechanicCode: string;
	newGroup: CardsGroup;

	update(assignedDaysCardsGroups: any): void;

}
