import {Pipe, PipeTransform} from '@angular/core';
import {Dayjs} from "dayjs";

@Pipe({
	name: 'days'
})
export class DaysPipe implements PipeTransform {

	transform(days: Dayjs[], oneDayMode: boolean): Dayjs[] {
		return oneDayMode ? days.slice(0, 1) : days;
	}

}
