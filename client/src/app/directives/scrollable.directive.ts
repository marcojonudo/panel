import {AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";
import {CardPositionService} from "../services/card-position.service";
import {DimensionsService} from "../services/dimensions.service";
import {InitService} from "../services/init.service";
import {NotificationService} from "../services/notification.service";
import {StandardToast} from "../objects/toasts/standard-toast";
import {Scroll} from "../objects/scroll";

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

	private scroll: Scroll;

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

		this.scroll = new Scroll();
	}

	ngOnInit() {
		setTimeout(() => {
			const rect = this.element.nativeElement.getBoundingClientRect();
			this.maxScrollTop = this.element.nativeElement.scrollHeight - rect.height;
			this.setPositionValues(rect);
			this.setScrollTop(CardPositionService.scroll.top);
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
				this.setScrollLeft(this.scroll.left + this.step);
			} else if (event.clientX < this.left) {
				this.setScrollLeft(this.scroll.left - this.step);
			}

			if (event.clientY > this.bottom) {
				this.setScrollTop(this.scroll.top + this.step);
			} else if (event.clientY < this.top) {
				this.setScrollTop(this.scroll.top - this.step);
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
		this.scroll.left = scrollLeft;
		CardPositionService.scroll.left = this.scroll.left;
	}

	setPositionScrollTop(scrollTop: number) {
		this.scroll.top = scrollTop;
		CardPositionService.scroll.top = this.scroll.top;
		if (!DimensionsService.oneDayMode) {
			if (this.scroll.top == 0 && InitService.checkRequestPreviousDaysInitialData()) {
				this.handleMinScrollTop();
			} else if (this.scroll.top == this.maxScrollTop && InitService.checkRequestNextDaysInitialData()) {
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
				if (this.scroll.top == 0) {
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
				if (this.scroll.top == this.maxScrollTop) {
					this.initService.requestNextDaysInitialData();
				}
			},
			this.scrollTopTimeout
		)
	}

}
