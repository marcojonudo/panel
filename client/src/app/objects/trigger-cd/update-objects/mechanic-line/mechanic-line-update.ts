import {Constants} from "../../../constants";
import {MechanicTriggerMapUpdate} from "../trigger-map-update/mechanic-trigger-map-update";
import {MechanicsTriggerMap} from "../../trigger-maps/mechanics-trigger-map";
import {TriggerMapUpdate} from "../trigger-map-update/trigger-map-update";

export class MechanicLineUpdate implements MechanicTriggerMapUpdate {

	type: string;
	mechanicCode: string;
	value: TriggerMapUpdate;

	constructor(mechanicCode: string = undefined, value: TriggerMapUpdate = undefined) {
		this.type = Constants.UPDATE_OBJECT.MECHANIC_LINE;
		this.mechanicCode = mechanicCode;
		this.value = value;
	}

	updateTriggerMap(
		mechanicsTriggerMap: MechanicsTriggerMap,
		mechanicCode: string,
		type: string = this.type,
		triggerMapUpdate: TriggerMapUpdate = this.value,
	): void {
		/* Cuando se notifica una línea sin dropzone, el valor es nulo. Por lo tanto, en ese caso, se asigna el propio
		*  objeto para poder continuar el ciclo de CD */
		triggerMapUpdate = triggerMapUpdate ? triggerMapUpdate : this;
		/* Si no hay código de mecánico, significa que la actualización se tiene que llevar a cabo en todos ellos */
		if (!this.mechanicCode) {
			for (const mechanicCode of Object.keys(mechanicsTriggerMap)) {
				mechanicsTriggerMap[mechanicCode][type] = triggerMapUpdate;
			}
		} else if (this.mechanicCode == mechanicCode) {
			/* Si hay código, se comprueba que concuerde para sobreescribir el objeto que generará el CD */
			mechanicsTriggerMap[mechanicCode][type] = triggerMapUpdate;
		}
	}

}
