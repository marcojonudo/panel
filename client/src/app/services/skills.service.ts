import {Injectable} from '@angular/core';
import {Skill} from "../objects/skill";

@Injectable({
	providedIn: 'root'
})
export class SkillsService {

	private static HIGHLIGHTED_SKILLS: Skill[] = [
		new Skill({name: 'Montaje', code: 'N', backgroundColor: '#008000', color: '#FFFFFF'}),
		new Skill({name: 'Convergencia', code: 'AL', backgroundColor: '#FF0000', color: '#FFFFFF'}),
		new Skill({name: 'Aceite', code: 'AC', backgroundColor: '#FFFF00', color: '#000000'}),
		new Skill({name: 'Pastillas/discos/líq. frenos', code: 'FR', backgroundColor: '#00BFFF', color: '#000000'}),
		new Skill({name: 'Amortiguadores', code: 'AM', backgroundColor: '#0000FF', color: '#FFFFFF'}),
		new Skill({name: 'Correas distribución', code: 'DIS', backgroundColor: '#0000FF', color: '#FFFFFF'}),
		new Skill({name: 'Otras op. pesadas', code: 'ENG', backgroundColor: '#0000FF', color: '#FFFFFF'}),
		new Skill({name: 'Aire acondicionado', code: 'AA', backgroundColor: '#000000', color: '#FFFFFF'})
	];

	// region Getters / setters

	static get highlightedSkills(): Skill[] {
		return this.HIGHLIGHTED_SKILLS;
	}

	// endregion

}
