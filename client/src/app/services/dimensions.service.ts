import {Injectable} from '@angular/core';
import {UtilsService} from "./utils.service";
import {CardsGroup} from "../objects/cards-group";
import {DaysMechanics} from "../objects/days-mechanics";
import {Mechanic} from "../objects/mechanic";
import {Constants} from "../objects/constants";
import {NotificationService} from "./notification.service";

@Injectable({
	providedIn: 'root'
})
export class DimensionsService {

	private static readonly MINUTES_PER_HOUR: number = 60;
	private static readonly MINUTES_PER_INTERVAL: number = 5;
	private static readonly FIT_HOURS_IN_SCREEN: number = 4;
	readonly QUARTERS: string[] = ['00', '15', '30', '45'];

	private static _today: Date;

	private static _maxTodayScheduleHours: number[];
	private static _maxDaysSchedulesHours: number[];
	private static _maxScheduleHours: number[];

	private static _gridWidth: number;
	private static _gridHeight: number;
	private static _hourWidth: number;
	private static _defaultHourWidth: number;
	private static _maxScheduleWidth: number;
	private static _maxScheduleMaxWidth: number;
	private static _intervalWidth: number;
	private static _lineHeight: number;
	private static _oneDayMode: boolean;

	constructor() {
	}

	// region Getters / setters

	static get today(): Date {
		return this._today;
	}

	static set today(value: Date) {
		this._today = value;
	}

	static get gridWidth(): number {
		return this._gridWidth;
	}

	static set gridWidth(value: number) {
		this._gridWidth = value;
	}

	static get gridHeight(): number {
		return this._gridHeight;
	}

	static set gridHeight(value: number) {
		this._gridHeight = value;
	}

	static get maxTodayScheduleHours(): number[] {
		return this._maxTodayScheduleHours;
	}

	static set maxTodayScheduleHours(value: number[]) {
		this._maxTodayScheduleHours = value;
	}

	static get maxDaysSchedulesHours(): number[] {
		return this._maxDaysSchedulesHours;
	}

	static set maxDaysSchedulesHours(value: number[]) {
		this._maxDaysSchedulesHours = value;
	}

	static get maxScheduleHours(): number[] {
		return this._maxScheduleHours;
	}

	static set maxScheduleHours(value: number[]) {
		this._maxScheduleHours = value;
	}

	static get maxScheduleWidth(): number {
		return this._maxScheduleWidth;
	}

	static set maxScheduleWidth(value: number) {
		this._maxScheduleWidth = value;
	}

	// static get maxScheduleWidth$(): Observable<number> {
	// 	return this._maxScheduleWidth$;
	// }
	//
	// static set maxScheduleWidth$(value: Observable<number>) {
	// 	this._maxScheduleWidth$ = value;
	// }

	static get hourWidth(): number {
		return this._hourWidth;
	}

	static set hourWidth(value: number) {
		this._hourWidth = value;
	}

	static get intervalWidth(): number {
		return this._intervalWidth;
	}

	static set intervalWidth(value: number) {
		this._intervalWidth = value;
	}

	// static get maxScheduleMaxWidth$(): Observable<number> {
	// 	return this._maxScheduleMaxWidth$;
	// }
	//
	// static set maxScheduleMaxWidth$(value: Observable<number>) {
	// 	this._maxScheduleMaxWidth$ = value;
	// }

	static get maxScheduleMaxWidth(): number {
		return this._maxScheduleMaxWidth;
	}

	static set maxScheduleMaxWidth(value: number) {
		this._maxScheduleMaxWidth = value;
	}

	static get defaultHourWidth(): number {
		return this._defaultHourWidth;
	}

	static set defaultHourWidth(value: number) {
		this._defaultHourWidth = value;
	}

	static get lineHeight(): number {
		return this._lineHeight;
	}

	static set lineHeight(value: number) {
		this._lineHeight = value;
	}

	static get oneDayMode(): boolean {
		return this._oneDayMode;
	}

	static set oneDayMode(value: boolean) {
		this._oneDayMode = value;
	}

	// endregion

	// region Init

	static init(daysMechanics: DaysMechanics) {
		const today = UtilsService.clearTime(new Date());
		this.lineHeight = Constants.VALUE.LINE_HEIGHT_DEFAULT;
		this.oneDayMode = true;

		// TODO Estudiar si quitarlo, al usar otra barra en caso de varios días
		/* Al cargar el panel, siempre aparece barra de scroll al tener el zoom al máximo */
		this.gridHeight = this.calcGridHeight();
		const displayScrollbar = this.checkDisplayScrollbar(
			this.gridHeight, today, daysMechanics, Constants.VALUE.LINE_HEIGHT_DEFAULT
		);
		this.gridWidth = this.calcGridWidth(displayScrollbar);

		this.calcWidthValuesFromHoursInGrid(this.FIT_HOURS_IN_SCREEN);
		this.defaultHourWidth = this.hourWidth;

		this.initSchedulesHours(daysMechanics, today);
		this.initMaxSchedule();

		console.log('Max. today schedules hours', this.maxTodayScheduleHours);
		console.log('Max. days schedules hours', this.maxDaysSchedulesHours);
		console.log('Max. schedule width:', this.maxScheduleWidth);
	}

	private static checkDisplayScrollbar(
		gridHeight: number,
		today: Date,
		daysMechanics: DaysMechanics,
		lineHeight: number,
		mechanicBottomMargin: number = Constants.VALUE.MECHANIC_BOTTOM_MARGIN,
		timelineHeight: number = Constants.VALUE.TIMELINE_HEIGHT
	): boolean {
		/* Si no hay mecánicos, se muestra el mensaje correspondiente, por lo que la barra no se necesita */
		if (!Object.keys(daysMechanics).length) {
			return false;
		}
		const mechanics = daysMechanics[today.getTime()];
		if (mechanics.length) {
			const mechanicsHeight =
				UtilsService.sum(mechanics, 'lines') * lineHeight +
				mechanics.length * (mechanicBottomMargin + 4) +
				timelineHeight
			;
			return gridHeight < mechanicsHeight;
		}
		return false;
	}

	/**
	 * Crea los arrays que contienen las horas entre los límtes de horarios; es decir, el comienzo del mecánico que
	 * empiece antes, y el fin del que termine más tarde
	 * @param {DaysMechanics} daysMechanics Días y sus mecánicos asociados
	 * @param {Date} today Hoy
	 */
	private static initSchedulesHours(daysMechanics: DaysMechanics, today: Date): void {
		let minDaysSchedule = new Date();
		let maxDaysSchedule = new Date();
		for (const day in daysMechanics) {
			const [minSchedule, maxSchedule] = this.getScheduleLimits(daysMechanics[day]);

			if (parseInt(day) == today.getTime()) {
				this.maxTodayScheduleHours = UtilsService.getScheduleHours(minSchedule, maxSchedule);
			}

			minDaysSchedule = UtilsService.timeGreaterThan(minDaysSchedule, minSchedule) ? minSchedule : minDaysSchedule;
			maxDaysSchedule = UtilsService.timeGreaterThan(maxSchedule, maxDaysSchedule) ? maxSchedule : maxDaysSchedule;
		}
		this.maxDaysSchedulesHours = UtilsService.getScheduleHours(minDaysSchedule, maxDaysSchedule);
	}

	/**
	 * Se obtienen los límites de los horarios de mecánicos de un sólo día
	 * @param {Mechanic[]} mechanics Mecánicos de un día
	 * @returns {Date[]} Par de fechas (comienzo y fin)
	 */
	private static getScheduleLimits(mechanics: Mechanic[]) {
		const minSchedule = new Date(Math.min(...mechanics.map(mechanic => mechanic.schedule.start.getTime())));
		const maxSchedule = new Date(Math.max(...mechanics.map(mechanic => mechanic.schedule.end.getTime())));
		return [minSchedule, maxSchedule];
	}

	/**
	 * Se definen los valores por defecto para las horas del horario y los anchos de horario, máximo y horas
	 */
	private static initMaxSchedule(): void {
		this.updateMaxSchedule(true);
		this.defaultHourWidth = this.hourWidth;
	}

	// endregion

	// region Grid dimensions

	private static calcGridHeight(
		scrollbar: boolean = true,
		unassignedBandContainerHeight: number = Constants.VALUE.UNASSIGNED_BAND_CONTAINER_HEIGHT,
		scrollbarSize: number = Constants.VALUE.SCROLLBAR_SIZE
	): number {
		return window.innerHeight - unassignedBandContainerHeight - (scrollbar ? scrollbarSize : 0);
	}

	private static calcGridWidth(
		scrollbar: boolean,
		rightPanelWidth: number = Constants.VALUE.DAY_PANEL_WIDTH,
		toolsBarWidth: number = Constants.VALUE.TOOLS_BAR_WIDTH,
		scrollbarSize: number = Constants.VALUE.SCROLLBAR_SIZE
	): number {
		return window.innerWidth - rightPanelWidth - toolsBarWidth - (scrollbar ? scrollbarSize : 0);
	}

	// endregion

	// region Hour widths

	/**
	 * Se calculan los anchos de horas e intervalos a partir del número de las primeras que caben en pantalla
	 * @param {number} hoursInGrid Número de horas que caben en pantalla
	 */
	private static calcWidthValuesFromHoursInGrid(hoursInGrid: number): void {
		/* Se calculan los anchos a partir del número de hora que encajna en pantalla; sabiendo que a zoom máximo,
		*  en todoo el ancho de la pantalla caben 4 horas, se hacen las cuentas correspondientes */
		this.hourWidth = this.calcHourWidthFromHoursInGrid(this.FIT_HOURS_IN_SCREEN);
		/* Se calcula el ancho de un bloque de 5 minutos (unidad mínima de ancho en panel) */
		this.intervalWidth = this.calcIntervalWidth(this.hourWidth);
	}

	/**
	 * Se calculan los anchos de horas e intervalos a partir del ancho total del horario
	 * @param {number} maxScheduleWidth Ancho total del horario
	 */
	private static calcWidthValuesFromMaxScheduleWidth(maxScheduleWidth: number): void {
		this.hourWidth = this.calcHourWidthFromMaxScheduleWidth(maxScheduleWidth);
		this.intervalWidth = this.calcIntervalWidth(this.hourWidth);
	}

	/**
	 * Se calcula el ancho de una hora a partir del número de ellas que encajan en pantalla
	 * @param {number} hoursInGrid Número de horas que aparecen en pantalla (por defecto 4)
	 * @param {number} gridWidth Ancho de la cuadrícula
	 * @param {number} leftOffset Desplazamiento producido por el ancho de la info del mecánico
	 * @returns {number} Ancho de una hora
	 */
	private static calcHourWidthFromHoursInGrid(
		hoursInGrid: number,
		gridWidth: number = this.gridWidth,
		leftOffset: number = Constants.VALUE.MECHANIC_INFO_WIDTH
	): number {
		return (gridWidth - leftOffset) / hoursInGrid;
	}

	/**
	 * Se calcula el ancho de una hora a partir del ancho total del horario
	 * @param {number} maxScheduleWidth Ancho total del horario
	 * @param {number[]} maxScheduleHours Número de horas a representar en el horario
	 * @param {number} leftOffset Desplazamiento producido por el ancho de la info del mecánico
	 * @returns {number} Ancho de una hora
	 */
	private static calcHourWidthFromMaxScheduleWidth(
		maxScheduleWidth: number,
		maxScheduleHours: number[] = this.maxScheduleHours,
		leftOffset: number = Constants.VALUE.MECHANIC_INFO_WIDTH
	): number {
		return (maxScheduleWidth - leftOffset) / maxScheduleHours.length;
	}

	/**
	 * Se calcula el ancho de un intervalo (5 min) a partir del ancho de una hora
	 * @param {number} hourWidth Ancho de una hora
	 * @param {number} quartersPerHour Cuartos (15 min) en una hora (evidentemente es constante)
	 * @param {number} intervalsPerQuarter Intervalos (5 min) en un cuarto (15 min)
	 * @returns {number} Ancho de un intervalo
	 */
	private static calcIntervalWidth(
		hourWidth: number,
		quartersPerHour: number = Constants.VALUE.QUARTERS_PER_HOUR,
		intervalsPerQuarter: number = Constants.VALUE.INTERVALS_PER_QUARTER,
	) {
		return hourWidth / (quartersPerHour * intervalsPerQuarter);
	}

	// endregion

	// region Update schedule values

	/**
	 * Actualiza el número de horas y ancho del horario, en función de si la vista es de uno o varios días
	 * @param {boolean} oneDayMode Vista de uno o varios días
	 * @returns {number[]} Array de horas del horario
	 */
	static updateMaxSchedule(oneDayMode: boolean): void {
		/* Se actualiza el número de horas. Un horario de otro día puede tener más horas y, por tanto, necesitasr un
		*  mayor ancho del contenedor para albergarlo */
		this.maxScheduleHours = oneDayMode ? this.maxTodayScheduleHours : this.maxDaysSchedulesHours;
		/* Sabiendo el número de horas, se calcula el mayor ancho posible que puede adquirir: cuando el ancho de la
		*  hora es el mayor posible; es decir, el default */
		this.maxScheduleMaxWidth = this.calcScheduleWidth(this.maxScheduleHours, this.defaultHourWidth);
		/* Si se está activando el modo de un sólo día, el ancho de los horarios coincide con el máximo. Si no, es el
		*  ancho del grid, ya que al activar la vista de varios días, automáticamente se ajusta a la pantalla */
		this.maxScheduleWidth = oneDayMode ? this.maxScheduleMaxWidth : this.gridWidth;
		this.calcWidthValuesFromMaxScheduleWidth(this.maxScheduleWidth);
		// this.maxScheduleMaxWidthSubject.next(this.maxScheduleMaxWidth);
		// return this.maxScheduleHours;
	}

	/**
	 * Calcula el nacho del horario a partir del número de horas y del ancho de cada una
	 * @param {number[]} hours Array con las horas del horario
	 * @param {number} hourWidth Ancho de la hora
	 * @param {number} leftOffset Desplazamiento producido por el ancho de la info del mecánico
	 * @returns {number} Ancho del horario
	 */
	private static calcScheduleWidth(
		hours: number[],
		hourWidth: number,
		leftOffset: number = Constants.VALUE.MECHANIC_INFO_WIDTH
	): number {
		return leftOffset + hours.length * hourWidth;
	}

	/**
	 * Calcula los valores dimensionales a partir del nuevo valor de maxScheduleWidth, enviado por el slider del zoom
	 * @param {number} maxScheduleWidth Nuevo valor del máximo ancho
	 */
	static updateMaxScheduleWidth(maxScheduleWidth: number) {
		this.maxScheduleWidth = maxScheduleWidth;
		this.hourWidth = this.calcHourWidthFromMaxScheduleWidth(this.maxScheduleWidth);
		this.intervalWidth = this.calcIntervalWidth(this.hourWidth);
	}

	// endregion

	// region Convert properties to dimensions

	static calcWidthFromDuration(duration: number, intervalWidth: number = this.intervalWidth): number {
		/* Se obtiene el número de intervalos que ocupan los minutos de duración */
		const durationIntervals = this.getIntervalsNumberFromDuration(duration);
		/* Se retorna el ancho en px */
		return durationIntervals * intervalWidth;
	}

	static calcLeftFromStart(start: Date) {
		/* Se obtienen los minutos desde el inicio del horario, hasta start */
		const relativeMinutes = this.getRelativeMinutesFromStart(start);
		/* Se obtiene el número de intervalos correspondiente a los minutos */
		const relativeIntervals = this.getIntervalsNumberFromDuration(relativeMinutes);
		/* Se retorna el ancho en px */
		return relativeIntervals * this.intervalWidth;
	}

	static calcLeftFromCardsGroups(groupIndex: number, groups: CardsGroup[]) {
		const previousWidth = this.findCardsGroupsWidth(groups.slice(0, groupIndex));
		return (groups[0].left ? groups[0].left : 0) + previousWidth;
	}

	private static findCardsGroupsWidth(cardsGroups: CardsGroup[]): number {
		let cards = [];
		cardsGroups.forEach(cardsGroup => cards.push(...cardsGroup.cards));
		return cards.map(card => card.width).reduce((a, b) => a + b, 0);
	}

	// endregion

	// region Convert to properties

	static calcStartFromLeft(left: number, day: Date): Date {
		const intervals = this.getIntervalsNumberFromWidth(left);
		const minutes = this.getRelativeMinutesFromIntervals(intervals);
		return UtilsService.parseTimeFromMinutes(minutes, day);
	}

	static calcDurationFromWidth(width: number): number {
		return this.getIntervalsNumberFromWidth(width) * this.MINUTES_PER_INTERVAL;
	}

	static calcDurationFromCardsGroup(cardsGroup: CardsGroup): number {
		return UtilsService.sum(cardsGroup.cards, 'duration');
	}

	// endregion

	// region Auxiliary methods

	private static getRelativeMinutesFromStart(time: Date) {
		const minutes = time.getHours() * 60 + time.getMinutes();
		return minutes - this.getStartScheduleMinutes();
	}

	private static getRelativeMinutesFromIntervals(intervalsNumber: number): number {
		return this.getStartScheduleMinutes() + this.MINUTES_PER_INTERVAL * intervalsNumber;
	}

	private static getStartScheduleMinutes() {
		return this.maxScheduleHours[0] * this.MINUTES_PER_HOUR;
	}

	private static getIntervalsNumberFromDuration(duration: number): number {
		return duration / this.MINUTES_PER_INTERVAL;
	}

	private static getIntervalsNumberFromWidth(width: number) {
		return Math.round(width / this.intervalWidth);
	}

	// endregion

	static toggleDayMode(): void {
		this.oneDayMode = !this.oneDayMode;
		NotificationService.notifyOneDayMode(this.oneDayMode);
	}

}
