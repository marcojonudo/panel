import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Draggable, Droppable} from "@shopify/draggable"
import {Card} from "./objects/card";
import {HttpClient} from "@angular/common/http";
import {CardsService} from "./services/cards.service";
import {UtilsService} from "./services/utils.service";
import {DaysService} from "./services/days.service";
import {Mechanic} from "./objects/mechanic";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
	title = 'Panel';

	private _loading: boolean;

	constructor(
		private cdRef: ChangeDetectorRef,
		private daysService: DaysService,
		private cardsService: CardsService,
		private http: HttpClient
	) {
		this.loading = true;
		this.http.get('http://localhost:8083/panel/get')
			.subscribe((data: any) => {
				console.log(data);
				// console.log(Object.keys(data.daysMechanics).map(a => UtilsService.parseDateFromString(a)));
				daysService.init(this.parseDaysMechanics(data.daysMechanics));
				cardsService.init(data.cards.map(card => new Card(card)));
				this.loading = false;
				this.cdRef.detectChanges();
			});
	}

	ngAfterViewInit(): void {
		this.cdRef.detach();
	}

	// region Getters / setters

	get loading(): boolean {
		return this._loading;
	}

	set loading(value: boolean) {
		this._loading = value;
	}

	// endregion

	parseDaysMechanics(daysMechanics: any) {
		let daysMechanicsList = [];
		for (const [dayString, mechanics] of Object.entries(daysMechanics)) {
			const day = UtilsService.parseDateFromString(dayString);
			daysMechanicsList.push(
				{day: day, mechanics: mechanics.map(mechanic =>
						new Mechanic(day, mechanic.panelPosition, mechanic.employee, mechanic.schedule, mechanic.lines)
					)
				}
			);
		}
		return daysMechanicsList;
	}

	check() {
		console.log('checking app component');
	}

}
