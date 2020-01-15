import {
	ChangeDetectorRef,
	Directive,
	ElementRef,
	HostBinding,
	Input,
	OnInit,
	Renderer2
} from '@angular/core';
import {CardPositionService} from "../services/card-position.service";
import {Mechanic} from "../objects/mechanic";
import {Dropzone} from "../objects/dropzone-type/dropzone";
import {Constants} from "../objects/constants";
import {AssignedDropzone} from "../objects/dropzone-type/assigned-dropzone";
import {UnassignedDropzone} from "../objects/dropzone-type/unassigned-dropzone";
import {CardsService} from "../services/cards.service";
import {FinishDropzone} from "../objects/dropzone-type/finish-dropzone";
import {AppointmentsService} from "../services/appointments.service";
import {NotificationService} from "../services/notification.service";
import {UnassignedFinishedDropzone} from "../objects/dropzone-type/unassigned-finished-dropzone";
import {AuxiliaryDropzone} from "../objects/dropzone-type/temporal-dropzone";

@Directive({
	selector: '[appDropzone]'
})
export class DropzoneDirective implements OnInit {

	@Input() type: string;
	@Input() subType?: string;
	@Input() mechanic: Mechanic;

	//TODO Revisar comportamiento dragging
	@HostBinding('class.dropzone-dragging') entered: boolean;

	// private dropzone: DropzoneInfo;
	private dropzone: Dropzone;

	private readonly DROPZONE_TYPE: { [key: string]: (() => Dropzone) };

	private pointerMoveListener: any;
	private pointerLeaveListener: any;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private cdRef: ChangeDetectorRef,
		private cardPositionService: CardPositionService,
		private cardsService: CardsService,
		private appointmentsService: AppointmentsService
	) {
		this.DROPZONE_TYPE = {};
		this.DROPZONE_TYPE[Constants.DROPZONE_TYPE.ASSIGNED] =
			() => new AssignedDropzone(this.cardsService, this.appointmentsService, this.mechanic);
		this.DROPZONE_TYPE[Constants.DROPZONE_TYPE.UNASSIGNED] =
			() => new UnassignedDropzone(this.cardsService, this.appointmentsService, this.subType);
		this.DROPZONE_TYPE[Constants.DROPZONE_TYPE.UNASSIGNED_FINISHED] =
			() => new UnassignedFinishedDropzone(this.cardsService, this.appointmentsService, this.subType);
		this.DROPZONE_TYPE[Constants.DROPZONE_TYPE.AUXILIARY] =
			() => new AuxiliaryDropzone(this.cardsService, this.appointmentsService, this.subType);
		this.DROPZONE_TYPE[Constants.DROPZONE_TYPE.FINISH] =
			() => new FinishDropzone(this.cardsService, this.appointmentsService);
	}

	ngOnInit() {
		this.dropzone = this.DROPZONE_TYPE[this.type]();
		NotificationService.dragging$.subscribe(dragging => {
			if (dragging) {
				this.pointerMoveListener = this.renderer.listen(
					this.element.nativeElement,
					Constants.EVENT.POINTER_MOVE,
					this.onPointerMove.bind(this)
				);
				this.pointerLeaveListener = this.renderer.listen(
					this.element.nativeElement,
					Constants.EVENT.POINTER_LEAVE,
					this.onPointerLeave.bind(this)
				);
				this.dropzone.rect = this.element.nativeElement.getBoundingClientRect();
			} else {
				if (this.pointerMoveListener) {
					this.pointerMoveListener();
					this.pointerLeaveListener();
				}
			}
		});
	}

	onPointerMove(): void {
		if (!CardPositionService.originDropzone) {
			CardPositionService.originDropzone = this.dropzone;
		}
		CardPositionService.destinyDropzone = this.dropzone;
	}

	onPointerLeave(): void {
		CardPositionService.destinyDropzone = undefined;
	}

}
