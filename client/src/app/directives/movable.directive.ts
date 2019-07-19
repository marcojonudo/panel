import {AfterViewInit, ChangeDetectorRef, Directive, HostBinding, OnDestroy} from '@angular/core';
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {Coordinates} from "../objects/coordinates";
import {CardPositionService} from "../services/card-position.service";
import {Subscription} from "rxjs/internal/Subscription";

@Directive({
	selector: '[appMovable]',
	exportAs: 'appMovable'
})
export class MovableDirective implements AfterViewInit, OnDestroy {

	@HostBinding('class.dragging') dragging: boolean;

	private position: Coordinates;
	private coordinatesSubscription: Subscription;

	// @HostBinding('class.draggable') draggable: boolean;
	// @HostBinding('class.dragging') dragging: boolean;

	// TODO Evaluar si meter esto en en el overlay o aquí. Hacineod el detectChanges sólo aquí, no pilla la transición final
	@HostBinding('style.transform') get transform(): SafeStyle {
		return this.sanitizer.bypassSecurityTrustStyle(
			`translateX(${this.position.x}px) translateY(${this.position.y}px)`
		);
	}

	constructor(
		private cardPositionService: CardPositionService,
		private sanitizer: DomSanitizer,
		private cdRef: ChangeDetectorRef
	) {
		this.dragging = true;
		this.position = new Coordinates(0, 0);
	}

	ngAfterViewInit() {
		this.coordinatesSubscription = this.cardPositionService.coordinates$.subscribe(coordinates => {
			this.position = coordinates;
			// this.cdRef.detectChanges();
		});
	}

	ngOnDestroy() {
		this.coordinatesSubscription.unsubscribe();
	}

}
