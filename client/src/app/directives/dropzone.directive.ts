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

  private dragging: boolean;

  private pointerEnterListener;
  private pointerLeaveListener;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private cardPositionService: CardPositionService
  ) { }

  ngOnInit() {
    this.cardPositionService.dragging$.subscribe(dragging => this.dragging = dragging);
    this.pointerEnterListener = this.renderer.listen(this.element.nativeElement, 'pointerenter', this.onPointerEnter.bind(this))
    this.pointerLeaveListener = this.renderer.listen(this.element.nativeElement, 'pointerleave', this.onPointerLeave.bind(this))
  }

  // onDrag(helperCard: any) {
  //   this.dragging = !!helperCard;
  //   if (!this.dragging) {
  //     if (this.entered) {
  //       console.log('on drop!');
  //     }
  //     this.entered = false;
  //   }
  // }

  onPointerEnter(): void {
    if (this.dragging) {
      this.entered = true;
      const dropzone = new DropzoneInfo(this.mechanic, this.element.nativeElement.getBoundingClientRect());
      this.cardPositionService.emitDropzone(dropzone);
    }
  }

  onPointerLeave(): void {
    if (this.dragging) {
      this.entered = false;
      this.cardPositionService.emitDropzone(undefined);
    }
  }

}
