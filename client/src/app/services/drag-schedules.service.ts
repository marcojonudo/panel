import {Injectable} from '@angular/core';
import {DimensionsService} from "./dimensions.service";
import {CardPositionService} from "./card-position.service";
import {UtilsService} from "./utils.service";
import {AppointmentsService} from "./appointments.service";
import {Mechanic} from "../objects/mechanic";
import {Dayjs} from "dayjs";

@Injectable({
	providedIn: 'root'
})
export class DragSchedulesService {

	static checkStartDragging(mechanic: Mechanic, event: PointerEvent): boolean {
		return UtilsService.checkLeftClick(event) && AppointmentsService.dragSchedulesMode && !mechanic.fixed
	}

	static calcQuarterEndLeft(left: number): number {
		const quarterStartLeft = UtilsService.roundFloor(left, DimensionsService.quarterWidth);
		return quarterStartLeft + DimensionsService.quarterWidth;
	}

	static calcQuarterThresholdsStart(quarterStartLeft: number, quarterEndLeft: number, day: Dayjs): Dayjs[] {
		return [
			DimensionsService.calcStartFromLeft(quarterStartLeft, day),
			DimensionsService.calcStartFromLeft(quarterEndLeft, day)
		];
	}

	static calcMovedQuarters(clientX: number, quarterEndLeft: number): number {
		const left = CardPositionService.absolutePositionToLeft(clientX);
		return Math.ceil((left - quarterEndLeft) / (DimensionsService.quarterWidth));
	}

}
