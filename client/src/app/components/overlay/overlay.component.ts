import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {CardsGroup} from "../../objects/cards-group";
import {Constants} from "../../objects/constants";
import {Subscription} from "rxjs/internal/Subscription";
import {Coordinates} from "../../objects/coordinates";
import {NotificationService} from "../../services/notification.service";

@Component({
	selector: 'app-overlay',
	templateUrl: './overlay.component.html',
	styleUrls: ['./overlay.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnInit, OnDestroy {

	coordinates: Coordinates;

	private coordinatesSubscription: Subscription;
	private draggingSubscription: Subscription;
	private helperGroupSubscription: Subscription;

	private _helperGroup: CardsGroup;
	dragging: boolean;

	constructor(
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.coordinatesSubscription = NotificationService.coordinates$.subscribe(coordinates => {
			this.coordinates = coordinates;
			this.cdRef.detectChanges();
		});

		/* Permite asignar la clase CSS de transición justo cuando se levanta el ratón, y forzar el último CD una vez
		*  se ha establecido la última posición */
		this.draggingSubscription = NotificationService.dragging$.subscribe(dragging => {
			this.dragging = dragging;
			this.cdRef.detectChanges();
		});

		/* Permite mostrar o eliminar la ficha auxiliar en pantalla */
		this.helperGroupSubscription = NotificationService.helperGroup$.subscribe(helperGroup => {
			this.helperGroup = helperGroup;
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.coordinatesSubscription.unsubscribe();
		this.draggingSubscription.unsubscribe();
		this.helperGroupSubscription.unsubscribe();
	}

	// region Getters / setters

	get helperGroup(): CardsGroup {
		return this._helperGroup;
	}

	set helperGroup(value: CardsGroup) {
		this._helperGroup = value;
	}

	get translateDuration(): number {
		return Constants.VALUE.CARD_MOVEMENT_DURATION;
	}

	get lineDefaultHeight() {
		return Constants.VALUE.LINE_HEIGHT_DEFAULT;
	}

	// endregion

	check(): void {
		if (Constants.CHECK) {
			console.log('checking overlay');
		}
	}

}
