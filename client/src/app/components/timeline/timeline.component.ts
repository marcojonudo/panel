import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {HourQuarter} from "../../objects/hour-quarter";
import {CardsService} from "../../services/cards.service";
import {Dayjs} from "dayjs";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnInit {

	@Input() day: Dayjs;
	@Input() maxScheduleHoursQuarter: HourQuarter[];
	@Input() saturatedQuarters: HourQuarter[];
	@Input() maxScheduleWidth: number;

	private readonly MAX_SCHEDULE_WIDTH_THRESHOLD: number = 3500;

	ngOnInit() {
		this.saturatedQuarters = CardsService.buildDaySaturation(this.day);
	}

	checkHighlightQuarter(
		hour: number,
		quarter: number,
		saturatedQuarters: HourQuarter[] = this.saturatedQuarters
	): boolean {
		return saturatedQuarters.find((q: HourQuarter) => q.hour == hour && q.quarter == quarter) != undefined
	}

	checkDisplayHours(quarter: number): boolean {
		return quarter == 0;
	}

	checkDisplayMinutes(): boolean {
		return this.maxScheduleWidth > this.MAX_SCHEDULE_WIDTH_THRESHOLD;
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking timeline', this.maxScheduleHoursQuarter);
		}
	}

}
