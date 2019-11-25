import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppointmentsService} from "../../services/appointments.service";
import {Subscription} from "rxjs/internal/Subscription";
import {Constants} from "../../objects/constants";
import {CardUpdate} from "../../objects/update-cards/card-update";
import {CardsService} from "../../services/cards.service";

@Component({
	selector: 'app-appointments-panel',
	templateUrl: './appointments-panel.component.html',
	styleUrls: ['./appointments-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsPanelComponent implements OnInit {

	private readonly TOTAL: string = 'TOTAL';

	private cardsSubscription: Subscription;
	private appointmentsCounterSubscription: Subscription;
	private _appointmentsCounter: any;

	constructor(
		private appointmentsService: AppointmentsService,
		private cardsService: CardsService
	) {
		this.appointmentsCounter = this.appointmentsService.initAppointmentsCounter();
	}

	ngOnInit() {
		this.appointmentsCounterSubscription = this.appointmentsService.appointmentsCounter$.subscribe(update => {
			console.log(update);
			update.update(this.appointmentsCounter);
		});
	}

	// region Getters / setters

	get appointmentsCounter(): any {
		return this._appointmentsCounter;
	}

	set appointmentsCounter(value: any) {
		this._appointmentsCounter = value;
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

	// endregion



}
