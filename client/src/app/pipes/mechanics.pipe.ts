import {Pipe, PipeTransform} from '@angular/core';
import {Mechanic} from "../objects/mechanic";

@Pipe({
	name: 'mechanics'
})
export class MechanicsPipe implements PipeTransform {

	transform(mechanics: Mechanic[], onlyAppointmentsMode: boolean): Mechanic[] {
		return onlyAppointmentsMode ?
			mechanics.filter((mechanic: Mechanic) => mechanic.appointments.length > 0) :
			mechanics;
	}

}
