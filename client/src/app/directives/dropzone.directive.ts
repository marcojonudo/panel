import {
	Directive,
	ElementRef,
	Input, OnChanges,
	OnInit,
	Renderer2, SimpleChanges
} from '@angular/core';
import {CardPositionService} from "../services/card-position.service";
import {Mechanic} from "../objects/mechanic";
import {Dropzone} from "../objects/dropzone-type/dropzone";
import {Constants} from "../objects/constants";
import {DropzoneService} from "../services/dropzone.service";
import {DimensionsService} from "../services/dimensions.service";
import {DropzoneUpdate} from "../objects/trigger-cd/update-objects/mechanic-line/dropzone-update";
import {ScheduleInterval} from "../objects/schedule-interval";

@Directive({
	selector: '[appDropzone]'
})
export class DropzoneDirective implements OnInit, OnChanges {

	@Input() type: string;
	@Input() subType?: string;
	@Input() mechanic: Mechanic;
	@Input() interval: ScheduleInterval;
	@Input() dropzoneUpdate: DropzoneUpdate;

	private dropzone: Dropzone;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2
	) {
		this.renderer.listen(
			this.element.nativeElement,
			Constants.EVENT.POINTER_LEAVE,
			this.onPointerLeave.bind(this)
		);
		this.renderer.listen(
			this.element.nativeElement,
			Constants.EVENT.POINTER_ENTER,
			this.onPointerEnter.bind(this)
		);
	}

	ngOnInit() {
		this.dropzone = DropzoneService.findDropzoneType(this.type, this.subType, this.mechanic, this.interval);
		this.dropzone.position = DimensionsService.createPosition(this.element.nativeElement.getBoundingClientRect());
		DropzoneService.addDropzone(this.dropzone);
	}

	ngOnChanges(changes: SimpleChanges) {
		/* Si la línea de mecánico está siendo actualizada por un cambio de zoom, se deben actualizar las posiciones y
		*  de la dropzone */
		if (changes.dropzoneUpdate && changes.dropzoneUpdate.currentValue) {
			/* Se define el timeout para dar tiempo a que actualice la interfaz y se generen tanto un rect real,
			*  como un valor final de scroll */
			setTimeout(() => {
				this.dropzone.position =
					DimensionsService.createPosition(
						this.element.nativeElement.getBoundingClientRect(),
						CardPositionService.scroll.left,
						CardPositionService.scroll.top
					);
			}, 150)
		}
	}

	onPointerEnter(): void {
		if (CardPositionService.dragging) {
			CardPositionService.destinyDropzone = this.dropzone;
		}
	}

	onPointerLeave(): void {
		if (CardPositionService.dragging) {
			CardPositionService.destinyDropzone = undefined;
		}
	}

}
