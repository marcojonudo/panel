import {ChangeDetectorRef, Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Card} from "../objects/card";
import {TimeService} from "../services/time.service";
import {CardsService} from "../services/cards.service";

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective implements OnInit {

	@Input() card: Card;

	private pointerDownListener;
	private pointerMoveListener;
	private pointerUpListener;

	private startWidth: number;
	private lastX: number;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private cdRef: ChangeDetectorRef,
		private cardsService: CardsService,
		private timeService: TimeService
	) { }

	ngOnInit(): void {
		this.pointerDownListener = this.renderer.listen(this.element.nativeElement, 'pointerdown', this.onPointerDown.bind(this));
	}

	onPointerDown(event: PointerEvent): void {
		event.stopPropagation();
		this.cdRef.detectChanges();
		this.startWidth = this.card.width;
		this.lastX = event.clientX;

		this.pointerMoveListener = this.renderer.listen('document', 'pointermove', this.onPointerMove.bind(this));
		this.pointerUpListener = this.renderer.listen('document', 'pointerup', this.onPointerUp.bind(this));
	}

	onPointerMove(event: PointerEvent): void {
		this.card.width += event.clientX - this.lastX;
		this.cdRef.detectChanges();

		this.lastX = event.clientX;
	}

	onPointerUp(): void {
		this.pointerMoveListener();
		this.pointerUpListener();

		this.cardsService.updateCardDuration(
			this.card,
			this.timeService.intervalWidth * Math.round(this.card.width/this.timeService.intervalWidth)
		);

		this.cdRef.detectChanges();
	}

}
