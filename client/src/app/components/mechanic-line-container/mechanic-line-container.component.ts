import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Mechanic} from "../../objects/mechanic";
import {Constants} from "../../objects/constants";
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {CardsGroup} from "../../objects/cards-group";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";

@Component({
	selector: 'app-mechanic-line-container',
	templateUrl: './mechanic-line-container.component.html',
	styleUrls: ['./mechanic-line-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent {

	@Input() day: Date;
	@Input() mechanicLineUpdate: MechanicUpdate;
	@Input() dayMechanicSkills: DayMechanicSkills;
	@Input() maxScheduleWidth: number;
	@Input() mechanic: Mechanic;
	@Input() height: number;
	@Input() appointments: AppointmentSchedule[];
	@Input() position: string;

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
