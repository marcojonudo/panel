import {
	AfterViewChecked,
	ChangeDetectorRef,
	Directive,
	ElementRef, EventEmitter,
	Input,
	OnInit, Output,
	Renderer2,
} from '@angular/core';
import {Coordinates} from "../objects/coordinates";
import {CardPositionService} from "../services/card-position.service";
import {CardsGroup} from "../objects/cards-group";
import {CardsService} from "../services/cards.service";
import {NotificationService} from "../services/notification.service";
import {Constants} from "../objects/constants";
import {CardTypeBehaviour} from "../objects/card-type-behaviour/card-type-behaviour";

@Directive({
	selector: '[appDraggable]',
	exportAs: 'appDraggable'
})
export class ClickableCardDirective implements OnInit, AfterViewChecked {

	private readonly AVOID_DRAG_ID: string = 'link-handler';

	@Input() cardsGroup: CardsGroup;
	@Input() cardBehaviour: CardTypeBehaviour;
	@Output() hiddenCardsGroup: EventEmitter<CardsGroup>;

	private cardRect;

	private startPosition: Coordinates;
	private startEventCoordinates: Coordinates;
	private position: Coordinates;

	private pointerDownListener: () => void;
	private pointerMoveListener: () => void;
	private pointerUpListener: () => void;
	private contextMenuListener: () => void;

	private init: boolean;

	private LEFT_CLICK_BUTTON_ID: number = 0;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.init = false;
		this.hiddenCardsGroup = new EventEmitter();

		this.position = new Coordinates(0, 0);
	}

	ngOnInit() {
		this.pointerDownListener = this.renderer.listen(
			this.element.nativeElement,
			Constants.EVENT.POINTER_DOWN,
			this.handleClick.bind(this)
		);
		this.contextMenuListener = this.renderer.listen(
			this.element.nativeElement,
			Constants.EVENT.CONTEXT_MENU,
			this.handleRightClick.bind(this)
		);
	}

	ngAfterViewChecked(): void {
		this.cardRect = this.element.nativeElement.getBoundingClientRect();
	}

	private handleRightClick(event: PointerEvent): void {
		event.preventDefault();
		this.cardBehaviour.handleRightClick(this.cardsGroup, new Coordinates(event.clientX, event.clientY));
	}

	handleClick(event: PointerEvent): void {
		/* Sólo se ejecuta una acción si se hace clic con el botón izquierdo. En caso de ser el derecho, se debe omitir
		*  para que se ejecute el listener del evento contextmenu */
		if (this.checkLeftClick(event) && this.checkDragElement((<HTMLElement> event.target).id)) {
			this.handleLeftClick(event);
		}
	}

	private handleLeftClick(event: PointerEvent): void {
		/* Si el modo es DRAG, se llevan a cabo las acciones necesarias para conseguir el desplazamiento del grupo */
		if (this.cardsGroup.mode == Constants.GROUP_MODE.DRAG) {
			this.init = true;
			this.pointerMoveListener = this.renderer.listen(
				Constants.ELEMENT.DOCUMENT,
				Constants.EVENT.POINTER_MOVE,
				this.onPointerMove.bind(this)
			);
			this.pointerUpListener = this.renderer.listen(
				Constants.ELEMENT.DOCUMENT,
				Constants.EVENT.POINTER_UP,
				this.onPointerUp.bind(this)
			);
		} else {
			this.cardBehaviour.handleLeftClick(this.cardsGroup, event.clientX);
		}
	}

	private checkLeftClick(event: PointerEvent): boolean {
		return event.button == this.LEFT_CLICK_BUTTON_ID;
	}

	private checkDragElement(id: string): boolean {
		return !id.includes(this.AVOID_DRAG_ID);
	}

	onPointerMove(event: PointerEvent): void {
		/* Se comprueba si ya se ha hecho el init. Si no es así, se ejecuta sólo en la primera iteración */
		if (this.init) {
			this.initDragging(event);
			this.init = false;
		}
		this.position.x = this.startPosition.x + event.clientX - this.startEventCoordinates.x;
		this.position.y = this.startPosition.y + event.clientY - this.startEventCoordinates.y;
		NotificationService.notifyCoordinates(this.position);
	}

	private initDragging(event: PointerEvent): void {
		/* Se emite el grupo arrastrado, para poder asignarle la clase hidden, que lo ubica detrás de las líneas
		*  mientras se mueve el auxiliar. Debe hacerse desde mechanic-line.component, por eso se use le emitter */
		this.hiddenCardsGroup.emit(this.cardsGroup);

		this.initCoordinates(event);

		/* Se envía el grupo para mostrar el helper en el overlay */
		CardPositionService.setHelperGroup(this.cardBehaviour.findHelperGroup(this.cardsGroup));
		/* Permite asignar o eliminar la clase que añade una transición al helper, para desplazarse a la posicíon
		*  final */
		NotificationService.notifyDragging(true);
	}

	private initCoordinates(event: PointerEvent, cardRect: any = this.cardRect): void {
		this.startPosition = new Coordinates(cardRect.left, cardRect.top);
		this.position = new Coordinates(cardRect.left, cardRect.top);
		this.startEventCoordinates = new Coordinates(event.clientX, event.clientY);

		/* Se notifican las coordenadas iniciales para que el helper se ubique en la posición correcta */
		NotificationService.notifyCoordinates(this.startPosition);
	}

	onPointerUp(): void {
		if (!this.init) {
			this.cdRef.detectChanges();

			const position = CardPositionService.handleDestinyPosition(this.position, this.startPosition);
			if (position) {
				this.position = position;

				/* Se emite la última posición ya redondeada */
				NotificationService.notifyCoordinates(this.position);
			} else {
				CardPositionService.setHelperGroup(undefined);
			}
			/* Evento emitido para forzar una última vez el CD, una vez establecida la nueva posición, y eliminar la ficha
			 * de su posición de origen */
			NotificationService.notifyDragging(false);

			// TODO Revisar hiddenGroup y comprobar si hace falta emitter
			CardPositionService.hiddenGroup = undefined;
			CardPositionService.originDropzone = undefined;
		}
		// else {
		// 	this.cardBehaviour.handleLeftClick();
		// }

		this.pointerMoveListener();
		this.pointerUpListener();
	}

}
