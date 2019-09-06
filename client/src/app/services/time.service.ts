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
	// private readonly HOURS_NUMBER: number = 5;
	private readonly MINUTES_PER_HOUR: number = 60;
	private readonly QUARTERS_PER_HOUR: number = 4;
	private readonly INTERVALS_PER_QUARTER: number = 3;
	private readonly MINUTES_PER_INTERVAL: number = 5;
	private readonly LEFT_OFFSET: number = 180;
	private readonly MINUTES_8: number = 480;
	private readonly RIGHT_PANEL_WIDTH: number = 200;
	readonly FIT_HOURS_IN_SCREEN: number = 4;
	readonly QUARTERS: string[] = ['00', '15', '30', '45'];

	private widthValue: number;

	private _today: Date;

	private _maxTodayScheduleHours: number[];
	private _maxDaysSchedulesHours: number[];
	private _maxScheduleHours: number[];

	private _leftOffsetPercentage: number;
	private _hourPercentage: number;
	private _maxSchedulePercentage: number;
	// private _maxDaysSchedulesPercentage: number;
	// private _percentageWidth: number;
	// private _dropzoneWidth: number;
	private _intervalPercentage: number;

	private _intervalsNumber: number;

	private hourPercentageSubject: BehaviorSubject<number>;
	private _hourPercentage$: Observable<number>;

	// private intervalWidthSubject: BehaviorSubject<number>;
	// private _intervalWidth$: Observable<number>;

	private maxSchedulePercentageSubject: BehaviorSubject<number>;
	private _maxSchedulePercentage$: Observable<number>;

	private widthSubscription: any;

	constructor(private daysService: DaysService) {
		this.today = UtilsService.clearTime(new Date());

		this.hourPercentageSubject = new BehaviorSubject<number>(this.hourPercentage);
		this.hourPercentage$ = this.hourPercentageSubject.asObservable();

		this.initPercentages();
		console.log('Hour width:', this.hourPercentage, '%');
		console.log('Interval width:', this.intervalPercentage, '%');

		// TODO Se usa en dimensions sliders para actualizar el max value. Comprobar si es necesario.
		this.maxSchedulePercentageSubject = new BehaviorSubject<number>(this.maxSchedulePercentage);
		this.maxSchedulePercentage$ = this.maxSchedulePercentageSubject.asObservable();
	}

	// region Init

	init() {
		this.initDaysSchedules(this.daysService.daysMechanics);
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
		this.maxScheduleHours = this.getMaxScheduleHours(true);

		console.log('Max. today schedules hours', this.maxTodayScheduleHours);
		console.log('Max. days schedules hours', this.maxDaysSchedulesHours);
	}

	private getScheduleLimits(mechanics: Mechanic[]) {
		const minSchedule = new Date(Math.min(...mechanics.map(mechanic => mechanic.schedule.start.getTime())));
		const maxSchedule = new Date(Math.max(...mechanics.map(mechanic => mechanic.schedule.end.getTime())));
		return [minSchedule, maxSchedule];
	}

	initPercentages(): void {
		const gridWidth = window.innerWidth - this.RIGHT_PANEL_WIDTH;
		this.leftOffsetPercentage = (this.LEFT_OFFSET * 100) / gridWidth;
		this.calcWidthPercentages(this.FIT_HOURS_IN_SCREEN);
	}

	// endregion

	// region Getters / setters

	get today(): Date {
		return this._today;
	}

	set today(value: Date) {
		this._today = value;
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

	get hourPercentage$(): Observable<number> {
		return this._hourPercentage$;
	}

	set hourPercentage$(value: Observable<number>) {
		this._hourPercentage$ = value;
	}

	get minPercentageValue() {
		return this._MIN_PERCENTAGE_VALUE;
	}

	// endregion

	// region Width percentage

	calcWidthPercentages(hoursInGrid: number) {
		this.calcHourPercentageFromHoursInGrid(hoursInGrid);
		this.intervalPercentage = this.hourPercentage / (this.QUARTERS_PER_HOUR * this.INTERVALS_PER_QUARTER);
	}

	calcHourPercentageFromHoursInGrid(hoursInGrid: number): void {
		this.hourPercentage = (100 - this.leftOffsetPercentage) / hoursInGrid;
		this.hourPercentageSubject.next(this.hourPercentage);
	}

	calcHourPercentageFromMaxSchedulePercentage(maxSchedulePercentage: number): number {
		return (maxSchedulePercentage - this.leftOffsetPercentage) / this.maxScheduleHours.length;
	}

	getMaxScheduleHours(oneDayMode: boolean): number[] {
		this.maxScheduleHours = oneDayMode ? this.maxTodayScheduleHours : this.maxDaysSchedulesHours;
		return this.maxScheduleHours;
	}

	calcSchedulePercentage(hours: number[]): number {
		this.maxSchedulePercentage = this.leftOffsetPercentage + hours.length * this.hourPercentage;
		this.maxSchedulePercentageSubject.next(this.maxSchedulePercentage);
		return this.maxSchedulePercentage;
	}

	updatePercentage(value: number) {
		this.hourPercentage = this.calcHourPercentageFromMaxSchedulePercentage(value);
		this.hourPercentageSubject.next(this.hourPercentage);
	}

	// endregion

	/* ---- LEFT ---- */

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

	/* ---- START ---- */

	calculateStart(left: number, day: Date): Date {
		const intervals = this.getIntervalsNumberFromDimensionValue(left);
		const minutes = this.getRelativeMinutesFromIntervals(intervals);
		return UtilsService.parseTimeFromMinutes(minutes, day);
	}

	private getRelativeMinutesFromIntervals(intervalsNumber: number): number {
		return this.MINUTES_8 + this.MINUTES_PER_INTERVAL * intervalsNumber;
	}

	/* ---- WIDTH ---- */

	calculateWidth(duration: number): number {
		return this.getIntervalsNumberFromDuration(duration) * this.intervalPercentage;
	}

	private getIntervalsNumberFromDuration(duration: number) {
		return duration / this.MINUTES_PER_INTERVAL;
	}

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
