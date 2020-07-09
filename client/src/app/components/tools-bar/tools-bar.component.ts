import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {NotificationService} from "../../services/notification.service";
import {DimensionsService} from "../../services/dimensions.service";
import {MechanicsService} from "../../services/mechanics.service";
import {AppointmentsService} from "../../services/appointments.service";
import {Dayjs} from "dayjs";
import {AppointmentDayUpdate} from "../../objects/trigger-cd/update-objects/appointments-counter/appointment-day-update";

@Component({
	selector: 'app-tools-bar',
	templateUrl: './tools-bar.component.html',
	styleUrls: ['./tools-bar.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent {

	@Input() day: Dayjs;
	@Input() appointmentDayUpdate: AppointmentDayUpdate;
	@Input() maxScheduleWidth: number;
	@Input() maxScheduleMaxWidth: number;

	private _showingFinished: boolean;
	private _syncing: boolean;

	constructor(
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.showingFinished = false;
		this.syncing = false;
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

	get syncing(): boolean {
		return this._syncing;
	}

	set syncing(value: boolean) {
		this._syncing = value;
	}

	get oneDayMode(): boolean {
		return DimensionsService.oneDayMode;
	}

	get onlyAppointmentsMode(): boolean {
		return MechanicsService.onlyAppointmentsMode;
	}

	get showAppointmentsName(): boolean {
		return MechanicsService.showAppointmentsName;
	}

	get dragScheduleMode(): boolean {
		return AppointmentsService.dragSchedulesMode;
	}

	// endregion

	// region Checks

	checkShowAppointmentsSummary(day: Dayjs = this.day): boolean {
		return day != undefined;
	}

	checkToggleDayMode(): boolean {
		return MechanicsService.futureSchedules;
	}

	checkEnableSchedulesButtons(): boolean {
		return DimensionsService.oneDayMode ? MechanicsService.todaySchedules : MechanicsService.futureSchedules
	}

	// endregion

	// region Button actions

	syncJpdv(): void {
		if (!this.syncing) {
			this.syncing = true;
			this.cdRef.detectChanges();
			this.cardsService.syncJpdv().subscribe(() => {
				this.syncing = false;
				this.cdRef.detectChanges();
			});
		}
	}

	toggleDayMode(): void {
		DimensionsService.toggleDayMode()
	}

	toggleShowMechanicsWithoutAppointments(): void {
		MechanicsService.toggleOnlyAppointmentsMode();
	}

	toggleShowAppointmentsName(): void {
		MechanicsService.toggleShowAppointmentsName();
	}

	toggleDragSchedulesMode(): void {
		AppointmentsService.toggleDragSchedulesMode();
		DimensionsService.updateMaxScheduleWidth(DimensionsService.gridWidth);
		NotificationService.notifyMaxScheduleWidth(DimensionsService.gridWidth);
	}

	showFinishedCardsBar(): void {
		const section = this.showingFinished ? CardsService.unassignedSections[0].name : Constants.CARD_STATUS.FINISHED;
		NotificationService.notifyBand(section);
		this.showingFinished = !this.showingFinished;
	}

	// endregion

	check(): void {
		if (Constants.CHECK) {
			console.log('checking tools bar component', this.appointmentDayUpdate);
		}
	}

}
