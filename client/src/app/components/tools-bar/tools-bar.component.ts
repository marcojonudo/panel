import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {UnassignedCardUpdateTrigger} from "../../objects/update-cards/unassigned-card-update-trigger";
import {NotificationService} from "../../services/notification.service";
import {DimensionsService} from "../../services/dimensions.service";
import {MechanicsService} from "../../services/mechanics.service";
import {DayAppointmentsCounterUpdate} from "../../objects/appointments-counter-update/day-appointments-counter-update";

@Component({
	selector: 'app-tools-bar',
	templateUrl: './tools-bar.component.html',
	styleUrls: ['./tools-bar.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent {

	@Input() day: Date;
	@Input() dayAppointmentsCounterUpdate: DayAppointmentsCounterUpdate;
	@Input() maxScheduleWidth: number;
	@Input() maxScheduleMaxWidth: number;

	private _showingFinished: boolean;

	constructor(
		private cardsService: CardsService,
		private mechanicsService: MechanicsService
	) {
		this.showingFinished = false;
	}

	// region Getters / setters

	get toolsBarWidth(): number {
		return Constants.VALUE.TOOLS_BAR_WIDTH;
	}

	get finishDropzoneType(): string {
		return Constants.DROPZONE_TYPE.FINISH;
	}

	get showingFinished(): boolean {
		return this._showingFinished;
	}

	set showingFinished(value: boolean) {
		this._showingFinished = value;
	}

	get morningAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.MORNING;
	}

	get afternoonAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.AFTERNOON;
	}

	// endregion

	// region Checks

	checkShowAppointmentsSummary(day: Date = this.day): boolean {
		return day != undefined;
	}

	// endregion

	// region Button actions

	toggleDayMode(): void {
		DimensionsService.toggleDayMode();
	}

	toggleShowMechanicsWithoutAppointments(): void {
		this.mechanicsService.toggleOnlyAppointmentsMode();
	}

	toggleShowAppointmentsName(): void {
		this.mechanicsService.toggleShowAppointmentsName();
	}

	showFinishedCardsBar(): void {
		const unassignedCardUpdate = new UnassignedCardUpdateTrigger(
			undefined,
			this.showingFinished ? this.cardsService.unassignedSections[0].name : Constants.CARD_STATUS.FINISHED
		);
		NotificationService.notifyBand(unassignedCardUpdate);
		this.showingFinished = !this.showingFinished;
	}

	// endregion

	check(): void {
		if (Constants.CHECK) {
			console.log('checking tools bar component', this.dayAppointmentsCounterUpdate);
		}
	}

}
