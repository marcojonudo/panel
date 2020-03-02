import {Injectable} from '@angular/core';
import {DimensionsService} from "./dimensions.service";
import {CardPositionService} from "./card-position.service";
import {UtilsService} from "./utils.service";

@Injectable({
	providedIn: 'root'
})
export class DragSchedulesService {

	static calcQuarterEndLeft(left: number): number {
		const quarterStartLeft = UtilsService.roundFloor(left, DimensionsService.intervalWidth * 3);
		return quarterStartLeft + DimensionsService.intervalWidth * 3;
	}

	static calcQuarterThresholdsStart(quarterStartLeft: number, quarterEndLeft: number, day: Date): Date[] {
		return [
			DimensionsService.calcStartFromLeft(quarterStartLeft, day),
			DimensionsService.calcStartFromLeft(quarterEndLeft, day)
		];
	}

	static calcMovedQuarters(clientX: number, quarterEndLeft: number): number {
		const left = CardPositionService.absolutePositionToLeft(clientX);
		return Math.ceil((left - quarterEndLeft) / (DimensionsService.intervalWidth * 3));
	}

}
