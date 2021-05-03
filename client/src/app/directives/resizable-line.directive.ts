import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Mechanic} from "../objects/mechanic";
import {CardsService} from "../services/cards.service";
import {MechanicsService} from "../services/mechanics.service";
import {DimensionsService} from "../services/dimensions.service";
import {NotificationService} from "../services/notification.service";
import {DropzoneUpdate} from "../objects/trigger-cd/update-objects/mechanic-line/dropzone-update";

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
		private mechanicsService: MechanicsService
	) {}

	ngOnInit(): void {
		this.pointerDownListener = this.renderer.listen(this.element.nativeElement, 'pointerdown', this.onPointerDown.bind(this));
	}

	onPointerDown(event: PointerEvent): void {
		event.stopPropagation();
		this.lastY = event.clientY;
		this.line = this.mechanic.mechanicPanelInfo.lines;

		this.pointerMoveListener = this.renderer.listen('document', 'pointermove', this.onPointerMove.bind(this));
		this.pointerUpListener = this.renderer.listen('document', 'pointerup', this.onPointerUp.bind(this));
	}

	onPointerMove(event: PointerEvent): void {
		const diff = event.clientY - this.lastY;
		/* Se actualiza la altura sólo si se arrastra el ratón la distancia de una línea, y nunca se permite reducir
		*  el número de ellas más allá de 2 */
		if (Math.abs(diff) >= DimensionsService.lineHeight &&
			!(diff < 0 && this.mechanic.height == DimensionsService.lineHeight*2)) {
			const nextLine = this.line + Math.sign(diff);
			const lineGroups = CardsService.findLineGroups(this.mechanic.day, this.mechanic.code, nextLine);

			/* Sólo se actualiza la altura si no hay fichas asignadas para la línea */
			if (!lineGroups.length) {
				this.line = this.line + Math.sign(diff);
				MechanicsService.updateMechanicLines(this.mechanic, this.line);
				this.lastY = event.clientY;
			}
		}
	}

	onPointerUp(): void {
		this.pointerMoveListener();
		this.pointerUpListener();

		this.mechanicsService.updateDbMechanicLines(this.mechanic);
		NotificationService.notifyMechanicLine(undefined, undefined, true, new DropzoneUpdate());
	}

}
