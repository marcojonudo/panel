import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DaysService} from "../../services/days.service";
import {CardsService} from "../../services/cards.service";
import {Constants} from "../../objects/constants";

@Component({
	selector: 'app-mechanic-info',
	templateUrl: './mechanic-info.component.html',
	styleUrls: ['./mechanic-info.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicInfoComponent {

	@Input() mechanic: string;

	constructor(
		private daysService: DaysService
	) {
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking mechanic info')
		}
	}

	get oneDayMode$() {
		return this.daysService.oneDayMode$;
	}

}
