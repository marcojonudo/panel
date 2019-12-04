import {
	AfterContentInit,
	AfterViewInit,
	ChangeDetectorRef,
	Directive,
	ElementRef,
	HostBinding,
	Input,
	OnInit,
	Renderer2
} from '@angular/core';
import {CardPositionService} from "../services/card-position.service";
import {DropzoneInfo} from "../objects/dropzone-info";
import {Mechanic} from "../objects/mechanic";
import {DropzoneType} from "../objects/dropzone-type/dropzone-type";
import {Constants} from "../objects/constants";
import {AssignedDropzoneType} from "../objects/dropzone-type/assigned-dropzone-type";
import {UnassignedDropzoneType} from "../objects/dropzone-type/unassigned-dropzone-type";

@Directive({
	selector: '[appDropzone]'
})
export class DropzoneDirective implements OnInit {

	@Input() type: string;
	@Input() mechanic: Mechanic;

	//TODO Revisar comportamiento dragging
	@HostBinding('class.dropzone-dragging') entered: boolean;

	private dropzone: DropzoneInfo;
	private dropzone2: DropzoneType;

	private readonly DROPZONE_TYPE: any;

	private pointerMoveListener: any;
	private pointerLeaveListener: any;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private changeDetectorRef: ChangeDetectorRef,
		private cardPositionService: CardPositionService
	) {
		this.DROPZONE_TYPE = {};
		this.DROPZONE_TYPE[Constants.DROPZONE_TYPE.ASSIGNED] = () => new AssignedDropzoneType(this.mechanic);
		this.DROPZONE_TYPE[Constants.DROPZONE_TYPE.UNASSIGNED] = () => new UnassignedDropzoneType();
	}

	ngOnInit() {
		this.dropzone2 = this.DROPZONE_TYPE[this.type]();
		this.cardPositionService.dragging$.subscribe(dragging => {
			if (dragging) {
				this.pointerMoveListener = this.renderer.listen(this.element.nativeElement, 'pointermove', this.onPointerMove.bind(this));
				this.pointerLeaveListener = this.renderer.listen(this.element.nativeElement, 'pointerleave', this.onPointerLeave.bind(this));
				this.dropzone = new DropzoneInfo(this.mechanic, this.element.nativeElement.getBoundingClientRect());
			} else {
				if (this.pointerMoveListener) {
					this.pointerMoveListener();
					this.pointerLeaveListener();
				}
			}
		});
	}

	onPointerMove(): void {
		if (!this.cardPositionService.originDropzone) {
			this.cardPositionService.originDropzone = this.dropzone2;
		}
		this.cardPositionService.dropzone = this.dropzone;
		this.cardPositionService.destinyDropzone = this.dropzone2;
	}

	onPointerLeave(): void {
		this.cardPositionService.dropzone = undefined;
		this.cardPositionService.destinyDropzone = undefined;
	}

}
