import {Injectable} from '@angular/core';
import {Constants} from "../objects/constants";
import {CardsService} from "./cards.service";
import {AppointmentsService} from "./appointments.service";
import {FinishDropzone} from "../objects/dropzone-type/finish-dropzone";
import {AssignedDropzone} from "../objects/dropzone-type/assigned-dropzone";
import {AuxiliaryDropzone} from "../objects/dropzone-type/auxiliary-dropzone";
import {UnassignedDropzone} from "../objects/dropzone-type/unassigned-dropzone";
import {UnassignedFinishedDropzone} from "../objects/dropzone-type/unassigned-finished-dropzone";
import {Dropzone} from "../objects/dropzone-type/dropzone";
import {Mechanic} from "../objects/mechanic";
import {Card} from "../objects/card";
import {ScheduleInterval} from "../objects/schedule-interval";

@Injectable({
	providedIn: 'root'
})
export class DropzoneService {

	private static dropzoneType: { [key: string]: ((...any) => Dropzone) };

	private static _dropzones: Dropzone[];

	// region Getters / setters

	static get dropzones(): Dropzone[] {
		return this._dropzones;
	}

	static set dropzones(value: Dropzone[]) {
		this._dropzones = value;
	}

	// endregion

	static init(
		cardsService: CardsService,
		appointmentsService: AppointmentsService
	) {
		this.dropzoneType = {};
		this.dropzoneType[Constants.DROPZONE_TYPE.ASSIGNED] =
			(mechanic: Mechanic, interval: ScheduleInterval) =>
				new AssignedDropzone(cardsService, appointmentsService, mechanic, interval);
		this.dropzoneType[Constants.DROPZONE_TYPE.UNASSIGNED] =
			(subType: string) => new UnassignedDropzone(cardsService, appointmentsService, subType);
		this.dropzoneType[Constants.DROPZONE_TYPE.UNASSIGNED_FINISHED] =
			(subType: string) => new UnassignedFinishedDropzone(cardsService, appointmentsService, subType);
		this.dropzoneType[Constants.DROPZONE_TYPE.AUXILIARY] =
			(subType: string) => new AuxiliaryDropzone(cardsService, appointmentsService, subType);
		this.dropzoneType[Constants.DROPZONE_TYPE.FINISH] =
			() => new FinishDropzone(cardsService, appointmentsService);

		this.dropzones = [];
	}

	static findDropzoneType(type: string, subType: string, mechanic: Mechanic, interval: ScheduleInterval): Dropzone {
		if (type == Constants.DROPZONE_TYPE.ASSIGNED) {
			return this.dropzoneType[type](mechanic, interval);
		} else {
			return this.dropzoneType[type](subType);
		}
	}

	static addDropzone(dropzone: Dropzone) {
		const existent = this.dropzones.find((d: Dropzone) => {
			if (dropzone.type == Constants.DROPZONE_TYPE.ASSIGNED) {
				return d.interval == dropzone.interval;
			} else {
				return d.type == dropzone.type && d.subType == dropzone.subType
			}
		});
		if (!existent) {
			this.dropzones.push(dropzone);
		}
	}

	static findDropzone(card: Card): Dropzone {
		if (card.mechanicCode) {
			/* Podría haber 2 dropzones para un mismo mecánico (mañana y tarde); no obstante, sólo interesa saber el
			*  tipo para poder ejecutar los métodos asociados, por lo que se obtiene una de ellas */
			return this.dropzones.find((dropzone: Dropzone) =>
				dropzone.mechanic && dropzone.mechanic.code == card.mechanicCode
					&& dropzone.mechanic.day.getTime() == card.day.getTime()
			);
		} else {
			if (card.start == Constants.CARD_STATUS.FINISHED) {
				return this.dropzones.find((dropzone: Dropzone) =>
					dropzone.type == Constants.DROPZONE_TYPE.UNASSIGNED_FINISHED
				)
			} else if (card.type == Constants.CARD_TYPE.AUXILIARY) {
				return this.dropzones.find((dropzone: Dropzone) =>
					dropzone.type == Constants.DROPZONE_TYPE.AUXILIARY
				)
			} else {
				return this.dropzones.find((dropzone: Dropzone) =>
					dropzone.type == Constants.DROPZONE_TYPE.UNASSIGNED
				)
			}
		}
	}

}
