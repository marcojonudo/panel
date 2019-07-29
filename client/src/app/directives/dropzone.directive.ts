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

@Directive({
	selector: '[appDropzone]'
})
export class DropzoneDirective implements OnInit {

	@Input() mechanic: Mechanic;

	//TODO Revisar comportamiento dragging
	@HostBinding('class.dropzone-dragging') entered: boolean;

	private dropzone: DropzoneInfo;

	private pointerMoveListener: any;
	private pointerLeaveListener: any;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2,
		private changeDetectorRef: ChangeDetectorRef,
		private cardPositionService: CardPositionService
	) {	}

	ngOnInit() {
		// this.dropzone = new DropzoneInfo(this.mechanic, this.element.nativeElement.getBoundingClientRect(), this.element);
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
		this.cardPositionService.dropzone = this.dropzone;
	}

	onPointerLeave(): void {
		this.cardPositionService.dropzone = undefined;
	}

}
