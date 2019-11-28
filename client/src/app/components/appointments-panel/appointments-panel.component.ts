import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppointmentsService} from "../../services/appointments.service";
import {Subscription} from "rxjs/internal/Subscription";
import {Constants} from "../../objects/constants";
import {CardUpdate} from "../../objects/update-cards/card-update";
import {CardsService} from "../../services/cards.service";
import {DayCardUpdate} from "../../objects/update-days-cards/day-card-update";
import {UtilsService} from "../../services/utils.service";

@Component({
	selector: 'app-appointments-panel',
	templateUrl: './appointments-panel.component.html',
	styleUrls: ['./appointments-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsPanelComponent implements OnInit {

	@Input() day: Date;

	private readonly TOTAL: string = 'TOTAL';
	private readonly MAX: string = 'MAX';

	private assignedCardsGroupsSubscription: Subscription;
	private appointmentsCounterSubscription: Subscription;
	private _daysAppointmentsCounter: any;

	constructor(
		private appointmentsService: AppointmentsService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.daysAppointmentsCounter = this.appointmentsService.daysAppointmentsCounter;
		this.appointmentsCounterSubscription = this.appointmentsService.appointmentsCounter$.subscribe(update => {
			console.log('update', update);
			update.update(this.daysAppointmentsCounter);
			this.cdRef.detectChanges();
		});
		// this.assignedCardsGroupsSubscription = this.cardsService.assignedCardsGroups$
		// 		.subscribe((dayCardUpdate: DayCardUpdate) => {
		// 	console.log(1);
		// 	console.log(this.cardsService.assignedDaysCardsGroups);
		// })
	}

	// region Getters / setters

	get daysAppointmentsCounter(): any {
		return this._daysAppointmentsCounter;
	}

	set daysAppointmentsCounter(value: any) {
		this._daysAppointmentsCounter = value;
	}

	get morning(): string {
		return Constants.SCHEDULE_TYPE.MORNING;
	}

	get afternoon(): string {
		return Constants.SCHEDULE_TYPE.AFTERNOON;
	}

	get total(): string {
		return this.TOTAL;
	}

	get max(): string {
		return this.MAX;
	}

	// endregion

	findDayAppointmentsCounter(day: Date): any {
		return this.daysAppointmentsCounter[day.getTime()];
	}

	addMax(dayAppointmentsCounter: any): void {
		dayAppointmentsCounter[this.max] = dayAppointmentsCounter[this.max] + 1;
		this.cdRef.detectChanges();
	}

	subtractMax(dayAppointmentsCounter: any): void {
		dayAppointmentsCounter[this.max] = dayAppointmentsCounter[this.max] - 1 < 0
			? dayAppointmentsCounter[this.max]
			: dayAppointmentsCounter[this.max] - 1;
		this.cdRef.detectChanges();
	}

}
