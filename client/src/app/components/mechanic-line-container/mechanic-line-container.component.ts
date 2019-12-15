import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Mechanic} from "../../objects/mechanic";
import {Constants} from "../../objects/constants";
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {CardsGroup} from "../../objects/cards-group";
import {MechanicLineUpdate} from "../../objects/update-days-cards/mechanic-line-update";

@Component({
	selector: 'app-mechanic-line-container',
	templateUrl: './mechanic-line-container.component.html',
	styleUrls: ['./mechanic-line-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent {

	@Input() day: Date;
	@Input() mechanicLineUpdate: MechanicLineUpdate;
	@Input() mechanic: Mechanic;
	@Input() height: number;
	@Input() appointments: AppointmentSchedule[];
	@Input() position: string;
	@Input() maxScheduleHours: number[];
	@Input() maxScheduleWidth: number;

	// region Getters / setters

	get mechanicInfoWidth() {
		return Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	// endregion

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic line container', this.mechanicLineUpdate)
		}
	}
}
