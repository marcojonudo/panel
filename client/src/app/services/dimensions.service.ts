import {Injectable} from '@angular/core';
import {UtilsService} from "./utils.service";
import {CardsGroup} from "../objects/cards-group";
import {DaysMechanics} from "../objects/days-mechanics";
import {Mechanic} from "../objects/mechanic";
import {Constants} from "../objects/constants";
import {NotificationService} from "./notification.service";
import {Position} from "../objects/position";
import * as dayjs from "dayjs";
import {Dayjs} from "dayjs";
import {HourQuarter} from "../objects/hour-quarter";
import {MechanicsService} from "./mechanics.service";
import {Card} from "../objects/card";

@Injectable({
	providedIn: 'root'
})
export class DimensionsService {

	private static readonly MINUTES_PER_HOUR: number = 60;
	private static readonly FIT_HOURS_IN_SCREEN: number = 4;

	private static _maxTodayScheduleHoursQuarter: HourQuarter[];
	private static _maxDaysSchedulesHoursQuarter: HourQuarter[];
	private static _maxScheduleHoursQuarter: HourQuarter[];

	private static _gridWidth: number;
	private static _gridContainerHeight: number;
	private static _displayVerticalScrollbar: boolean;
	private static _hourWidth: number;
	private static _defaultHourWidth: number;
	private static _maxScheduleWidth: number;
	private static _maxScheduleMaxWidth: number;
	private static _intervalWidth: number;
	private static _quarterWidth: number;
	private static _lineHeight: number;
	private static _oneDayMode: boolean;

	// region Getters / setters

	static get gridWidth(): number {
		return this._gridWidth;
	}

	static set gridWidth(value: number) {
		this._gridWidth = value;
	}

	static get gridContainerHeight(): number {
		return this._gridContainerHeight;
	}

	static set gridContainerHeight(value: number) {
		this._gridContainerHeight = value;
	}

	static get maxTodayScheduleHoursQuarter(): HourQuarter[] {
		return this._maxTodayScheduleHoursQuarter;
	}

	static set maxTodayScheduleHoursQuarter(value: HourQuarter[]) {
		this._maxTodayScheduleHoursQuarter = value;
	}

	static get maxDaysSchedulesHoursQuarter(): HourQuarter[] {
		return this._maxDaysSchedulesHoursQuarter;
	}

	static set maxDaysSchedulesHoursQuarter(value: HourQuarter[]) {
		this._maxDaysSchedulesHoursQuarter = value;
	}

	static get maxScheduleHoursQuarter(): HourQuarter[] {
		return this._maxScheduleHoursQuarter;
	}

	static set maxScheduleHoursQuarter(value: HourQuarter[]) {
		this._maxScheduleHoursQuarter = value;
	}

	static get maxScheduleWidth(): number {
		return this._maxScheduleWidth;
	}

	static set maxScheduleWidth(value: number) {
		this._maxScheduleWidth = value;
	}

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

	static get quarterWidth(): number {
		return this._quarterWidth;
	}

	static set quarterWidth(value: number) {
		this._quarterWidth = value;
	}

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

	static get displayVerticalScrollbar(): boolean {
		return this._displayVerticalScrollbar;
	}

	static set displayVerticalScrollbar(value: boolean) {
		this._displayVerticalScrollbar = value;
	}

	// endregion

	// region Init

	static init(daysMechanics: DaysMechanics) {
		const existentSchedules = Object.keys(daysMechanics).length > 0;

		const today = dayjs().startOf(Constants.DAY_JS.d);
		this.lineHeight = Constants.VALUE.LINE_HEIGHT_DEFAULT;
		this.oneDayMode = true;
		this.maxTodayScheduleHoursQuarter = [];

		/* Al cargar el panel, siempre aparece barra de scroll al tener el zoom al máximo */
		this.gridContainerHeight = this.calcGridHeight();
		this.displayVerticalScrollbar = this.checkDisplayScrollbar(
			daysMechanics, today, this.gridContainerHeight, existentSchedules
		);
		this.gridWidth = this.calcGridWidth(this.displayVerticalScrollbar, this.oneDayMode);
		this.calcWidthValuesFromHoursInGrid(this.FIT_HOURS_IN_SCREEN);
		this.defaultHourWidth = this.hourWidth;

		this.initSchedulesHours(daysMechanics, today);
		if (existentSchedules) {
			this.initMaxSchedule();
		}

		console.log('Max. today schedules quarters', this.maxTodayScheduleHoursQuarter);
		console.log('Max. days schedules quarters', this.maxDaysSchedulesHoursQuarter);
		console.log('Max. schedule width:', this.maxScheduleWidth);
	}

	private static checkDisplayScrollbar(
		daysMechanics: DaysMechanics,
		today: any,
		gridContainerHeight: number,
		existentSchedules: boolean
	): boolean {
		if (existentSchedules) {
			const mechanics = daysMechanics[today.valueOf()].filter((mechanic: Mechanic) => mechanic.fixed);
			if (mechanics.length) {
				const mechanicsHeight = this.calcGridCompleteHeight(mechanics);
				return gridContainerHeight < mechanicsHeight;
			}
		}
		return false;
	}

	/**
	 * Crea los arrays que contienen las horas entre los límtes de horarios; es decir, el comienzo del mecánico que
	 * empiece antes, y el fin del que termine más tarde
	 * @param {DaysMechanics} daysMechanics Días y sus mecánicos asociados
	 * @param {Dayjs} today Hoy
	 */
	private static initSchedulesHours(daysMechanics: DaysMechanics, today: Dayjs): void {
		const now = dayjs();
		let [minDaysSchedule, maxDaysSchedule] = [now, now];
		for (const day in daysMechanics) {
			const dayMechanics = daysMechanics[day].filter((mechanic: Mechanic) => !mechanic.fixed);
			if (dayMechanics.length) {
				const [minSchedule, maxSchedule] = this.getScheduleLimits(dayMechanics);
				if (+day == today.valueOf()) {
					this.maxTodayScheduleHoursQuarter = this.buildHoursQuarter(minSchedule, maxSchedule);
				}

				minDaysSchedule = minSchedule.isBefore(minDaysSchedule) ? minSchedule : minDaysSchedule;
				maxDaysSchedule = maxSchedule.isAfter(maxDaysSchedule) ? maxSchedule : maxDaysSchedule;
			}
		}
		/* Si principio y fin del horario son iguales, significa que no existen horarios de mecánicos */
		this.maxDaysSchedulesHoursQuarter = minDaysSchedule != maxDaysSchedule
			? this.buildHoursQuarter(minDaysSchedule, maxDaysSchedule) : [];
	}

	/**
	 * Se obtienen los límites de los horarios de mecánicos de un sólo día
	 * @param {Mechanic[]} mechanics Mecánicos de un día
	 * @returns {Dayjs[]} Par de fechas (comienzo y fin)
	 */
	private static getScheduleLimits(mechanics: Mechanic[]): Dayjs[] {
		const minSchedule = dayjs(
			Math.min(...mechanics.map((mechanic: Mechanic) => mechanic.schedules[0].start.valueOf()))
		);
		const maxSchedule = dayjs(
			Math.max(...mechanics.map((mechanic: Mechanic) => mechanic.schedules[mechanic.schedules.length-1].end.valueOf()))
		);
		return [minSchedule, maxSchedule];
	}

	public static buildHoursQuarter(start: Dayjs, end: Dayjs): HourQuarter[] {
		const hoursQuarter = [];
		let time = <Dayjs> start.subtract(Constants.QUARTERS.STEP_15, Constants.DAY_JS.m);
		const newEnd = end.add(Constants.QUARTERS.STEP_15, Constants.DAY_JS.m);
		while (time < newEnd) {
			hoursQuarter.push(new HourQuarter(time.hour(), time.minute()));
			time = time.add(Constants.QUARTERS.STEP_15, Constants.DAY_JS.m);
		}
		return hoursQuarter;
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
		timelineHeight: number = Constants.VALUE.TIMELINE_HEIGHT,
		unassignedBandContainerHeight: number = Constants.VALUE.UNASSIGNED_BAND_CONTAINER_HEIGHT,
		scrollbarSize: number = Constants.VALUE.SCROLLBAR_SIZE
	): number {
		return window.innerHeight - timelineHeight - unassignedBandContainerHeight - (scrollbar ? scrollbarSize : 0);
	}

	private static calcGridWidth(
		scrollbar: boolean,
		oneDayMode: boolean,
		appointmentsSummaryWidth: number = Constants.VALUE.TOOLS_BAR_WIDTH,
		toolsBarWidth: number = Constants.VALUE.TOOLS_BAR_WIDTH,
		scrollbarSize: number = Constants.VALUE.SCROLLBAR_SIZE
	): number {
		return window.innerWidth
			- toolsBarWidth
			- (oneDayMode ? 0 : appointmentsSummaryWidth)
			- (scrollbar ? scrollbarSize : 0);
	}

	static calcGridCompleteHeight(dayMechanics: Mechanic[]): number {
		return UtilsService.sumValues(
			dayMechanics.map((mechanic: Mechanic) => this.calcMechanicLineCompleteHeight(mechanic.lines))
		);
	}

	private static calcMechanicLineCompleteHeight(lines: number): number {
		return (lines * Constants.VALUE.LINE_HEIGHT_DEFAULT) + Constants.VALUE.JOB_LINE_TYPE_HEIGHT
				+ Constants.VALUE.MECHANIC_BOTTOM_MARGIN + Constants.VALUE.MECHANIC_BORDER * 2;
	}

	// endregion

	// region Hour widths

	/**
	 * Se calculan los anchos de horas e intervalos a partir del número de las primeras que caben en pantalla
	 * @param {number} hoursInGrid Número de horas que caben en pantalla
	 */
	private static calcWidthValuesFromHoursInGrid(hoursInGrid: number): void {
		/* Se calculan los anchos a partir del número de horas que encajan en pantalla; sabiendo que a zoom máximo,
		*  en todoo el ancho de la pantalla caben 4 horas, se hacen las cuentas correspondientes */
		this.quarterWidth = this.calcQuarterWidthFromHoursInGrid(this.FIT_HOURS_IN_SCREEN);
		this.hourWidth = this.calcHourWidthFromQuarterWidth(this.quarterWidth);
		/* Se calcula el ancho de un bloque de 5 minutos (unidad mínima de ancho en panel) */
		this.intervalWidth = this.calcIntervalWidthFromQuarterWidth(this.quarterWidth);
	}

	/**
	 * Se calculan los anchos de horas e intervalos a partir del ancho total del horario
	 * @param {number} maxScheduleWidth Ancho total del horario
	 */
	private static calcWidthValuesFromMaxScheduleWidth(maxScheduleWidth: number): void {
		this.quarterWidth = this.calcQuarterWidthFromMaxScheduleWidth(maxScheduleWidth);
		this.hourWidth = this.calcHourWidthFromQuarterWidth(this.quarterWidth);
		this.intervalWidth = this.calcIntervalWidthFromQuarterWidth(this.quarterWidth);
	}

	private static calcQuarterWidthFromMaxScheduleWidth(
		maxScheduleWidth: number,
		maxScheduleHoursQuarter: HourQuarter[] = this.maxScheduleHoursQuarter,
		leftOffset: number = Constants.VALUE.MECHANIC_INFO_WIDTH
	): number {
		return (maxScheduleWidth - leftOffset) / maxScheduleHoursQuarter.length;
	}

	/**
	 * Se calcula el ancho de un cuarto a partir del número de horas que encajan en pantalla
	 * @param {number} hoursInGrid Número de horas que aparecen en pantalla (por defecto 4)
	 * @param {number} gridWidth Ancho de la cuadrícula
	 * @param {number} leftOffset Desplazamiento producido por el ancho de la info del mecánico
	 * @param {number} quartersPerHour Número de cuartos en una hora
	 * @returns {number} Ancho de una hora
	 */
	private static calcQuarterWidthFromHoursInGrid(
		hoursInGrid: number,
		gridWidth: number = this.gridWidth,
		leftOffset: number = Constants.VALUE.MECHANIC_INFO_WIDTH,
		quartersPerHour: number = Constants.VALUE.QUARTERS_PER_HOUR,
	): number {
		return (gridWidth - leftOffset) / (hoursInGrid * quartersPerHour);
	}

	/**
	 * Se calcula el ancho de una hora a partir del de un cuarto
	 * @param {number} quarterWidth Ancho de un cuarto
	 * @param {number} quartersPerHour Cuartos (15 min) en una hora
	 * @returns {number} Ancho de un intervalo
	 */
	private static calcHourWidthFromQuarterWidth(
		quarterWidth: number,
		quartersPerHour: number = Constants.VALUE.QUARTERS_PER_HOUR,
	) {
		return quarterWidth * quartersPerHour;
	}

	/**
	 * Se calcula el ancho de un intervalo (5 min) a partir del ancho de una hora
	 * @param {number} quarterWidth Ancho de un cuarto
	 * @param {number} intervalsPerQuarter Intervalos (5 min) en un cuarto (15 min)
	 * @returns {number} Ancho de un intervalo
	 */
	private static calcIntervalWidthFromQuarterWidth(
		quarterWidth: number,
		intervalsPerQuarter: number = Constants.VALUE.INTERVALS_PER_QUARTER,
	) {
		return quarterWidth / intervalsPerQuarter;
	}

	// endregion

	// region Update schedule values

	/**
	 * Actualiza el número de horas y ancho del horario, en función de si la vista es de uno o varios días
	 * @param {boolean} oneDayMode Vista de uno o varios días
	 * @returns {number[]} Array de horas del horario
	 */
	static updateMaxSchedule(oneDayMode: boolean): void {
		this.gridWidth = this.calcGridWidth(this.displayVerticalScrollbar, oneDayMode);
		const maxQuarterWidth = this.calcQuarterWidthFromHoursInGrid(this.FIT_HOURS_IN_SCREEN);
		/* Se actualiza el número de horas. Un horario de otro día puede tener más horas y, por tanto, necesitasr un
		*  mayor ancho del contenedor para albergarlo */
		this.maxScheduleHoursQuarter = oneDayMode ? this.maxTodayScheduleHoursQuarter : this.maxDaysSchedulesHoursQuarter;
		/* Sabiendo el número de horas, se calcula el mayor ancho posible que puede adquirir: cuando el ancho de la
		*  hora es el mayor posible; es decir, el default */
		this.maxScheduleMaxWidth = this.calcScheduleWidth(this.maxScheduleHoursQuarter, maxQuarterWidth);
		/* Si se está activando el modo de un sólo día, el ancho de los horarios coincide con el máximo. Si no, es el
		*  ancho del grid, ya que al activar la vista de varios días, automáticamente se ajusta a la pantalla */
		this.maxScheduleWidth = oneDayMode ? this.maxScheduleMaxWidth : this.gridWidth;
		this.calcWidthValuesFromMaxScheduleWidth(this.maxScheduleWidth);
	}

	/**
	 * Calcula el nacho del horario a partir del número de horas y del ancho de cada una
	 * @param {number[]} hoursQuarter Array con las horas y cuartos del horario
	 * @param {number} quarterWidth Ancho de un cuarto
	 * @param {number} leftOffset Desplazamiento producido por el ancho de la info del mecánico
	 * @returns {number} Ancho del horario
	 */
	private static calcScheduleWidth(
		hoursQuarter: HourQuarter[],
		quarterWidth: number,
		leftOffset: number = Constants.VALUE.MECHANIC_INFO_WIDTH
	): number {
		return leftOffset + hoursQuarter.length * quarterWidth;
	}

	/**
	 * Calcula los valores dimensionales a partir del nuevo valor de maxScheduleWidth, enviado por el slider del zoom
	 * @param {number} maxScheduleWidth Nuevo valor del máximo ancho
	 */
	static updateMaxScheduleWidth(maxScheduleWidth: number) {
		this.maxScheduleWidth = maxScheduleWidth;
		this.quarterWidth = this.calcQuarterWidthFromMaxScheduleWidth(this.maxScheduleWidth);
		this.hourWidth = this.calcHourWidthFromQuarterWidth(this.quarterWidth);
		this.intervalWidth = this.calcIntervalWidthFromQuarterWidth(this.quarterWidth);
	}

	// endregion

	// region Convert properties to dimensions

	static calcWidthFromDuration(duration: number, intervalWidth: number = this.intervalWidth): number {
		/* Se obtiene el número de intervalos que ocupan los minutos de duración */
		const durationIntervals = this.getIntervalsNumberFromDuration(duration);
		/* Se retorna el ancho en px */
		return durationIntervals * intervalWidth;
	}

	static calcLeftFromStart(start: Dayjs) {
		/* Se obtienen los minutos desde el inicio del horario, hasta start */
		const relativeMinutes = this.getRelativeMinutesFromStart(start);
		/* Se obtiene el número de intervalos correspondiente a los minutos */
		const relativeIntervals = this.getIntervalsNumberFromDuration(relativeMinutes);
		/* Se retorna el ancho en px */
		return relativeIntervals * this.intervalWidth;
	}

	static calcUnassignedGroupLeft(groups: CardsGroup[], groupIndex: number): number {
		const marginBetweenGroups = groupIndex < 2
			? Constants.VALUE.UNASSIGNED_MARGIN_BETWEEN_GROUPS
			: groupIndex * Constants.VALUE.UNASSIGNED_MARGIN_BETWEEN_GROUPS;
		return this.calcLeftFromCardsGroups(groupIndex, groups) + marginBetweenGroups;
	}

	static calcLeftFromCardsGroups(groupIndex: number, groups: CardsGroup[]) {
		const previousWidth = this.findCardsGroupsWidth(groups.slice(0, groupIndex));
		return (groupIndex == 0 ? 0 : groups[0].left) + previousWidth;
	}

	private static findCardsGroupsWidth(cardsGroups: CardsGroup[]): number {
		let cards = [];
		cardsGroups.forEach((group: CardsGroup) => cards.push(...group.cards));
		return cards.map((card: Card) => card.width).reduce((a: number, b: number) => a + b, 0);
	}

	// endregion

	// region Convert to properties

	static calcStartFromLeft(left: number, day: Dayjs): Dayjs {
		const intervals = this.getIntervalsNumberFromWidth(left);
		const minutes = this.getRelativeMinutesFromIntervals(intervals);
		return day.hour(minutes/60).minute(minutes%60)
	}

	static calcDurationFromWidth(width: number): number {
		return this.getIntervalsNumberFromWidth(width) * Constants.VALUE.MINUTES_PER_INTERVAL;
	}

	// endregion

	// region Convert from properties



	// endregion

	// region Auxiliary methods

	private static getRelativeMinutesFromStart(time: Dayjs) {
		const minutes = time.hour() * 60 + time.minute();
		return minutes - this.getStartScheduleMinutes();
	}

	private static getRelativeMinutesFromIntervals(intervalsNumber: number): number {
		return this.getStartScheduleMinutes() + Constants.VALUE.MINUTES_PER_INTERVAL * intervalsNumber;
	}

	private static getStartScheduleMinutes() {
		const firstHourQuarter = this.maxScheduleHoursQuarter[0];
		return firstHourQuarter.hour * this.MINUTES_PER_HOUR + firstHourQuarter.quarter ;
	}

	private static getIntervalsNumberFromDuration(duration: number): number {
		return duration / Constants.VALUE.MINUTES_PER_INTERVAL;
	}

	static getIntervalsNumberFromWidth(width: number) {
		return Math.round(width / this.intervalWidth);
	}

	static createPosition(rect: any, scrollLeft: number = undefined, scrollTop: number = undefined): Position {
		let [left, right, top, bottom] = [rect.left, rect.right, rect.top, rect.bottom];
		if (scrollLeft) {
			left = left + scrollLeft;
			right = right + scrollLeft;
		}
		if (scrollTop) {
			top = top + scrollTop;
			bottom = bottom + scrollTop;
		}
		return new Position(left, right, top, bottom);
	}

	// endregion

	static toggleDayMode(): boolean {
		const toggled = false;
		if (MechanicsService.checkExistentDaysMechanics()) {
			this.oneDayMode = !this.oneDayMode;
			NotificationService.notifyOneDayMode(this.oneDayMode);
			return !toggled;
		}
		return toggled;
	}

}
