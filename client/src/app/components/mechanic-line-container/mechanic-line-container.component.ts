import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component, EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from '@angular/core';
import {Mechanic} from "../../objects/mechanic";
import {Constants} from "../../objects/constants";
import {AppointmentSchedule} from "../../objects/appointment-schedule";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {DayMechanicSkills} from "../../objects/skills-update/day-mechanic-skills";
import {Dayjs} from "dayjs";

@Component({
	selector: 'app-mechanic-line-container',
	templateUrl: './mechanic-line-container.component.html',
	styleUrls: ['./mechanic-line-container.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent {

	@Input() day: Dayjs;
	@Input() mechanicLineUpdate: MechanicUpdate;
	@Input() dayMechanicSkills: DayMechanicSkills;
	@Input() mechanic: Mechanic;
	@Input() height: number;
	@Input() appointments: AppointmentSchedule[];
	@Input() position: string;
	@Input() showAppointmentsName: boolean;
	@Output() resizedLine: EventEmitter<boolean>;

	constructor(private cdRef: ChangeDetectorRef) {
		this.resizedLine = new EventEmitter<boolean>();
	}

	// region Getters / setters

	get mechanicInfoWidth() {
		return Constants.VALUE.MECHANIC_INFO_WIDTH;
	}

	// endregion

	calcScheduleHeight(): number {
		return this.mechanic.height + Constants.VALUE.JOB_LINE_TYPE_HEIGHT;
	}

	emitResizedLine(resized: boolean): void {
		this.resizedLine.emit(resized);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic line container', this.mechanicLineUpdate)
		}
	}
}
