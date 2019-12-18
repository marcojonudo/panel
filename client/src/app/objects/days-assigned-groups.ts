import {CardsGroup} from "./cards-group";

export interface DaysAssignedGroups {

	[key: number]: { [key: string]: CardsGroup[] };

}
