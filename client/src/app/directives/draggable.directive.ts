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
import {Card} from "../objects/card";
import {CardsGroup} from "../objects/cards-group";
import {CardsService} from "../services/cards.service";
import {Constants} from "../objects/constants";

@Directive({
	selector: '[appDraggable]',
	exportAs: 'appDraggable'
})
export class DraggableDirective implements OnInit, AfterViewChecked {

	private readonly AVOID_DRAG_ID: string = 'link-handler';

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
		private cdRef: ChangeDetectorRef
	) {
		this.dragging = false;
		this.hiddenCardsGroup = new EventEmitter();

		this.position = new Coordinates(0, 0);
	}

	ngOnInit() {
		this.pointerDownListener = this.renderer.listen(
			this.element.nativeElement,
			'pointerdown', this.onPointerDown.bind(this)
		);

		/* Temporizador usado al desplazar una ficha. Cuando se crea un grupo en una línea, se debe esperar a que
		*  termine la transición para mostrarla. Si no, aparecería un duplicado de la ficha (la recién creada en las
		*  listas de fichas) mientras la helper termina la transición */
		// setTimeout(
		// 	() => {
		// 		this.hiddenCardsGroup.emit(undefined)
		// 	},
		// 		Constants.VALUE.CARD_MOVEMENT_DURATION
		// );
	}

	ngAfterViewChecked(): void {
		this.cardRect = this.element.nativeElement.getBoundingClientRect();
	}

	onPointerDown(event: PointerEvent): void {
		if (!(<HTMLElement> event.target).id.includes(this.AVOID_DRAG_ID)) {
			this.dragging = true;
			/* Se emite el grupo arrastrado, para poder asignarle la clase hidden, que lo ubica detrás de las líneas
			*  mientras se mueve el auxiliar */
			this.hiddenCardsGroup.emit(this.cardsGroup);

			this.startPosition = new Coordinates(this.cardRect.left, this.cardRect.top);
			this.position = new Coordinates(this.cardRect.left, this.cardRect.top);
			this.cardPositionService.emitPosition(this.startPosition);

			this.startEventCoordinates = new Coordinates(event.clientX, event.clientY);
			/* Se envía el grupo para mostrar el helper en el overlay */
			this.cardPositionService.emitHelperCardsGroup(this.cardsGroup);
			/* Permite asignar o eliminar la clase que añade una transición al helper, para desplazarse a la posicíon
			*  final */
			this.cardPositionService.emitDragging(true);

			this.pointerMoveListener = this.renderer.listen('document', 'pointermove', this.onPointerMove.bind(this));
			this.pointerUpListener = this.renderer.listen('document', 'pointerup', this.onPointerUp.bind(this));
		}
	}

	onPointerMove(event: PointerEvent): void {
		if (this.dragging) {
			this.position.x = this.startPosition.x + event.clientX - this.startEventCoordinates.x;
			this.position.y = this.startPosition.y + event.clientY - this.startEventCoordinates.y;
			this.cardPositionService.emitPosition(this.position);
		}
	}

	onPointerUp(): void {
		this.dragging = false;
		this.cdRef.detectChanges();

		/* Si emitHelperCard es true, se emite el evento inmediatamente en lugar de al terminar la transición en
		*  overlay. Significa que la ficha se soltó en la barra inferior */
		const position = this.cardPositionService.handleDestinyPosition(this.position, this.startPosition);
		if (position) {
			this.position = position;

			/* Se emite la última posición ya redondeada */
			this.cardPositionService.emitPosition(this.position);

			/* Evento emitido para forzar una última vez el CD, una vez establecida la nueva posición, y eliminar la ficha
			 * de su posición de origen */
			this.cardPositionService.emitDragging(this.dragging);
		} else {
			this.cardPositionService.emitDragging(this.dragging);
			this.cardPositionService.emitHelperCardsGroup(undefined);
		}

		this.pointerMoveListener();
		this.pointerUpListener();

		// TODO Revisar hiddenGroup y comprobar si hace falta emitter
		this.cardPositionService.hiddenGroup = undefined;
		this.cardPositionService.originDropzone = undefined;
	}

}
