import { Injectable } from '@angular/core';
import {JobLineType} from "../objects/job-line-type";
import {Skill} from "../objects/skill";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

	private _jobLineTypes: JobLineType[];
	private _highlightedSkills: Skill[];

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
	}

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

	get highlightedSkills(): Skill[] {
		return this._highlightedSkills;
	}

	set highlightedSkills(value: Skill[]) {
		this._highlightedSkills = value;
	}

	// endregion

}
