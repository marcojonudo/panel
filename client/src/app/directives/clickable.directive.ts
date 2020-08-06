import {
	AfterViewChecked,
	ChangeDetectorRef,
	Directive,
	ElementRef, EventEmitter,
	Input, OnDestroy,
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
import {DropzoneService} from "../services/dropzone.service";
import {UtilsService} from "../services/utils.service";

@Directive({
	selector: '[appClickable]',
	exportAs: 'appDraggable'
})
export class ClickableDirective implements OnInit, AfterViewChecked, OnDestroy {

	private readonly AVOID_DRAG_ID: string = 'link-handler';

	@Input() group: CardsGroup;
	@Input() cardBehaviour: CardTypeBehaviour;
	@Output() hiddenCardsGroup: EventEmitter<CardsGroup>;

	private cardRect;

	private startCoordinates: Coordinates;
	private startEventCoordinates: Coordinates;
	private coordinates: Coordinates;

	private pointerDownListener: () => void;
	private contextMenuListener: () => void;

	private init: boolean;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {
		this.init = false;
		this.hiddenCardsGroup = new EventEmitter();

		this.coordinates = new Coordinates(0, 0);
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

	ngOnDestroy(): void {
		/* En caso de actualizar una ficha que se está arrastrando desde otro terminal, se actualizará su posición
		*  en tiempo real sin llegar a soltarse nunca. En ese caso, se eliminan los listeners aquí */
		if (CardPositionService.helperGroupPointerMoveListener) {
			CardPositionService.helperGroupPointerMoveListener();
			CardPositionService.helperGroupPointerUpListener();
		}
	}

	private handleRightClick(event: PointerEvent): void {
		event.preventDefault();
		this.cardBehaviour.handleRightClick(this.group, new Coordinates(event.clientX, event.clientY));
	}

	handleClick(event: PointerEvent): void {
		/* Sólo se ejecuta una acción si se hace clic con el botón izquierdo. En caso de ser el derecho, se debe omitir
		*  para que se ejecute el listener del evento contextmenu */
		if (UtilsService.checkLeftClick(event) && this.checkDragElement((<HTMLElement> event.target).id)) {
			this.handleLeftClick(event);
		}
	}

	private handleLeftClick(event: PointerEvent): void {
		/* Si el modo es DRAG, se llevan a cabo las acciones necesarias para conseguir el desplazamiento del grupo */
		if (this.group.mode == Constants.GROUP_MODE.DRAG) {
			this.init = true;
			CardPositionService.helperGroupPointerMoveListener = this.renderer.listen(
				Constants.ELEMENT.DOCUMENT,
				Constants.EVENT.POINTER_MOVE,
				this.onPointerMove.bind(this)
			);
			CardPositionService.helperGroupPointerUpListener = this.renderer.listen(
				Constants.ELEMENT.DOCUMENT,
				Constants.EVENT.POINTER_UP,
				this.onPointerUp.bind(this)
			);
		} else {
			this.cardBehaviour.handleLeftClick(this.group, event.clientX);
		}
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
		this.coordinates.x = this.startCoordinates.x + event.clientX - this.startEventCoordinates.x;
		this.coordinates.y = this.startCoordinates.y + event.clientY - this.startEventCoordinates.y;
		NotificationService.notifyCoordinates(this.coordinates);
	}

	private initDragging(event: PointerEvent): void {
		/* Se emite el grupo arrastrado, para poder asignarle la clase hidden, que lo ubica detrás de las líneas
		*  mientras se mueve el auxiliar. Debe hacerse desde mechanic-line.component, por eso se use le emitter */
		this.hiddenCardsGroup.emit(this.group);

		this.initCoordinates(event);

		/* Se envía el grupo para mostrar el helper en el overlay */
		CardPositionService.setHelperGroup(this.cardBehaviour.findHelperGroup(this.group));
		/* Permite asignar o eliminar la clase que añade una transición al helper, para desplazarse a la posicíon
		*  final */
		CardPositionService.setDragging(true);

		/* La dropzone de origen se obtiene de forma programática para evitar problemas con los eventos de cursor. Por
		*  ejemplo, que por desplazarlo muy rápido no se lance y se produzcan fallos al no estar definida */
		CardPositionService.originDropzone = DropzoneService.findDropzone(this.group.cards[0]);
	}

	private initCoordinates(event: PointerEvent, cardRect: any = this.cardRect): void {
		this.startCoordinates = new Coordinates(cardRect.left, cardRect.top);
		this.coordinates = new Coordinates(cardRect.left, cardRect.top);
		this.startEventCoordinates = new Coordinates(event.clientX, event.clientY);

		/* Se notifican las coordenadas iniciales para que el helper se ubique en la posición correcta */
		NotificationService.notifyCoordinates(this.startCoordinates);
	}

	onPointerUp(): void {
		if (!this.init) {
			this.cdRef.detectChanges();

			const coordinates = CardPositionService.handleDestinyPosition(this.coordinates, this.startCoordinates);
			if (coordinates) {
				this.coordinates = coordinates;

				/* Se emite la última posición ya redondeada */
				NotificationService.notifyCoordinates(this.coordinates);
			} else {
				console.log('setting undefined');
				CardPositionService.setHelperGroup(undefined);
			}
			CardPositionService.hiddenGroup = undefined;
			/* Evento emitido para forzar una última vez el CD, una vez establecida la nueva posición, y eliminar la ficha
			 * de su posición de origen */
			CardPositionService.setDragging(false);
			CardPositionService.originDropzone = undefined;
		}

		CardPositionService.helperGroupPointerMoveListener();
		CardPositionService.helperGroupPointerUpListener();
	}

}
