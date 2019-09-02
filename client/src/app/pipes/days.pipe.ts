import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'days'
})
export class DaysPipe implements PipeTransform {

	transform(days: Date[], oneDayMode: boolean): any[] {
		return oneDayMode ? days.slice(0, 1) : days;
	}

}
