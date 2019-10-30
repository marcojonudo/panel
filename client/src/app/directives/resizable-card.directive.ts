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

	private updatedCards: Card[];
	private lastX: number;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private cdRef: ChangeDetectorRef,
		private cardsService: CardsService,
		private timeService: TimeService
	) {
		this.updatedCards = []
	}

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
			this.updatedCards = this.updatedCards.concat(this.cardsService.handleCardDurationUpdate(
				this.card,
				this.timeService.intervalWidth * Math.sign(diff)
			)).filter((card, i, self) => self.indexOf(card) === i);
			this.lastX = event.clientX;
		}
	}

	onPointerUp(): void {
		this.pointerMoveListener();
		this.pointerUpListener();

		this.cardsService.updateCardsDuration(this.updatedCards);
	}

}

