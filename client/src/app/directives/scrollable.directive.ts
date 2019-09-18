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

	private scrollTop: number;
	private scrollLeft: number;

	private lastScrollTop: number;

	constructor(
		private cardPositionService: CardPositionService,
		private element: ElementRef,
		private renderer: Renderer2
	) {
		this.scrollZoneSize = 50;
		this.step = 5;

		this.scrollTop = 0;
		this.scrollLeft = 0;
	}

	ngOnInit() {
		const rect = this.element.nativeElement.getBoundingClientRect();
		this.left = rect.left + this.scrollZoneSize;
		this.right = rect.right - this.scrollZoneSize;
		this.top = rect.top + this.scrollZoneSize;
		this.bottom = rect.bottom - this.scrollZoneSize;

		this.cardPositionService.dragging$.subscribe(dragging => {
			if (dragging) {
				this.lastScrollTop = this.scrollTop;
				this.pointerMoveListener = this.renderer.listen(this.element.nativeElement, 'pointermove', this.onPointerMove.bind(this));
			} else {
				this.cardPositionService.relativeScrollTop = 0;
				if (this.pointerMoveListener) {
					this.pointerMoveListener();
				}
			}
		});
	}

	onPointerMove(event: PointerEvent): void {
		if (event.clientX > this.right) {
			if (this.scrollLeft <= this.cardPositionService.scrollLeft) {
				this.scrollLeft += this.step;
				this.setScrollLeft(this.cardPositionService.scrollLeft);
			}
		} else if (event.clientX < this.left) {
			if (this.scrollLeft >= this.cardPositionService.scrollLeft) {
				this.scrollLeft -= this.step;
				this.setScrollLeft(this.cardPositionService.scrollLeft);
			}
		}

		if (event.clientY > this.bottom) {
			this.setScrollTop(this.scrollTop + this.step);
		} else if (event.clientY < this.top) {
			this.setScrollTop(this.scrollTop - this.step);
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
		const scrollTop = event.target.scrollTop;
		this.cardPositionService.scrollLeft = event.target.scrollLeft;
		this.cardPositionService.relativeScrollTop = scrollTop - this.lastScrollTop;
		this.scrollTop = scrollTop;
	}

}
