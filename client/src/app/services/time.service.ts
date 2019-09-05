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

	private readonly SCROLLABLE_CONTAINER_WIDTH_MAX: number = 350; // (%)
	private readonly SCROLLABLE_CONTAINER_WIDTH_MIN: number = 100; // (%)

	private readonly START_HOUR: number = 8;
	private readonly HOURS_NUMBER: number = 5;
	private readonly MINUTES_PER_HOUR: number = 60;
	private readonly QUARTERS_PER_HOUR: number = 4;
	private readonly INTERVALS_PER_QUARTER: number = 3;
	private readonly MINUTES_PER_INTERVAL: number = 5;
	private readonly LEFT_OFFSET: number = 180;
	private readonly MINUTES_8: number = 480;
	private readonly RIGHT_PANEL_WIDTH: number = 200;
	private readonly FIT_HOURS_IN_SCREEN: number = 4;

	private widthValue: number;

	private _daysSchedulesHours: number[];
	private _maxDaysSchedulesHours: number[];
	private _maxScheduleHours: number[];
	private hours: number[];
	private quarters: string[];

	private _leftOffsetPercentage: number;
	private _hourPercentage: number;
	private _daysSchedulesPercentage: number;
	private _maxDaysSchedulesPercentage: number;
	private _maxSchedulePercentage: number;
	private _percentageWidth: number;
	private _dropzoneWidth: number;
	private _intervalPercentage: number;

	private _intervalsNumber: number;

	private percentageWidthSubject: BehaviorSubject<number>;
	private _percentageWidth$: Observable<number>;

	private intervalWidthSubject: BehaviorSubject<number>;
	private _intervalWidth$: Observable<number>;

	private maxScheduleHoursSubject: BehaviorSubject<number[]>;
	private _maxScheduleHours$: Observable<number[]>;

	private widthSubscription: any;

	constructor(private daysService: DaysService) {
		// this.minuteWidth = this.MINUTE_WIDTH_DEFAULT;
		this.widthValue = this.SCROLLABLE_CONTAINER_WIDTH_MAX;
		this.hours = Array(this.HOURS_NUMBER).fill(0).map((x, i) => this.START_HOUR + i);
		this.quarters = ['00', '15', '30', '45'];
		this.intervalsNumber = this.HOURS_NUMBER * this.quarters.length * this.INTERVALS_PER_QUARTER;

		this.percentageWidth = this.SCROLLABLE_CONTAINER_WIDTH_MAX;
		[this.leftOffsetPercentage, this.hourPercentage, this.intervalPercentage] = this.calculateWidthPercentages(window.innerWidth);
		console.log('Hour width:', this.hourPercentage, '%');
		console.log('Interval width:', this.intervalPercentage, '%');

		this.percentageWidthSubject = new BehaviorSubject<number>(this.hourPercentage);
		this.percentageWidth$ = this.percentageWidthSubject.asObservable();

		this.intervalWidthSubject = new BehaviorSubject<number>(0);
		this.intervalWidth$ = this.intervalWidthSubject.asObservable();

		this.maxScheduleHoursSubject = new BehaviorSubject<number[]>([]);
		this.maxScheduleHours$ = this.maxScheduleHoursSubject.asObservable();
	}

	// region Init

	init(daysMechanicsList: any) {
		this.initDaysSchedules(daysMechanicsList);
		this.initScheduleWidth();
	}

	initDaysSchedules(daysMechanicsList: any) {
		let minDaysSchedules = new Date();
		let maxDaysSchedules = new Date();
		this.daysSchedulesHours = {};
		console.log(daysMechanicsList);
		for (let dayMechanics of daysMechanicsList) {
			const [minSchedule, maxSchedule] = this.getScheduleLimits(dayMechanics.mechanics);
			this.daysSchedulesHours[dayMechanics.day.getTime()] = UtilsService.getScheduleHours(minSchedule, maxSchedule);

			minDaysSchedules = UtilsService.timeGreaterThan(minDaysSchedules, minSchedule) ? minSchedule : minDaysSchedules;
			maxDaysSchedules = UtilsService.timeGreaterThan(maxSchedule, maxDaysSchedules) ? maxSchedule : maxDaysSchedules;
		}
		this.maxDaysSchedulesHours = UtilsService.getScheduleHours(minDaysSchedules, maxDaysSchedules);
		console.log('Days schedules', this.daysSchedulesHours);
		console.log('Max days schedules hours', this.maxDaysSchedulesHours);
	}

	private getScheduleLimits(mechanics: Mechanic[]) {
		const minSchedule = new Date(Math.min(...mechanics.map(mechanic => mechanic.schedule.start.getTime())));
		const maxSchedule = new Date(Math.max(...mechanics.map(mechanic => mechanic.schedule.end.getTime())));
		// const minSchedule = new Date(Math.min(...mechanics.filter(mechanic =>
		// 	mechanic.schedule.morningStart || mechanic.schedule.afternoonStart
		// ).map(mechanic =>
		// 	(mechanic.schedule.morningStart ? mechanic.schedule.morningStart : mechanic.schedule.afternoonStart).getTime()
		// )));
		// const maxSchedule = new Date(Math.max(...mechanics.filter(mechanic =>
		// 	mechanic.schedule.afternoonEnd || mechanic.schedule.morningEnd
		// ).map(mechanic =>
		// 	(mechanic.schedule.afternoonEnd ? mechanic.schedule.afternoonEnd : mechanic.schedule.morningEnd).getTime()
		// )));
		return [minSchedule, maxSchedule];
	}

	initScheduleWidth() {
		this.maxDaysSchedulesPercentage = this.leftOffsetPercentage + this.maxDaysSchedulesHours.length * this.hourPercentage;
		console.log('Max schedule:', this.maxDaysSchedulesPercentage, '%');
		// this.percentageWidthSubject = new BehaviorSubject<number>(260);
		// this.percentageWidth$ = this.percentageWidthSubject.asObservable();
		this.daysService.oneDayMode$.subscribe(oneDayMode => {
			this.maxScheduleHours = oneDayMode ?
				this.daysSchedulesHours[new Date().setHours(0, 0, 0, 0)] : this.maxDaysSchedulesHours;
			console.log('ONE DAY MODE', oneDayMode, this.maxScheduleHours);
			// this.maxSchedulePercentage = oneDayMode ?
			// 	this.getMaxDaySchedulePercentage(new Date().setHours(0, 0, 0, 0)) : this.maxDaysSchedulesPercentage;
			this.maxScheduleHoursSubject.next(this.maxScheduleHours);
		});
	}

	// endregion

	// region Getters / setters

	get percentageWidth$(): Observable<number> {
		return this._percentageWidth$;
	}

	set percentageWidth$(value: Observable<number>) {
		this._percentageWidth$ = value;
	}

	get percentageWidth(): number {
		return this._percentageWidth;
	}

	set percentageWidth(value: number) {
		this._percentageWidth = value;
	}

	get intervalWidth$(): Observable<number> {
		return this._intervalWidth$;
	}

	set intervalWidth$(value: Observable<number>) {
		this._intervalWidth$ = value;
	}

	get dropzoneWidth(): number {
		return this._dropzoneWidth;
	}

	set dropzoneWidth(value: number) {
		this._dropzoneWidth = value;
		this.resize()
	}

	get intervalPercentage(): number {
		return this._intervalPercentage;
	}

	set intervalPercentage(value: number) {
		this._intervalPercentage = value;
	}

	get intervalsNumber(): number {
		return this._intervalsNumber;
	}

	set intervalsNumber(value: number) {
		this._intervalsNumber = value;
	}

	get daysSchedulesHours(): any {
		return this._daysSchedulesHours;
	}

	set daysSchedulesHours(value: any) {
		this._daysSchedulesHours = value;
	}

	get hourPercentage(): number {
		return this._hourPercentage;
	}

	set hourPercentage(value: number) {
		this._hourPercentage = value;
	}

	get maxDaysSchedulesHours(): number[] {
		return this._maxDaysSchedulesHours;
	}

	set maxDaysSchedulesHours(value: number[]) {
		this._maxDaysSchedulesHours = value;
	}

	get maxDaysSchedulesPercentage(): number {
		return this._maxDaysSchedulesPercentage;
	}

	set maxDaysSchedulesPercentage(value: number) {
		this._maxDaysSchedulesPercentage = value;
	}

	get leftOffsetPercentage(): number {
		return this._leftOffsetPercentage;
	}

	set leftOffsetPercentage(value: number) {
		this._leftOffsetPercentage = value;
	}

	get maxSchedulePercentage(): number {
		return this._maxSchedulePercentage;
	}

	set maxSchedulePercentage(value: number) {
		this._maxSchedulePercentage = value;
	}

	get maxScheduleHours$(): Observable<number[]> {
		return this._maxScheduleHours$;
	}

	set maxScheduleHours$(value: Observable<number[]>) {
		this._maxScheduleHours$ = value;
	}

	get maxScheduleHours(): number[] {
		return this._maxScheduleHours;
	}

	set maxScheduleHours(value: number[]) {
		this._maxScheduleHours = value;
	}

	// endregion

	private calculateWidthPercentages(windowWidth) {
		const gridWidth = windowWidth - this.RIGHT_PANEL_WIDTH;
		const leftOffsetPercentage = (this.LEFT_OFFSET * 100) / gridWidth;
		const hourInGridPercentage = (100 - leftOffsetPercentage) / this.FIT_HOURS_IN_SCREEN;
		const intervalInGridPercentage = hourInGridPercentage / (this.QUARTERS_PER_HOUR * this.INTERVALS_PER_QUARTER);
		return [leftOffsetPercentage, hourInGridPercentage, intervalInGridPercentage]
	}

	getMaxDayScheduleHours(day: Date) {
		return this.daysSchedulesHours[day.getTime()];
	}

	getMaxDaySchedulePercentage(hours: number[]) {
		return this.leftOffsetPercentage + hours.length * this.hourPercentage;
	}

	getQuarters() {
		return this.quarters;
	}

	getTotalTimeWidth() {
		return this.widthValue;
	}

	getMaxWidthValue() {
		return this.SCROLLABLE_CONTAINER_WIDTH_MAX;
	}

	getMinWidthValue() {
		return this.SCROLLABLE_CONTAINER_WIDTH_MIN;
	}

	setWidthValue(value: number) {
		this.percentageWidthSubject.next(value);
	}

	get minWidth() {
		return this.SCROLLABLE_CONTAINER_WIDTH_MIN;
	}

	toggleFitWidth() {
		this.widthValue = this.widthValue == this.SCROLLABLE_CONTAINER_WIDTH_MIN ?
			this.SCROLLABLE_CONTAINER_WIDTH_MAX : this.SCROLLABLE_CONTAINER_WIDTH_MIN;
		this.percentageWidthSubject.next(this.widthValue);
	}

	resize() {
		// const width = (this.dropzoneWidth + 180) * (this.percentageWidth/100) - 180;
		// this.intervalPercentage = this.dropzoneWidth / this.intervalsNumber;
		// this.intervalWidthSubject.next(this.intervalPercentage);

		// this.cardsService.initDimensions()
		// console.log('calculate', dropzoneWidth, this.intervalsNumber);
		// this._intervalPercentage = dropzoneWidth / this.intervalsNumber;
	}

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
