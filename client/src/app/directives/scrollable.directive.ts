import {AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";
import {CardPositionService} from "../services/card-position.service";
import {DimensionsService} from "../services/dimensions.service";
import {InitService} from "../services/init.service";
import {NotificationService} from "../services/notification.service";
import {WarningToast} from "../objects/toasts/warning-toast";
import {StandardToast} from "../objects/toasts/standard-toast";

@Directive({
	selector: '[appScrollable]'
})
export class ScrollableDirective implements OnInit, AfterViewInit {

	@Input() initialScrollLeft: number;

	private readonly scrollZoneSize: number;
	private readonly step: number;

	private left: number;
	private right: number;
	private top: number;
	private bottom: number;

	private scrollTop: number;
	private scrollLeft: number;

	private maxScrollTop: number;

	private scrollTopTimeout: number;
	private consumingTimeout: boolean;

	private minScrollTimeout: any;
	private maxScrollTimeout: any;

	constructor(
		private initService: InitService,
		private element: ElementRef,
		private renderer: Renderer2
	) {
		this.scrollZoneSize = 50;
		this.step = 30;
		this.scrollTopTimeout = 2000;
		this.consumingTimeout = false;

		this.scrollTop = 0;
		this.scrollLeft = 0;
	}

	ngOnInit() {
		setTimeout(() => {
			const rect = this.element.nativeElement.getBoundingClientRect();
			this.maxScrollTop = this.element.nativeElement.scrollHeight - rect.height;
			this.setPositionValues(rect);
			this.setScrollTop(CardPositionService.scrollTop);
		}, 1);
		this.renderer.listen(
			this.element.nativeElement,
			Constants.EVENT.POINTER_MOVE,
			this.onPointerMove.bind(this)
		);
	}

	ngAfterViewInit(): void {
		this.setScrollLeft(this.initialScrollLeft);
	}

	setPositionValues(rect: any): void {
		this.left = rect.left + this.scrollZoneSize;
		this.right = rect.right - this.scrollZoneSize;
		this.top = rect.top + this.scrollZoneSize;
		this.bottom = rect.bottom - this.scrollZoneSize;
	}

	onPointerMove(event: PointerEvent): void {
		if (CardPositionService.dragging) {
			if (event.clientX > this.right) {
				this.setScrollLeft(this.scrollLeft + this.step);
			} else if (event.clientX < this.left) {
				this.setScrollLeft(this.scrollLeft - this.step);
			}

			if (event.clientY > this.bottom) {
				this.setScrollTop(this.scrollTop + this.step);
			} else if (event.clientY < this.top) {
				this.setScrollTop(this.scrollTop - this.step);
			}
		}
	}

	setScrollLeft(scrollLeft: number) {
		this.renderer.setProperty(
			this.element.nativeElement,
			Constants.PROPERTY.SCROLL_LEFT,
			scrollLeft
		);
	}

	setScrollTop(scrollTop: number) {
		this.renderer.setProperty(
			this.element.nativeElement,
			Constants.PROPERTY.SCROLL_TOP,
			scrollTop
		);
	}

	@HostListener('scroll', ['$event'])
	onScroll(event): void {
		this.setPositionScrollLeft(event.target.scrollLeft);
		this.setPositionScrollTop(event.target.scrollTop);
	}

	setPositionScrollLeft(scrollLeft: number) {
		this.scrollLeft = scrollLeft;
		CardPositionService.scrollLeft = this.scrollLeft;
	}

	setPositionScrollTop(scrollTop: number) {
		this.scrollTop = scrollTop;
		CardPositionService.scrollTop = this.scrollTop;
		if (!DimensionsService.oneDayMode) {
			if (this.scrollTop == 0 && InitService.checkRequestPreviousDaysInitialData()) {
				this.handleMinScrollTop();
			} else if (this.scrollTop == this.maxScrollTop && InitService.checkRequestNextDaysInitialData()) {
				this.handleMaxScrollTop();
			} else if (this.consumingTimeout) {
				NotificationService.notifyToast(undefined);
				clearTimeout(this.minScrollTimeout);
				clearTimeout(this.maxScrollTimeout);
				this.consumingTimeout = false;
			}
		}
	}

	handleMinScrollTop(): void {
		this.consumingTimeout = true;
		NotificationService.notifyToast(new StandardToast(undefined, true, this.scrollTopTimeout));
		this.minScrollTimeout = setTimeout(
			() => {
				this.consumingTimeout = false;
				if (this.scrollTop == 0) {
					this.initService.requestPreviousDaysInitialData();
				}
			},
			this.scrollTopTimeout
		)
	}

	handleMaxScrollTop(): void {
		this.consumingTimeout = true;
		NotificationService.notifyToast(new StandardToast(undefined, true, this.scrollTopTimeout));
		this.maxScrollTimeout = setTimeout(
			() => {
				this.consumingTimeout = false;
				if (this.scrollTop == this.maxScrollTop) {
					this.initService.requestNextDaysInitialData();
				}
			},
			this.scrollTopTimeout
		)
	}

}
