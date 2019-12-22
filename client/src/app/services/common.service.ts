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
	private _appointmentTypes: AppointmentType[];

	private skillsSubject: Subject<Skill[]>;
	private _skills$: Observable<Skill[]>;

	constructor() {
		this.skillsSubject = new Subject<Skill[]>();
		this.skills$ = this.skillsSubject.asObservable();
	}

	// region Init

	init(jobLineTypes: JobLineType[], appointmentTypes: AppointmentType[]): void {
		this.jobLineTypes = jobLineTypes;
		this.appointmentTypes = appointmentTypes;
		console.log('Job line types', this.jobLineTypes);
		console.log('Appointment types', this.appointmentTypes);
	}

	// endregion

	// region Getters / setters

	get jobLineTypes(): JobLineType[] {
		return this._jobLineTypes;
	}

	set jobLineTypes(value: JobLineType[]) {
		this._jobLineTypes = value;
	}

	get skills$(): Observable<Skill[]> {
		return this._skills$;
	}

	set skills$(value: Observable<Skill[]>) {
		this._skills$ = value;
	}

	get appointmentTypes(): AppointmentType[] {
		return this._appointmentTypes;
	}

	set appointmentTypes(value: AppointmentType[]) {
		this._appointmentTypes = value;
	}

	// endregion

	findAppointmentType(code: string): AppointmentType {
		return this.appointmentTypes.find(appointmentType => appointmentType.code == code);
	}

}
