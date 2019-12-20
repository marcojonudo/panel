import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Draggable, Droppable} from "@shopify/draggable"
import {Card} from "./objects/card";
import {HttpClient} from "@angular/common/http";
import {CardsService} from "./services/cards.service";
import {Constants} from "./objects/constants";
import {CommonService} from "./services/common.service";
import {RealTimeService} from "./services/real-time.service";
import {AppointmentsService} from "./services/appointments.service";
import {CardPositionService} from "./services/card-position.service";
import {NotificationService} from "./services/notification.service";
import {MechanicsService} from "./services/mechanics.service";
import {SkillsService} from "./services/skills.service";
import {DimensionsService} from "./services/dimensions.service";
import {Url} from "./objects/url";

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
		private cardsService: CardsService,
		private appointmentsService: AppointmentsService,
		private realTimeService: RealTimeService,
		private commonService: CommonService,
		private mechanicsService: MechanicsService,
		private http: HttpClient
	) {
		this.loading = true;
		this.generateRandomId();
		NotificationService.init();
		CardPositionService.init();
		this.http.get(Url.getInitialData())
			.subscribe((data: any) => {
				console.log('Received data', data);

				this.mechanicsService.init(data.daysMechanics, data.skills, SkillsService.highlightedSkills);

				this.cardsService.init(data.cards.map(card => new Card(card)), this.mechanicsService.daysMechanics);

				DimensionsService.init(this.mechanicsService.daysMechanics);

				CardPositionService.updateDimensions(
					this.cardsService.unassignedSections,
					this.cardsService.assignedDaysCardsGroups
				);

				this.commonService.init(data.jobLineTypes, data.appointmentTypes);

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

	check() {
		if (Constants.CHECK) {
			console.log('checking app component');
		}
	}

}
