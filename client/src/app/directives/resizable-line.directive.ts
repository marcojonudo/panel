import {ChangeDetectorRef, Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Mechanic} from "../objects/mechanic";
import {DaysService} from "../services/days.service";
import {CardsService} from "../services/cards.service";

@Directive({
  selector: '[appResizableLine]'
})
export class ResizableLineDirective implements OnInit {

	@Input() mechanic: Mechanic;

	private pointerDownListener;
	private pointerMoveListener;
	private pointerUpListener;

	private lastY: number;
	private line: number;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private daysService: DaysService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.pointerDownListener = this.renderer.listen(this.element.nativeElement, 'pointerdown', this.onPointerDown.bind(this));
	}

	onPointerDown(event: PointerEvent): void {
		event.stopPropagation();
		this.lastY = event.clientY;
		this.line = this.mechanic.lines;

		this.pointerMoveListener = this.renderer.listen('document', 'pointermove', this.onPointerMove.bind(this));
		this.pointerUpListener = this.renderer.listen('document', 'pointerup', this.onPointerUp.bind(this));
	}

	onPointerMove(event: PointerEvent): void {
		const diff = event.clientY - this.lastY;
		/* Se actualiza la altura sólo si se arrastra el ratón la distancia de una línea, y nunca se permite reducir
		*  el número de ellas más allá de 2 */
		if (Math.abs(diff) >= this.daysService.lineHeight &&
			!(diff < 0 && this.mechanic.height == this.daysService.lineHeight*2)) {
			const nextLine = this.line + Math.sign(diff);
			const lineGroups = this.cardsService.findLineGroups(this.mechanic.day, this.mechanic.code, nextLine);

			/* Sólo se actualiza la altura si no hay fichas asignadas para la línea */
			if (!lineGroups.length) {
				this.line = this.line + Math.sign(diff);
				this.mechanic.height += this.daysService.lineHeight * Math.sign(diff);
				this.lastY = event.clientY;
				this.cdRef.detectChanges();
			}
		}
	}

	onPointerUp(): void {
		this.pointerMoveListener();
		this.pointerUpListener();

		this.daysService.updateMechanicLines(this.mechanic);
	}

}
