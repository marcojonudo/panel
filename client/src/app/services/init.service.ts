import {Injectable} from '@angular/core';
import {NotificationService} from "./notification.service";
import {CardPositionService} from "./card-position.service";
import {DropzoneService} from "./dropzone.service";
import {Url} from "../objects/url";
import * as dayjs from "dayjs";
import {Constants} from "../objects/constants";
import {AppointmentsService} from "./appointments.service";
import {MechanicsService} from "./mechanics.service";
import {SkillsService} from "./skills.service";
import {CardsService} from "./cards.service";
import {Card} from "../objects/card";
import {DimensionsService} from "./dimensions.service";
import {JobLineTypeService} from "./job-line-type.service";
import {RealTimeService} from "./real-time.service";
import {HttpClient} from "@angular/common/http";
import {Dayjs} from "dayjs";

@Injectable({
	providedIn: 'root'
})
export class InitService {

	static loading: boolean;
	static i: number;

	constructor(
		private cardsService: CardsService,
		private appointmentsService: AppointmentsService,
		private realTimeService: RealTimeService,
		private http: HttpClient
	) {
		InitService.loading = false;
		InitService.i = 0;
	}

	loadInitialData(): void {
		this.generateRandomId();
		console.log('Session ID', RealTimeService.sessionId);

		NotificationService.init();
		CardPositionService.init();
		DropzoneService.init(this.cardsService, this.appointmentsService);
		this.requestInitialData();
	}

	requestInitialData(day: Dayjs = dayjs(), scrollTopDaysOffset: number = 0): void {
		InitService.loading = true;
		NotificationService.notifyLoading(InitService.loading);
		InitService.i += 1;
		this.http.get(
			Url.initialData(),
			{params: {
				from: day.format(Constants.DATE_FORMAT.yyyy_MM_dd),
				to: day.add(Constants.VALUE.DAYS_LOAD - 1, Constants.DAY_JS.d).format(Constants.DATE_FORMAT.yyyy_MM_dd)
			}}
		).subscribe((data: any) => {
			console.log('Received data', data);

			AppointmentsService.initAppointmentTypes(data.appointmentTypes);
			/* Los mecánicos se cargan, independientemente de que data.daysMechanics sea null, porque podrían cargarse
			*  las líneas fijas desde localStorage */
			MechanicsService.init(
				data.daysMechanics,
				data.employees,
				data.firstScheduleDay,
				data.lastScheduleDay,
				data.skills,
				SkillsService.highlightedSkills
			);
			/* Sólo se carga la info de panel si hay horarios */
			if (MechanicsService.days.length) {
				CardsService.init(data.cards.map(card => new Card(card)), MechanicsService.daysMechanics);

				AppointmentsService.init(data.appointmentDays);

				JobLineTypeService.init(data.jobLineTypes);

				DimensionsService.init(
					MechanicsService.days[0], MechanicsService.daysMechanics, MechanicsService.todaySchedules, scrollTopDaysOffset
				);
			}

			InitService.loading = false;
			NotificationService.notifyLoading(InitService.loading);
		});
	}

	static checkRequestPreviousDaysInitialData(): boolean {
		/* Se solicitan nuevos días sólo si el primer día es distinto al primero existente en los horarios. No se
		*  compara con today porque podría ser festivo, y no haber horarios para hoy */
		return !DimensionsService.oneDayMode && !MechanicsService.days[0].isSame(MechanicsService.firstScheduleDay);
	}

	requestPreviousDaysInitialData(): void {
		const day = MechanicsService.days[0].subtract(Constants.VALUE.DAYS_LOAD - 3, Constants.DAY_JS.d)
		this.requestInitialData(day, Constants.VALUE.DAYS_LOAD - Constants.VALUE.DAYS_LOAD_OFFSET - 1);
	}

	static checkRequestNextDaysInitialData(): boolean {
		/* Se solicitan nuevos días sólo sí el número de días cargado es igual al total de días máximos. Si no (por
		*  ejemplo, si el total son 7 pero sólo hay cargados 3), significa que ya se alcanzo el límite de horarios */
		return !DimensionsService.oneDayMode &&
			MechanicsService.days[MechanicsService.days.length - 1].isBefore(MechanicsService.lastScheduleDay)
	}

	requestNextDaysInitialData(): void {
		const day = MechanicsService.days[MechanicsService.days.length - 1 - Constants.VALUE.DAYS_LOAD_OFFSET];
		this.requestInitialData(day, Constants.VALUE.DAYS_LOAD_OFFSET);
	}

	generateRandomId(): void {
		/* Para conseguir actualizaciones en tiempo real, se necesita una forma de evitar que el sender reciba sus
		*  propias actualizaciones. Para ello, cada navegador genera un código aleatorio, que se adjuntará en la
		*  petición y se usará como ID del evento del PublishSubject */
		RealTimeService.sessionId = Math.random().toString(36).slice(2);
	}

}
