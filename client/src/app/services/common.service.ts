import { Injectable } from '@angular/core';
import {JobLineType} from "../objects/job-line-type";
import {Skill} from "../objects/skill";
import {Observable} from "rxjs/internal/Observable";
import {Subject} from "rxjs/internal/Subject";
import {AppointmentType} from "../objects/appointment-type";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

	private _jobLineTypes: JobLineType[];

	// region Init

	init(jobLineTypes: JobLineType[], appointmentTypes: AppointmentType[]): void {
		this.jobLineTypes = jobLineTypes;
		console.log('Job line types', this.jobLineTypes);
	}

	// endregion

	// region Getters / setters

	get jobLineTypes(): JobLineType[] {
		return this._jobLineTypes;
	}

	set jobLineTypes(value: JobLineType[]) {
		this._jobLineTypes = value;
	}

	// endregion

}
