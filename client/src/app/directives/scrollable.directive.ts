import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";
import {CardPositionService} from "../services/card-position.service";

@Directive({
	selector: '[appScrollable]'
})
export class ScrollableDirective implements OnInit {

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
	// private updatedScrollTop: boolean;
	// private updatedScrollLeft: boolean;

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

		// this.updatedScrollTop = false;
		// this.updatedScrollLeft = false;
	}

	ngOnInit() {
		const rect = this.element.nativeElement.getBoundingClientRect();
		this.left = rect.left + this.scrollZoneSize;
		this.right = rect.right - this.scrollZoneSize;
		this.top = rect.top + this.scrollZoneSize;
		this.bottom = rect.bottom - this.scrollZoneSize;

		this.cardPositionService.dragging$.subscribe(dragging => {
			if (dragging) {
				this.dragging = true;
				this.lastScrollTop = this.scrollTop;
				this.lastScrollLeft = this.scrollLeft;
				this.cardPositionService.initialScrollTop = this.scrollTop;
				this.cardPositionService.initialScrollLeft = this.scrollLeft;
				this.pointerMoveListener = this.renderer.listen(this.element.nativeElement, 'pointermove', this.onPointerMove.bind(this));
			} else {
				this.dragging = false;
				// if (this.updatedScrollTop) {
				this.cardPositionService.relativeScrollTop = 0;
					// this.updatedScrollTop = false;
				// }
				// if (this.updatedScrollLeft) {
				// 	console.log('Setting relativeScrollLeft to 0');
				this.cardPositionService.relativeScrollLeft = 0;
					// this.updatedScrollLeft = false
				// }
				if (this.pointerMoveListener) {
					this.pointerMoveListener();
				}
			}
		});
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
				// console.log('Setting LEFT', this.cardPositionService.relativeScrollLeft, this.cardPositionService.relativeScrollTop);
			}
			if (this.updateScrollTop) {
				this.setPositionScrollTop(event.target.scrollTop, true);
				this.updateScrollTop = false;
				// console.log('Setting TOP', this.cardPositionService.relativeScrollLeft, this.cardPositionService.relativeScrollTop);
			}
		} else {
			this.setPositionScrollLeft(event.target.scrollLeft, false);
			this.setPositionScrollTop(event.target.scrollTop, false);
			// console.log('Setting all', this.cardPositionService.relativeScrollLeft, this.cardPositionService.relativeScrollTop);
		}
		// if (this.updateScrollLeft) {
		// 	// const scrollLeft = event.target.scrollLeft;
		// 	this.setPositionScrollLeft(event.target.scrollLeft);
		//
		// 	// console.log('scroll', scrollLeft, this.lastScrollLeft, scrollLeft - this.lastScrollLeft);
		// 	// this.cardPositionService.scrollLeft = scrollLeft;
		// 	// this.cardPositionService.relativeScrollLeft = scrollLeft - this.lastScrollLeft;
		// 	// this.scrollLeft = scrollLeft;
		//
		// 	this.updateScrollLeft = false;
		// }
		// if (this.updateScrollTop) {
		// 	const scrollTop = event.target.scrollTop;
		//
		// 	this.cardPositionService.relativeScrollTop = scrollTop - this.lastScrollTop;
		// 	this.scrollTop = scrollTop;
		//
		// 	this.updateScrollTop = false;
		// }
	}

	setPositionScrollLeft(scrollLeft: number, setRelative: boolean) {
		this.scrollLeft = scrollLeft;
		this.cardPositionService.scrollLeft = this.scrollLeft;
		if (setRelative) {
			this.cardPositionService.relativeScrollLeft = this.scrollLeft - this.lastScrollLeft;
		}
	}

	setPositionScrollTop(scrollTop: number, setRelative: boolean) {
		this.scrollTop = scrollTop;
		this.cardPositionService.scrollTop = this.scrollTop - this.lastScrollTop;
		if (setRelative) {
			this.cardPositionService.relativeScrollTop = this.scrollTop - this.lastScrollTop;
		}
	}

}
