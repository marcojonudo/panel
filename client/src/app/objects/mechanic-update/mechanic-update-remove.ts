import {MechanicUpdate} from "./mechanic-update";
import {Mechanic} from "../mechanic";

export class MechanicUpdateRemove implements MechanicUpdate {

	updatedMechanic: Mechanic;

	constructor(mechanic: Mechanic) {
		this.updatedMechanic = mechanic;
	}

	update(mechanics: Mechanic[]): void {
		const removedMechanicIndex = mechanics.findIndex(mechanic =>
			mechanic.panelPosition == this.updatedMechanic.panelPosition
		);
		let prevPosition = mechanics[removedMechanicIndex].panelPosition;
		mechanics.splice(removedMechanicIndex, 1);

		for (let i = removedMechanicIndex; i < mechanics.length; i++) {
			const newPosition = mechanics[i].panelPosition;
			mechanics[i].panelPosition = prevPosition;
			prevPosition = newPosition;
		}
	}

}
