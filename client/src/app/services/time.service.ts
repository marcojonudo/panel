import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {UtilsService} from "./utils.service";
import {Mechanic} from "../objects/mechanic";
import {DaysService} from "./days.service";

@Injectable({
	providedIn: 'root'
})
export class TimeService {

	private readonly _MIN_PERCENTAGE_VALUE: number = 100; // (%)

	private readonly START_HOUR: number = 8;
	private readonly MINUTES_PER_HOUR: number = 60;
	private readonly QUARTERS_PER_HOUR: number = 4;
	private readonly INTERVALS_PER_QUARTER: number = 3;
	private readonly MINUTES_PER_INTERVAL: number = 5;
	private readonly LEFT_OFFSET: number = 180;
	private readonly MINUTES_8: number = 480;
	private readonly RIGHT_PANEL_WIDTH: number = 200;
	private readonly TOOLS_BAR_WIDTH: number = 30;
	readonly FIT_HOURS_IN_SCREEN: number = 4;
	readonly QUARTERS: string[] = ['00', '15', '30', '45'];

	private _today: Date;

	private _maxTodayScheduleHours: number[];
	private _maxDaysSchedulesHours: number[];
	private _maxScheduleHours: number[];

	private _gridWidth: number;
	private _leftOffsetPercentage: number;
	private _hourPercentage: number;
	private _defaultHourPercentage: number;
	private _maxSchedulePercentage: number;
	private _maxScheduleMaxPercentage: number;
	private _intervalPercentage: number;
	private _intervalWidth: number;

	private maxSchedulePercentageSubject: BehaviorSubject<number>;
	private _maxSchedulePercentage$: Observable<number>;

	private maxScheduleMaxPercentageSubject: BehaviorSubject<number>;
	private _maxScheduleMaxPercentage$: Observable<number>;

	constructor(private daysService: DaysService) {
		// TODO Evitar error cuando no hay horario en today
		this.today = UtilsService.clearTime(new Date());

		/* Antes de cargar la información de los horarios, se pueden calcular los porcentajes que ocupan el hueco
		*  izquierdo (los 180px de la info del mecánico) y la hora (4 por defecto en el hueco del grid) */
		this.initPercentages();

		this.maxSchedulePercentageSubject = new BehaviorSubject<number>(this.maxSchedulePercentage);
		this.maxSchedulePercentage$ = this.maxSchedulePercentageSubject.asObservable();

		/* Observer usado para notificar al slider cuál es el valor máximo de zoom posible */
		this.maxScheduleMaxPercentageSubject = new BehaviorSubject<number>(this.maxScheduleMaxPercentage);
		this.maxScheduleMaxPercentage$ = this.maxScheduleMaxPercentageSubject.asObservable();
	}

	// region Init

	initPercentages(): void {
		this.gridWidth = window.innerWidth - this.RIGHT_PANEL_WIDTH - this.TOOLS_BAR_WIDTH;
		this.leftOffsetPercentage = (this.LEFT_OFFSET * 100) / this.gridWidth;
		this.calcWidthValues();
	}

	init() {
		this.initDaysSchedules(this.daysService.daysMechanics);
		this.initMaxSchedule();
	}

	initDaysSchedules(daysMechanics: any) {
		let minDaysSchedules = new Date();
		let maxDaysSchedules = new Date();
		for (let day in daysMechanics) {
			const [minSchedule, maxSchedule] = this.getScheduleLimits(daysMechanics[day]);

			if (parseInt(day) == this.today.getTime()) {
				this.maxTodayScheduleHours = UtilsService.getScheduleHours(minSchedule, maxSchedule);
			}

			minDaysSchedules = UtilsService.timeGreaterThan(minDaysSchedules, minSchedule) ? minSchedule : minDaysSchedules;
			maxDaysSchedules = UtilsService.timeGreaterThan(maxSchedule, maxDaysSchedules) ? maxSchedule : maxDaysSchedules;
		}
		this.maxDaysSchedulesHours = UtilsService.getScheduleHours(minDaysSchedules, maxDaysSchedules);

		console.log('Max. today schedules hours', this.maxTodayScheduleHours);
		console.log('Max. days schedules hours', this.maxDaysSchedulesHours);
	}

	private getScheduleLimits(mechanics: Mechanic[]) {
		const minSchedule = new Date(Math.min(...mechanics.map(mechanic => mechanic.schedule.start.getTime())));
		const maxSchedule = new Date(Math.max(...mechanics.map(mechanic => mechanic.schedule.end.getTime())));
		return [minSchedule, maxSchedule];
	}

	initMaxSchedule(): void {
		this.updateMaxSchedule(true);
		this.maxSchedulePercentage = this.calcSchedulePercentage(this.maxScheduleHours, this.defaultHourPercentage);

		this.maxSchedulePercentageSubject.next(this.maxSchedulePercentage);
	}

	// endregion

	// region Getters / setters

	get today(): Date {
		return this._today;
	}

	set today(value: Date) {
		this._today = value;
	}

	get gridWidth(): number {
		return this._gridWidth;
	}

	set gridWidth(value: number) {
		this._gridWidth = value;
	}

	get maxTodayScheduleHours(): number[] {
		return this._maxTodayScheduleHours;
	}

	set maxTodayScheduleHours(value: number[]) {
		this._maxTodayScheduleHours = value;
	}

	get maxDaysSchedulesHours(): number[] {
		return this._maxDaysSchedulesHours;
	}

	set maxDaysSchedulesHours(value: number[]) {
		this._maxDaysSchedulesHours = value;
	}

	get maxScheduleHours(): number[] {
		return this._maxScheduleHours;
	}

	set maxScheduleHours(value: number[]) {
		this._maxScheduleHours = value;
	}

	get maxSchedulePercentage(): number {
		return this._maxSchedulePercentage;
	}

	set maxSchedulePercentage(value: number) {
		this._maxSchedulePercentage = value;
	}

	get maxSchedulePercentage$(): Observable<number> {
		return this._maxSchedulePercentage$;
	}

	set maxSchedulePercentage$(value: Observable<number>) {
		this._maxSchedulePercentage$ = value;
	}

	get leftOffsetPercentage(): number {
		return this._leftOffsetPercentage;
	}

	set leftOffsetPercentage(value: number) {
		this._leftOffsetPercentage = value;
	}

	get hourPercentage(): number {
		return this._hourPercentage;
	}

	set hourPercentage(value: number) {
		this._hourPercentage = value;
	}

	get intervalPercentage(): number {
		return this._intervalPercentage;
	}

	set intervalPercentage(value: number) {
		this._intervalPercentage = value;
	}

	get intervalWidth(): number {
		return this._intervalWidth;
	}

	set intervalWidth(value: number) {
		this._intervalWidth = value;
	}

	get minPercentageValue() {
		return this._MIN_PERCENTAGE_VALUE;
	}

	get maxScheduleMaxPercentage$(): Observable<number> {
		return this._maxScheduleMaxPercentage$;
	}

	set maxScheduleMaxPercentage$(value: Observable<number>) {
		this._maxScheduleMaxPercentage$ = value;
	}

	get maxScheduleMaxPercentage(): number {
		return this._maxScheduleMaxPercentage;
	}

	set maxScheduleMaxPercentage(value: number) {
		this._maxScheduleMaxPercentage = value;
	}

	get defaultHourPercentage(): number {
		return this._defaultHourPercentage;
	}

	set defaultHourPercentage(value: number) {
		this._defaultHourPercentage = value;
	}

	// endregion

	// region Width percentage

	calcWidthValues() {
		this.calcHourPercentageFromHoursInGrid(this.FIT_HOURS_IN_SCREEN);
		this.calcIntervalValues(this.hourPercentage);
	}

	calcIntervalValues(hourPercentage: number) {
		this.intervalPercentage = hourPercentage / (this.QUARTERS_PER_HOUR * this.INTERVALS_PER_QUARTER);
		this.intervalWidth = this.convertPercentageToPx(this.intervalPercentage);
	}

	calcHourPercentageFromHoursInGrid(hoursInGrid: number): void {
		this.defaultHourPercentage = (100 - this.leftOffsetPercentage) / hoursInGrid;
		this.hourPercentage = this.defaultHourPercentage;
	}

	updateMaxSchedule(oneDayMode: boolean): number[] {
		this.maxScheduleHours = oneDayMode ? this.maxTodayScheduleHours : this.maxDaysSchedulesHours;
		this.maxScheduleMaxPercentage = this.calcSchedulePercentage(this.maxScheduleHours, this.defaultHourPercentage);

		this.maxScheduleMaxPercentageSubject.next(this.maxScheduleMaxPercentage);
		return this.maxScheduleHours;
	}

	calcSchedulePercentage(hours: number[], hourPercentage: number): number {
		return this.leftOffsetPercentage + hours.length * hourPercentage;
	}

	calcMaxSchedulePercentage(oneDayMode: boolean): void {
		this.updateMaxSchedulePercentage(oneDayMode ? this.maxScheduleMaxPercentage : 100);
	}

	updateMaxSchedulePercentage(value: number) {
		this.maxSchedulePercentage = value;
		this.hourPercentage = this.calcHourPercentageFromMaxSchedulePercentage(value);
		this.calcIntervalValues(this.hourPercentage);
		this.maxSchedulePercentageSubject.next(this.maxSchedulePercentage);
	}

	calcHourPercentageFromMaxSchedulePercentage(maxSchedulePercentage: number): number {
		return (maxSchedulePercentage - this.leftOffsetPercentage) / this.maxScheduleHours.length;
	}

	convertPercentageToPx(percentage: number): number {
		return (percentage * this.gridWidth) / 100;
	}

	// endregion

	// region Left

	calculateLeft(start: Date) {
		const relativeMinutes = this.getRelativeMinutes(start);
		const relativeIntervals = this.getIntervalsNumberFromDuration(relativeMinutes);

		return relativeIntervals * this.intervalPercentage;
	}

	private getRelativeMinutes(time: Date) {
		const minutes = time.getHours() * 60 + time.getMinutes();
		return minutes - this.getStartScheduleMinutes();
	}

	private getStartScheduleMinutes() {
		return this.START_HOUR * this.MINUTES_PER_HOUR;
	}

	// endregion

	/* ---- START ---- */

	calculateStart(left: number, day: Date): Date {
		const intervals = this.getIntervalsNumberFromDimensionValue(left);
		const minutes = this.getRelativeMinutesFromIntervals(intervals);
		return UtilsService.parseTimeFromMinutes(minutes, day);
	}

	private getRelativeMinutesFromIntervals(intervalsNumber: number): number {
		return this.MINUTES_8 + this.MINUTES_PER_INTERVAL * intervalsNumber;
	}

	// region Width

	calculateWidth(duration: number): number {
		return this.getIntervalsNumberFromDuration(duration) * this.intervalWidth;
	}

	private getIntervalsNumberFromDuration(duration: number) {
		return duration / this.MINUTES_PER_INTERVAL;
	}

	// endregion

	/* ---- DURATION ---- */

	calculateDuration(width: number): number {
		return Math.round(this.getIntervalsNumberFromWidth(width) * this.MINUTES_PER_INTERVAL);
	}

	private getIntervalsNumberFromWidth(width: number) {
		return width / this.intervalPercentage;
	}


	getIntervalsNumberFromDimensionValue(value: number) {
		return value / this.intervalPercentage;
	}

}
