import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener, Input,
  OnDestroy,
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

  // private dragging: boolean;

  private pointerEnterListener;
  private pointerLeaveListener;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private cardPositionService: CardPositionService
  ) { }

  ngOnInit() {
    this.cardPositionService.dragging$.subscribe(dragging => {
      if (dragging) {
        this.pointerEnterListener = this.renderer.listen(this.element.nativeElement, 'pointerenter', this.onPointerEnter.bind(this));
        this.pointerLeaveListener = this.renderer.listen(this.element.nativeElement, 'pointerleave', this.onPointerLeave.bind(this));
      } else {
        if (this.pointerEnterListener) {
          this.pointerEnterListener();
          this.pointerLeaveListener();
        }
      }
    });
  }

  onPointerEnter(): void {
    if (this.cardPositionService.dragging) {
      this.entered = true;
      this.cardPositionService.dropzone = new DropzoneInfo(this.mechanic, this.element.nativeElement.getBoundingClientRect());;
      console.log('ENTEREEEEEEED', this.cardPositionService.dropzone);
    }
  }

  onPointerLeave(): void {
    if (this.cardPositionService.dragging) {
      console.log('LEAVEEEEEEEEEEE', this.cardPositionService.dropzone);
      this.entered = false;
      this.cardPositionService.dropzone = undefined;
    }
  }

}
