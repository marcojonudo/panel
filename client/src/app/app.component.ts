import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Draggable, Droppable} from "@shopify/draggable"
import {Card} from "./objects/card";
import {HttpClient} from "@angular/common/http";
import {CardsService} from "./services/cards.service";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {LoadingService} from "./services/loading.service";

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
		private cardsService: CardsService,
		private http: HttpClient
	) {
		this.loading = true;
		this.http.get('http://localhost:8083/panel/get')
			.subscribe((data: any) => {
				const cards = data.cards.map(card => {
					return new Card(card);
				});
				cardsService.init(cards);
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

	check() {
		console.log('checking app component');
	}

}
