import {Mechanic} from "../mechanic";

export interface MechanicUpdate {

	updatedMechanic: Mechanic;

	update(mechanics: Mechanic[]): void;

}
