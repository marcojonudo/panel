import {MechanicUpdate} from "./mechanic-update";
import {Mechanic} from "../mechanic";

export class MechanicUpdateTrigger implements MechanicUpdate {

	updatedMechanic: Mechanic;

	constructor(mechanic: Mechanic = undefined) {
		/* El mechanic en este caso no es necesario. Al actualizar la height en el daysService, sólo se necesita
		*  ejecutar el CD en el grid.component para que se identifiquen los cambios, y eso ya se hace automáticamente
		*  en el observer */
		this.updatedMechanic = mechanic;
	}

	update(mechanics: Mechanic[]): void {}

}
