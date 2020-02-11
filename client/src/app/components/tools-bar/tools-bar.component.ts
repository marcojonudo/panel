import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {UnassignedCardUpdateTrigger} from "../../objects/update-cards/unassigned-card-update-trigger";
import {NotificationService} from "../../services/notification.service";
import {DimensionsService} from "../../services/dimensions.service";
import {MechanicsService} from "../../services/mechanics.service";
import {AppointmentsService} from "../../services/appointments.service";
import {Subscription} from "rxjs/internal/Subscription";
import {DayAppointmentsCounter} from "../../objects/day-appointments-counter";

@Component({
	selector: 'app-tools-bar',
	templateUrl: './tools-bar.component.html',
	styleUrls: ['./tools-bar.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent implements OnInit {

	@Input() day: Date;
	@Input() dayAppointmentsCounter: DayAppointmentsCounter;
	@Input() maxScheduleWidth: number;
	@Input() maxScheduleMaxWidth: number;

	private appointmentsCounterSubscription: Subscription;
	private _daysAppointmentsCounter: any;
	private _showingFinished: boolean;

	constructor(
		private cardsService: CardsService,
		private mechanicsService: MechanicsService,
		private appointmentsService: AppointmentsService,
		private cdRef: ChangeDetectorRef
	) {
		this.showingFinished = false;
	}

	ngOnInit() {
		this.daysAppointmentsCounter = this.appointmentsService.daysAppointmentsCounter;
		this.appointmentsCounterSubscription = NotificationService.appointmentsCounter$.subscribe(() => {
			this.cdRef.detectChanges();
		});
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

	get daysAppointmentsCounter(): any {
		return this._daysAppointmentsCounter;
	}

	set daysAppointmentsCounter(value: any) {
		this._daysAppointmentsCounter = value;
	}

	get morningAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.MORNING;
	}

	get afternoonAppointmentSaturation(): number {
		return Constants.APPOINTMENT_SATURATION.AFTERNOON;
	}

	// endregion

	checkShowAppointmentsSummary(day: Date = this.day): boolean {
		return day != undefined;
	}

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

}
