import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {Constants} from "../objects/constants";
import {CardPositionService} from "../services/card-position.service";

@Directive({
	selector: '[appScrollable]'
})
export class ScrollableDirective implements OnInit {

	private left: number;
	private right: number;
	private top: number;
	private bottom: number;

	private pointerMoveListener: any;
	private saveOnScroll: boolean;

	private readonly scrollZoneSize: number;
	private readonly step: number;

	constructor(
		private cardPositionService: CardPositionService,
		private element: ElementRef,
		private renderer: Renderer2
	) {
		this.saveOnScroll = true;

		this.scrollZoneSize = 50;
		this.step = 10;
	}

	ngOnInit() {
		const rect = this.element.nativeElement.getBoundingClientRect();
		this.left = rect.left + this.scrollZoneSize;
		this.right = rect.right - this.scrollZoneSize;
		this.top = rect.top + this.scrollZoneSize;
		this.bottom = rect.bottom - this.scrollZoneSize;

		this.cardPositionService.dragging$.subscribe(dragging => {
			if (dragging) {
				this.saveOnScroll = false;
				this.pointerMoveListener = this.renderer.listen(this.element.nativeElement, 'pointermove', this.onPointerMove.bind(this));
			} else {
				if (this.pointerMoveListener) {
					this.saveOnScroll = true;
					this.pointerMoveListener();
				}
			}
		});
	}

	onPointerMove(event: PointerEvent): void {
		if (event.clientX > this.right) {
			this.cardPositionService.scrollLeft += this.step;
			this.setScrollLeft(this.cardPositionService.scrollLeft);
		} else if (event.clientX < this.left) {
			this.cardPositionService.scrollLeft -= this.step;
			this.setScrollLeft(this.cardPositionService.scrollLeft);
		}

		if (event.clientY > this.bottom) {
			this.cardPositionService.scrollTop += this.step;
			this.setScrollTop(this.cardPositionService.scrollTop);
		} else if (event.clientY < this.top) {
			this.cardPositionService.scrollTop -= this.step;
			this.setScrollTop(this.cardPositionService.scrollTop);
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
		if (this.saveOnScroll) {
			this.cardPositionService.scrollLeft = event.target.scrollLeft;
			this.cardPositionService.scrollTop = event.target.scrollTop;
		}
	}

}
