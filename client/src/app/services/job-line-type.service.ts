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

	private _jobLineTypes: JobLineType[];

	constructor(private http: HttpClient) {}

	// region Init

	init(jobLineTypes: JobLineType[]): void {
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

	findJobLineType(code: string): JobLineType {
		return this.jobLineTypes.find((jobLineType: JobLineType) => jobLineType.code == code);
	}

	findJobLineTypeColor(code: string): string {
		const jobLineType = this.findJobLineType(code);
		return jobLineType ? jobLineType.color : Constants.DEFAULT_JOB_LINE_TYPE_COLOR;
	}

	updateJobLineType(mechanic: Mechanic): void {
		this.http.put(Url.mechanicJobLineType(), [mechanic]).subscribe();
	}

}
