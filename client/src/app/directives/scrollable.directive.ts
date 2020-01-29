import {AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";
import {CardPositionService} from "../services/card-position.service";
import {NotificationService} from "../services/notification.service";

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

	private pointerMoveListener: any;

	private dragging: boolean;

	private updateScrollTop: boolean;
	private updateScrollLeft: boolean;

	private scrollTop: number;
	private scrollLeft: number;
	private lastScrollTop: number;
	private lastScrollLeft: number;

	constructor(
		private cardPositionService: CardPositionService,
		private element: ElementRef,
		private renderer: Renderer2
	) {
		this.scrollZoneSize = 50;
		this.step = 10;

		this.scrollTop = 0;
		this.scrollLeft = 0;
		this.lastScrollTop = 0;
		this.lastScrollLeft = 0;

		this.dragging = false;

		this.updateScrollTop = true;
		this.updateScrollTop = true;
	}

	ngOnInit() {
		NotificationService.dragging$.subscribe(dragging => {
			if (dragging) {
				if (!this.top) {
					this.setPositionValues(this.element.nativeElement.getBoundingClientRect());
				}
				this.dragging = true;
				this.lastScrollTop = this.scrollTop;
				this.lastScrollLeft = this.scrollLeft;
				CardPositionService.initialScrollTop = this.scrollTop;
				CardPositionService.initialScrollLeft = this.scrollLeft;
				this.pointerMoveListener = this.renderer.listen(this.element.nativeElement, 'pointermove', this.onPointerMove.bind(this));
			} else {
				this.dragging = false;
				CardPositionService.relativeScrollTop = 0;
				CardPositionService.relativeScrollLeft = 0;
				if (this.pointerMoveListener) {
					this.pointerMoveListener();
				}
			}
		});
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

	setScrollLeft(scrollLeft: number) {
		console.log(1, scrollLeft);
		this.updateScrollLeft = true;
		this.renderer.setProperty(
			this.element.nativeElement,
			Constants.PROPERTY.SCROLL_LEFT,
			scrollLeft
		);
	}

	setScrollTop(scrollTop: number) {
		this.updateScrollTop = true;
		this.renderer.setProperty(
			this.element.nativeElement,
			Constants.PROPERTY.SCROLL_TOP,
			scrollTop
		);
	}

	@HostListener('scroll', ['$event'])
	onScroll(event): void {
		if (this.dragging) {
			if (this.updateScrollLeft) {
				this.setPositionScrollLeft(event.target.scrollLeft, true);
				this.updateScrollLeft = false;
			}
			if (this.updateScrollTop) {
				this.setPositionScrollTop(event.target.scrollTop, true);
				this.updateScrollTop = false;
			}
		} else {
			this.setPositionScrollLeft(event.target.scrollLeft, false);
			this.setPositionScrollTop(event.target.scrollTop, false);
		}
	}

	setPositionScrollLeft(scrollLeft: number, setRelative: boolean) {
		console.log(1, scrollLeft);
		this.scrollLeft = scrollLeft;
		CardPositionService.scrollLeft = this.scrollLeft;
		if (setRelative) {
			CardPositionService.relativeScrollLeft = this.scrollLeft - this.lastScrollLeft;
		}
	}

	setPositionScrollTop(scrollTop: number, setRelative: boolean) {
		this.scrollTop = scrollTop;
		CardPositionService.scrollTop = this.scrollTop;
		if (setRelative) {
			CardPositionService.relativeScrollTop = this.scrollTop - this.lastScrollTop;
		}
	}

}
