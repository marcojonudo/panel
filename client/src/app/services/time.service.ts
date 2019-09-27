import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {UtilsService} from "./utils.service";
import {Mechanic} from "../objects/mechanic";
import {DaysService} from "./days.service";
import {CardsGroup} from "../objects/cards-group";

@Injectable({
	providedIn: 'root'
})
export class TimeService {

	private readonly MINUTES_PER_HOUR: number = 60;
	private readonly QUARTERS_PER_HOUR: number = 4;
	private readonly INTERVALS_PER_QUARTER: number = 3;
	private readonly MINUTES_PER_INTERVAL: number = 5;
	private readonly LEFT_OFFSET: number = 180;
	private readonly SCROLLBAR_SIZE: number = 7;
	private readonly RIGHT_PANEL_WIDTH: number = 200;
	private readonly TOOLS_BAR_WIDTH: number = 30;
	private readonly UNASSIGNED_BAR_HEIGHT: number = 100;
	readonly FIT_HOURS_IN_SCREEN: number = 4;
	readonly QUARTERS: string[] = ['00', '15', '30', '45'];

	private _today: Date;

	private _maxTodayScheduleHours: number[];
	private _maxDaysSchedulesHours: number[];
	private _maxScheduleHours: number[];

	private _gridWidth: number;
	private _gridHeight: number;
	private _minWidth: number;
	private _hourWidth: number;
	private _defaultHourWidth: number;
	private _maxScheduleWidth: number;
	private _maxScheduleMaxWidth: number;
	private _intervalWidth: number;

	private maxScheduleWidthSubject: BehaviorSubject<number>;
	private _maxScheduleWidth$: Observable<number>;

	private maxScheduleMaxWidthSubject: BehaviorSubject<number>;
	private _maxScheduleMaxWidth$: Observable<number>;

	constructor(
		private daysService: DaysService
	) {
		// TODO Evitar error cuando no hay horario en today
		this.today = UtilsService.clearTime(new Date());

		this.maxScheduleWidthSubject = new BehaviorSubject<number>(this.maxScheduleWidth);
		this.maxScheduleWidth$ = this.maxScheduleWidthSubject.asObservable();

		/* Observer usado para notificar al slider cuál es el valor máximo de zoom posible */
		this.maxScheduleMaxWidthSubject = new BehaviorSubject<number>(this.maxScheduleMaxWidth);
		this.maxScheduleMaxWidth$ = this.maxScheduleMaxWidthSubject.asObservable();
	}

	// region Init

	init(daysMechanics: any) {
		/* Al cargar el panel, siempre aparece barra de scroll al tener el zoom al máximo */
		this.gridHeight = this.calcGridHeight();
		const displayScrollbar = this.daysService.checkDisplayScrollbar(this.gridHeight, this.today);

		this.gridWidth = this.calcGridWidth(displayScrollbar);
		this.minWidth = this.gridWidth - this.LEFT_OFFSET;

		this.calcWidthValues();

		this.initDaysSchedules(daysMechanics);
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
		this.maxScheduleWidth = this.calcScheduleWidth(this.maxScheduleHours, this.defaultHourWidth);

		console.log('Max. schedule width:', this.maxScheduleWidth);
		this.maxScheduleWidthSubject.next(this.maxScheduleWidth);
	}

	// endregion

	// region Grid dimensions

	calcGridHeight(scrollbar: boolean = true): number {
		return window.innerHeight - this.UNASSIGNED_BAR_HEIGHT - (scrollbar ? this.SCROLLBAR_SIZE : 0);
	}

	calcGridWidth(scrollbar: boolean = true): number {
		return window.innerWidth - this.RIGHT_PANEL_WIDTH - this.TOOLS_BAR_WIDTH - (scrollbar ? this.SCROLLBAR_SIZE : 0);
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

	get gridHeight(): number {
		return this._gridHeight;
	}

	set gridHeight(value: number) {
		this._gridHeight = value;
	}

	get minWidth(): number {
		return this._minWidth;
	}

	set minWidth(value: number) {
		this._minWidth = value;
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

	get maxScheduleWidth(): number {
		return this._maxScheduleWidth;
	}

	set maxScheduleWidth(value: number) {
		this._maxScheduleWidth = value;
	}

	get maxScheduleWidth$(): Observable<number> {
		return this._maxScheduleWidth$;
	}

	set maxScheduleWidth$(value: Observable<number>) {
		this._maxScheduleWidth$ = value;
	}

	get hourWidth(): number {
		return this._hourWidth;
	}

	set hourWidth(value: number) {
		this._hourWidth = value;
	}

	get intervalWidth(): number {
		return this._intervalWidth;
	}

	set intervalWidth(value: number) {
		this._intervalWidth = value;
	}

	get maxScheduleMaxWidth$(): Observable<number> {
		return this._maxScheduleMaxWidth$;
	}

	set maxScheduleMaxWidth$(value: Observable<number>) {
		this._maxScheduleMaxWidth$ = value;
	}

	get maxScheduleMaxWidth(): number {
		return this._maxScheduleMaxWidth;
	}

	set maxScheduleMaxWidth(value: number) {
		this._maxScheduleMaxWidth = value;
	}

	get defaultHourWidth(): number {
		return this._defaultHourWidth;
	}

	set defaultHourWidth(value: number) {
		this._defaultHourWidth = value;
	}

	// endregion

	// region Width

	calcWidthValues() {
		this.calcHourWidthFromHoursInGrid(this.FIT_HOURS_IN_SCREEN);
		this.calcIntervalWidth(this.hourWidth);
	}

	calcIntervalWidth(hourWidth: number) {
		this.intervalWidth = hourWidth / (this.QUARTERS_PER_HOUR * this.INTERVALS_PER_QUARTER);
	}

	calcHourWidthFromHoursInGrid(hoursInGrid: number, gridWidth: number = this.gridWidth, leftOffset = this.LEFT_OFFSET): void {
		this.defaultHourWidth = (gridWidth - leftOffset) / hoursInGrid;
		this.hourWidth = this.defaultHourWidth;
	}

	updateMaxSchedule(oneDayMode: boolean): number[] {
		this.maxScheduleHours = oneDayMode ? this.maxTodayScheduleHours : this.maxDaysSchedulesHours;
		this.maxScheduleMaxWidth = this.calcScheduleWidth(this.maxScheduleHours, this.defaultHourWidth);

		this.maxScheduleMaxWidthSubject.next(this.maxScheduleMaxWidth);
		return this.maxScheduleHours;
	}

	calcScheduleWidth(hours: number[], hourWidth: number, leftOffset: number = this.LEFT_OFFSET): number {
		return leftOffset + hours.length * hourWidth;
	}

	calcMaxScheduleWidth(oneDayMode: boolean): void {
		this.updateMaxScheduleWidth(oneDayMode ? this.maxScheduleMaxWidth : 100);
	}

	updateMaxScheduleWidth(value: number) {
		this.maxScheduleWidth = value;
		this.hourWidth = this.calcHourWidthFromMaxScheduleWidth(value);
		this.calcIntervalWidth(this.hourWidth);
		this.maxScheduleWidthSubject.next(this.maxScheduleWidth);
	}

	calcHourWidthFromMaxScheduleWidth(
		maxScheduleWidth: number,
		leftOffset: number = this.LEFT_OFFSET,
		maxScheduleHours: number[] = this.maxScheduleHours
	): number {
		return (maxScheduleWidth - leftOffset) / maxScheduleHours.length;
	}

	calculateWidth(duration: number): number {
		return this.getIntervalsNumberFromDuration(duration) * this.intervalWidth;
	}

	private getIntervalsNumberFromDuration(duration: number) {
		return duration / this.MINUTES_PER_INTERVAL;
	}

	// endregion

	// region Left

	calculateLeft(start: Date) {
		const relativeMinutes = this.getRelativeMinutes(start);
		const relativeIntervals = this.getIntervalsNumberFromDuration(relativeMinutes);

		return relativeIntervals * this.intervalWidth;
	}

	private getRelativeMinutes(time: Date) {
		const minutes = time.getHours() * 60 + time.getMinutes();
		return minutes - this.getStartScheduleMinutes();
	}

	private getStartScheduleMinutes() {
		return this.maxScheduleHours[0] * this.MINUTES_PER_HOUR;
	}

	// endregion

	// region Start

	calculateStart(left: number, day: Date): Date {
		const intervals = this.getIntervalsNumberFromDimensionValue(left);
		const minutes = this.getRelativeMinutesFromIntervals(intervals);
		return UtilsService.parseTimeFromMinutes(minutes, day);
	}

	private getRelativeMinutesFromIntervals(intervalsNumber: number): number {
		return this.getStartScheduleMinutes() + this.MINUTES_PER_INTERVAL * intervalsNumber;
	}

	// endregion

	// region Duration

	calculateDuration(width: number): number {
		return this.getIntervalsNumberFromWidth(width) * this.MINUTES_PER_INTERVAL;
	}

	calcDuration(cardsGroup: CardsGroup): number {
		return UtilsService.sum(cardsGroup.cards, 'duration');
	}

	private getIntervalsNumberFromWidth(width: number) {
		return Math.round(width / this.intervalWidth);
	}

	getIntervalsNumberFromDimensionValue(value: number) {
		return Math.round(value / this.intervalWidth);
	}

	// endregion

}
