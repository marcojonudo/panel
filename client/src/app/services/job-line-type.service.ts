import {Injectable} from '@angular/core';
import {JobLineType} from "../objects/job-line-type";
import {Mechanic} from "../objects/mechanic";
import {Url} from "../objects/url";
import {HttpClient} from "@angular/common/http";
import {Constants} from "../objects/constants";

@Injectable({
	providedIn: 'root'
})
export class JobLineTypeService {

	private static _jobLineTypes: JobLineType[];

	constructor(private http: HttpClient) {}

	// region Init

	static init(jobLineTypes: JobLineType[]): void {
		this.jobLineTypes = jobLineTypes;
		console.log('Job line types', this.jobLineTypes);
	}

	// endregion

	// region Getters / setters

	static get jobLineTypes(): JobLineType[] {
		return this._jobLineTypes;
	}

	static set jobLineTypes(value: JobLineType[]) {
		this._jobLineTypes = value;
	}

	// endregion

	static findJobLineType(code: string): JobLineType {
		return this.jobLineTypes.find((jobLineType: JobLineType) => jobLineType.code == code);
	}

	static findJobLineTypeColor(code: string): string {
		const jobLineType = this.findJobLineType(code);
		return jobLineType ? jobLineType.color : Constants.DEFAULT_JOB_LINE_TYPE_COLOR;
	}

	updateDbJobLineType(mechanic: Mechanic): void {
		this.http.put(Url.mechanicJobLineType(), mechanic).subscribe();
	}

}
