import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'days'
})
export class DaysPipe implements PipeTransform {

	// TODO Cambiar tipo a day
	transform(days: any[], oneDayMode: boolean): any[] {
		return oneDayMode ? days.slice(0, 1) : days;
	}

}
