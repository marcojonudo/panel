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
	private _highlightedSkills: Skill[];
	private _appointmentTypes: AppointmentType[];

	private skillsSubject: Subject<Skill[]>;
	private _skills$: Observable<Skill[]>;

	constructor() {
		this.highlightedSkills = [
			new Skill({name: 'Montaje', code: 'N', backgroundColor: '#008000', color: '#FFFFFF'}),
			new Skill({name: 'Convergencia', code: 'AL', backgroundColor: '#FF0000', color: '#FFFFFF'}),
			new Skill({name: 'Aceite', code: 'AC', backgroundColor: '#FFFF00', color: '#000000'}),
			new Skill({name: 'Pastillas/discos/líq. frenos', code: 'FR', backgroundColor: '#00BFFF', color: '#000000'}),
			new Skill({name: 'Amortiguadores', code: 'AM', backgroundColor: '#0000FF', color: '#FFFFFF'}),
			new Skill({name: 'Correas distribución', code: 'DIS', backgroundColor: '#0000FF', color: '#FFFFFF'}),
			new Skill({name: 'Otras op. pesadas', code: 'ENG', backgroundColor: '#0000FF', color: '#FFFFFF'}),
			new Skill({name: 'Aire acondicionado', code: 'AA', backgroundColor: '#000000', color: '#FFFFFF'})
		];

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

	get highlightedSkills(): Skill[] {
		return this._highlightedSkills;
	}

	set highlightedSkills(value: Skill[]) {
		this._highlightedSkills = value;
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

	emitSkills(skills: Skill[]): void {
		this.skillsSubject.next(skills);
	}

	findAppointmentType(code: string): AppointmentType {
		return this.appointmentTypes.find(appointmentType => appointmentType.code == code);
	}

}
