import {
	Directive,
	ElementRef,
	HostBinding,
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
import {MechanicUpdate} from "../objects/update-days-cards/mechanic-update";

@Directive({
	selector: '[appDropzone]'
})
export class DropzoneDirective implements OnInit, OnChanges {

	@Input() type: string;
	@Input() subType?: string;
	@Input() mechanic: Mechanic;
	@Input() update: MechanicUpdate;

	//TODO Revisar comportamiento dragging
	@HostBinding('class.dropzone-dragging') entered: boolean;

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
		this.dropzone = DropzoneService.findDropzoneType(this.type, this.mechanic, this.subType);
		this.dropzone.position = DimensionsService.createPosition(this.element.nativeElement.getBoundingClientRect());
		DropzoneService.addDropzone(this.dropzone);
	}

	ngOnChanges(changes: SimpleChanges) {
		/* Si la línea de mecánico está siendo actualizada por un cambio de zoom, se deben actualizar las posiciones y
		*  de la dropzone */
		if (changes.update && changes.update.currentValue) {
			/* Se define el timeout para dar tiempo a que actualice la interfaz y se genere un rect real */
			setTimeout(() => {
				this.dropzone.position =
					DimensionsService.createPosition(this.element.nativeElement.getBoundingClientRect());
			}, 1)

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
