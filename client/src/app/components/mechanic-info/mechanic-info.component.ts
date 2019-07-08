import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DaysService} from "../../services/days.service";
import {CardsService} from "../../services/cards.service";

@Component({
	selector: 'app-mechanic-info',
	templateUrl: './mechanic-info.component.html',
	styleUrls: ['./mechanic-info.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicInfoComponent implements AfterViewInit {

	@Input() mechanic: string;

	constructor(
		private daysService: DaysService,
		private cardsService: CardsService
	) {
	}

	ngAfterViewInit() {
	}

	test(): void {
		console.log('clicked in mechanic info container');
		// this.cardsService.addCard();
	}

	check() {
		console.log('checking mechanic info')
	}

	get oneDayMode$() {
		return this.daysService.oneDayMode$;
	}

}
