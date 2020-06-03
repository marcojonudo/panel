import {UpdateObjects} from "../update-objects";

export interface UpdateObject {

	type: string;
	value: any;

	updateObjects(updateObjects: UpdateObjects, key: any, value: any, type: string): void;

}
