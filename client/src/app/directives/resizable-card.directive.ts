import {ChangeDetectorRef, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {Card} from "../objects/card";
import {CardsService} from "../services/cards.service";
import {DimensionsService} from "../services/dimensions.service";
import {MechanicsService} from "../services/mechanics.service";
import {CardDurationHandler} from "../objects/card-duration/card-duration-handler";
import {AssignedCardDurationHandler} from "../objects/card-duration/assigned-card-duration-handler";
import {UnassignedCardDurationHandler} from "../objects/card-duration/unassigned-card-duration-handler";

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

	private handler: CardDurationHandler;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private cdRef: ChangeDetectorRef,
		private cardsService: CardsService
	) {
		this.updatedCards = []
	}

	ngOnInit(): void {
		this.pointerDownListener = this.renderer.listen(this.element.nativeElement, 'pointerdown', this.onPointerDown.bind(this));
		this.handler = this.card.day ? new AssignedCardDurationHandler() : new UnassignedCardDurationHandler();
	}

	onPointerDown(event: PointerEvent): void {
		event.stopPropagation();
		this.lastX = event.clientX;

		this.pointerMoveListener = this.renderer.listen('document', 'pointermove', this.onPointerMove.bind(this));
		this.pointerUpListener = this.renderer.listen('document', 'pointerup', this.onPointerUp.bind(this));
	}

	onPointerMove(event: PointerEvent): void {
		const diff = event.clientX - this.lastX;
		if (Math.abs(diff) >= DimensionsService.intervalWidth &&
			!(diff < 0 && this.card.width == DimensionsService.intervalWidth)) {
			this.updatedCards = this.updatedCards.concat(
				CardsService.handleCardDurationUpdate(
					this.card,
					DimensionsService.intervalWidth * Math.sign(diff),
					this.card.day ? MechanicsService.findMechanic(this.card.day, this.card.mechanicCode) : undefined,
					this.handler
				)
			).filter((card, i, self) => self.indexOf(card) === i);
			this.lastX = event.clientX;
		}
	}

	onPointerUp(): void {
		this.pointerMoveListener();
		this.pointerUpListener();

		this.cardsService.updateDbCardsDuration(this.updatedCards);
	}

}

