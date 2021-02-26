import {Coordinates} from "../coordinates";

export interface ContextMenuInfo {

	type: string;
	clickCoordinates: Coordinates;

	findTop(): number;

	findBottom(): number;

	handleRemoval(): void;

}
