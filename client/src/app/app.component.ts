import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Draggable, Droppable} from "@shopify/draggable"
import {Card} from "./objects/card";
import {HttpClient} from "@angular/common/http";
import {CardsService} from "./services/cards.service";
import {UtilsService} from "./services/utils.service";
import {DaysService} from "./services/days.service";
import {TimeService} from "./services/time.service";
import {environment} from "../environments/environment";
import {Mechanic} from "./objects/mechanic";
import {Constants} from "./objects/constants";
import {CommonService} from "./services/common.service";
import {RealTimeService} from "./services/real-time.service";
import {AppointmentsService} from "./services/appointments.service";
import {CardPositionService} from "./services/card-position.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
	title = 'Panel';

	private _loading: boolean;

	constructor(
		private cdRef: ChangeDetectorRef,
		private daysService: DaysService,
		private timeService: TimeService,
		private cardsService: CardsService,
		private cardPositionService: CardPositionService,
		private appointmentsService: AppointmentsService,
		private realTimeService: RealTimeService,
		private commonService: CommonService,
		private http: HttpClient
	) {
		this.loading = true;
		this.generateRandomId();
		this.http.get(`${environment.serverUrl}/panel/get`)
			.subscribe((data: any) => {
				console.log('Received data', data);

				this.commonService.init(data.jobLineTypes, data.appointmentTypes);

				const daysMechanicsList = this.parseDaysMechanics(data.daysMechanics, data.skills);
				this.daysService.init(daysMechanicsList);
				this.timeService.init(this.daysService.daysMechanics);

				this.cardsService.init(data.cards.map(card => new Card(card)));
				this.cardPositionService.init(
					this.cardsService.unassignedCardsGroups,
					this.cardsService.assignedDaysCardsGroups
				);
				this.appointmentsService.init(
					data.appointmentTypes,
					data.appointmentDays,
					this.cardsService.assignedDaysCardsGroups,
					this.cardsService.unassignedCardsGroups
				);

				this.loading = false;
				this.cdRef.detectChanges();
			});
	}

	ngAfterViewInit(): void {
		this.cdRef.detach();
	}

	// region Getters / setters

	get loading(): boolean {
		return this._loading;
	}

	set loading(value: boolean) {
		this._loading = value;
	}

	// endregion

	generateRandomId(): void {
		/* Para conseguir actualizaciones en tiempo real, se necesita una forma de evitar que el sender reciba sus
		*  propias actualizaciones. Para ello, cada navegador genera un código aleatorio, que se adjuntará en la
		*  petición y se usará como ID del evento del PublishSubject */
		this.realTimeService.sessionId = Math.random().toString(36).slice(2);
	}

	parseDaysMechanics(daysMechanics: any, skills: any[]) {
		let daysMechanicsList = [];
		if (daysMechanics) {
			for (const dayString of Object.keys(daysMechanics)) {
				const day = UtilsService.parseDateFromString(dayString);
				const mechanics = daysMechanics[dayString];
				daysMechanicsList.push(
					{day: day, mechanics: mechanics.map(mechanic =>
							new Mechanic(
								day,
								mechanic,
								skills,
								this.commonService.highlightedSkills
							)
						)
					}
				);
			}
		}
		return daysMechanicsList;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking app component');
		}
	}

}
