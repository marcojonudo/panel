import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Constants} from "./objects/constants";
import {NotificationService} from "./services/notification.service";
import {Subscription} from "rxjs/internal/Subscription";
import {InitService} from "./services/init.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
	title = 'Panel';

	private _loading: boolean;
	private loadingSubscription: Subscription;

	constructor(
		private cdRef: ChangeDetectorRef,
		private initService: InitService
	) {
		this.loading = true;
		this.initService.loadInitialData();
	}

	ngOnInit(): void {
		this.loadingSubscription = NotificationService.loading$.subscribe((loading: boolean) => {
			this.loading = loading;
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
		if (Constants.CHECK) {
			console.log('checking app component');
		}
	}

}
