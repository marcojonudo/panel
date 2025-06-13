import {Injectable} from '@angular/core';
import {JobLineType} from "../objects/job-line-type";
import {Mechanic} from "../objects/mechanic";
import {Url} from "../objects/url";
import {HttpClient} from "@angular/common/http";
import {Constants} from "../objects/constants";
import { Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { tap } from 'rxjs/operators';
import { MechanicsService } from './mechanics.service';
import { Mechanic2 } from '../objects/mechanics/mechanic2';

@Injectable({
	providedIn: 'root'
})
export class JobLineTypeService {

	static jobLineTypes: JobLineType[];

	constructor(private http: HttpClient) {}

	// region Init

	static init(jobLineTypes: JobLineType[]): void {
		this.jobLineTypes = jobLineTypes;
		console.log('Job line types', this.jobLineTypes);
	}

	// endregion

	static findJobLineType(code: string): JobLineType {
		return this.jobLineTypes.find((jobLineType: JobLineType) => jobLineType.code == code);
	}

	static findJobLineTypeColor(code: string): string {
		const jobLineType = this.findJobLineType(code);
		return jobLineType ? jobLineType.color : Constants.DEFAULT_JOB_LINE_TYPE_COLOR;
	}

	findJobLineTypes(): Observable<any> {
		const savedJobLineTypes = LocalStorageService.getItem(Constants.LOCAL_STORAGE.JOB_LINE_TYPES);
		return (savedJobLineTypes ? of(savedJobLineTypes) : this.http.get(Url.jobLineTypes())).pipe(
			tap(jobLineTypes => {
				JobLineTypeService.jobLineTypes = jobLineTypes.map(j => new JobLineType(j));
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.JOB_LINE_TYPES, JobLineTypeService.jobLineTypes);
				console.log('Job line types', JobLineTypeService.jobLineTypes);
			})
		);
	}

	updateDbJobLineType(mechanic: Mechanic): void {
		this.http.put(Url.mechanicJobLineType(), mechanic).subscribe();
	}

}
