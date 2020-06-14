import {
	ChangeDetectionStrategy,
	Component,
	Input
} from '@angular/core';
import {Mechanic} from "../../objects/mechanic";
import {Constants} from "../../objects/constants";
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {Dayjs} from "dayjs";
import {MechanicSkills} from "../../objects/mechanic-skills";
import {CardsGroup} from "../../objects/cards-group";
import {GroupUpdate} from "../../objects/trigger-cd/update-objects/groups/group-update";
import {TriggerMapUpdate} from "../../objects/trigger-cd/update-objects/trigger-map-update/trigger-map-update";

@Component({
	selector: 'app-mechanic-line-container',
	templateUrl: './mechanic-line-container.component.html',
	styleUrls: ['./mechanic-line-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent {

	@Input() day: Dayjs;
	@Input() mechanicLineUpdate: TriggerMapUpdate;
	@Input() mechanicSkills: MechanicSkills;
	@Input() mechanic: Mechanic;
	@Input() groups: CardsGroup[];
	@Input() height: number;
	@Input() appointments: AppointmentSchedule[];
	@Input() position: string;
	@Input() showAppointmentsName: boolean;
	@Input() groupUpdate: GroupUpdate;

	// region Getters / setters

	get mechanicInfoWidth() {
		return Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	// endregion

	calcScheduleHeight(): number {
		return this.mechanic.height + Constants.VALUE.JOB_LINE_TYPE_HEIGHT;
	}

	checkHighlightMechanic(mechanicSkills: MechanicSkills = this.mechanicSkills): boolean {
		return mechanicSkills.skills != undefined;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic line container', this.groupUpdate)
		}
	}
}
