import { Injectable } from '@angular/core';
import {JobLineType} from "../objects/job-line-type";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

	private _jobLineTypes: JobLineType[];

	// region Init

	init(jobLineTypes: any[]): void {
		this.jobLineTypes = jobLineTypes.map(jobLineType => new JobLineType(jobLineType));
		console.log('Job line types', this.jobLineTypes);
	}

	// endregion

	// Getters / setters

	get jobLineTypes(): JobLineType[] {
		return this._jobLineTypes;
	}

	set jobLineTypes(value: JobLineType[]) {
		this._jobLineTypes = value;
	}

	// endregion

}
