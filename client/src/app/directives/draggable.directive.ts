import {
	AfterViewChecked,
	ChangeDetectorRef,
	Directive,
	ElementRef, EventEmitter,
	HostBinding,
	Input,
	OnInit, Output,
	Renderer2,
} from '@angular/core';
import {Coordinates} from "../objects/coordinates";
import {CardPositionService} from "../services/card-position.service";
import {TimeService} from "../services/time.service";
import {Card} from "../objects/card";
import {DropzoneInfo} from "../objects/dropzone-info";
import {CardsGroup} from "../objects/cards-group";
import {CardsService} from "../services/cards.service";

@Directive({
	selector: '[appDraggable]',
	exportAs: 'appDraggable'
})
export class DraggableDirective implements OnInit, AfterViewChecked {

	// @Input() card: Card;
	@Input() cardsGroup: CardsGroup;
	@Output() hiddenCardsGroup: EventEmitter<CardsGroup>;

	private cardRect;

	private startPosition: Coordinates;
	private startEventCoordinates: Coordinates;
	private position: Coordinates;

	private pointerDownListener;
	private pointerMoveListener;
	private pointerUpListener;

	@HostBinding('class.hidden')
	dragging: boolean;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private timeService: TimeService,
		private cdRef: ChangeDetectorRef
	) {
		this.dragging = false;
		this.hiddenCardsGroup = new EventEmitter();

		this.position = new Coordinates(0, 0);
	}

	ngOnInit() {
		this.pointerDownListener = this.renderer.listen(this.element.nativeElement, 'pointerdown', this.onPointerDown.bind(this));
	}

	ngAfterViewChecked(): void {
		this.cardRect = this.element.nativeElement.getBoundingClientRect();
	}

	onPointerDown(event: PointerEvent): void {
		// console.time('onPointerDown');
		this.dragging = true;
		/* Permite asignar la clase declarada mediante @HostBinding */
		this.cdRef.detectChanges();
		this.hiddenCardsGroup.emit(this.cardsGroup);

		this.startPosition = new Coordinates(this.cardRect.left, this.cardRect.top);
		this.position = new Coordinates(this.cardRect.left, this.cardRect.top);
		this.cardPositionService.emitPosition(this.startPosition);

		this.startEventCoordinates = new Coordinates(event.clientX, event.clientY);
		this.cardPositionService.emitHelperCardsGroup(this.cardsGroup);
		this.cardPositionService.emitDragging(true);

		this.pointerMoveListener = this.renderer.listen('document', 'pointermove', this.onPointerMove.bind(this));
		this.pointerUpListener = this.renderer.listen('document', 'pointerup', this.onPointerUp.bind(this));
		// console.timeEnd('onPointerDown');
	}

	onPointerMove(event: PointerEvent): void {
		if (this.dragging) {
			this.position.x = this.startPosition.x + event.clientX - this.startEventCoordinates.x;
			this.position.y = this.startPosition.y + event.clientY - this.startEventCoordinates.y;
			this.cardPositionService.emitPosition(this.position);
		}
	}

	onPointerUp(): void {
		// console.time('onPointerUp');
		this.dragging = false;
		this.cdRef.detectChanges();
		this.hiddenCardsGroup.emit(undefined);

		/* Si emitHelperCard es true, se emite el evento inmediatamente en lugar de al terminar la transición en
		*  overlay. Significa que la ficha se soltó en la barra inferior */
		let emitHelperCard = this.handleDestinyPosition();
		this.cardPositionService.emitPosition(this.position);

		/* Evento emitido para forzar una última vez el CD, una vez establecida la nueva posición, y eliminar la ficha
		 * de su posición de origen.
		 * Debe ir antes de la emisión de la helper card, para evitar parpadeos en las fichas al añadirlas en el destino
		 * antes de eliminarlas del origen, de ahí el uso de la variable emitHelperCardsGroup (sólo para el caso de arrastrar
		 * la ficha a la bandeja desde una línea */
		this.cardPositionService.emitDragging(this.dragging);
		if (emitHelperCard) {
			this.cardPositionService.emitHelperCardsGroup(undefined);
		}

		this.pointerMoveListener();
		this.pointerUpListener();
		// console.timeEnd('onPointerUp');
	}

	private handleDestinyPosition(): boolean {
		let emitHelperCard = false;

		/* Si la ficha se suelta encima de una línea o bandeja inferior (y no en un hueco vacío o sin haber salido
		 * de la dropzone) */
		if (this.cardPositionService.dropzone) {
			/* Si se suelta en otra dropzone */
			if (this.cardPositionService.dropzone.mechanic) {
				const mechanic = this.cardPositionService.dropzone.mechanic;
				this.position = this.cardPositionService.handleLinePosition(
					this.position,
					this.timeService.intervalWidth,
					this.cardsService.getAssignedCards(mechanic.day, mechanic.position)
				);
				/* Si la posición se devuelve a null, significa que no se cumplen los requisitos para depositar la
				 * ficha: básicamente, que no cabe en el hueco (el horario es más pequeño, al desplazar las solapadas
				 * no caben...) */
				if (!this.position) {
					console.log('A LA MIERDA!!!');
					this.handleReturnStartPosition();
				}
			} else if (this.cardsGroup.cards[0].mechanicCode) { /* Si se suelta una ficha asignada en la bandeja inferior */
				emitHelperCard = true;
			} else { /* Si se suelta en la bandeja inferior sin haber salido de la misma */
				this.handleReturnStartPosition();
			}
		} else {
			/* Si se suelta la ficha en un hueco vacío */
			this.handleReturnStartPosition();
		}

		return emitHelperCard;
	}

	private handleReturnStartPosition(): void {
		this.position = this.startPosition;
		this.cardPositionService.dropzone = undefined;
	}

}
