import {ChangeDetectorRef, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {Card} from "../objects/card";
import {CardsService} from "../services/cards.service";
import {TimeService} from "../services/time.service";

@Directive({
  selector: '[appResizableCard]'
})
export class ResizableCardDirective {

	@Input() card: Card;

	private pointerDownListener;
	private pointerMoveListener;
	private pointerUpListener;

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
		this.lastX = event.clientX;

		this.pointerMoveListener = this.renderer.listen('document', 'pointermove', this.onPointerMove.bind(this));
		this.pointerUpListener = this.renderer.listen('document', 'pointerup', this.onPointerUp.bind(this));
	}

	onPointerMove(event: PointerEvent): void {
		const diff = event.clientX - this.lastX;
		if (Math.abs(diff) >= this.timeService.intervalWidth &&
			!(diff < 0 && this.card.width == this.timeService.intervalWidth)) {
			this.card.width += this.timeService.intervalWidth * Math.sign(diff);
			this.lastX = event.clientX;
			this.cdRef.detectChanges();
		}
	}

	onPointerUp(): void {
		this.pointerMoveListener();
		this.pointerUpListener();

		this.cardsService.updateCardDuration(this.card, this.card.width);
	}

}

