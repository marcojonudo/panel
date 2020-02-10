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
import {DropzoneService} from "../services/dropzone.service";

@Directive({
	selector: '[appDropzone]'
})
export class DropzoneDirective implements OnInit {

	@Input() type: string;
	@Input() subType?: string;
	@Input() mechanic: Mechanic;

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
		this.dropzone.rect = this.element.nativeElement.getBoundingClientRect();
		DropzoneService.addDropzone(this.dropzone);
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
