import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {CardPositionService} from "../services/card-position.service";

@Directive({
  selector: '[appDropzone]'
})
export class DropzoneDirective implements OnInit {

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

  // @HostListener('pointerenter')
  onPointerEnter(): void {
    if (this.dragging) {
      this.entered = true;
      console.log(this.element);
      this.cardPositionService.emitDropzonePosition(this.element.nativeElement.getBoundingClientRect());
      // this.changeDetectorRef.detectChanges();
    }
  }

  // @HostListener('pointerleave')
  onPointerLeave(): void {
    if (this.dragging) {
      this.entered = false;
      this.cardPositionService.emitDropzonePosition(undefined);

      // this.changeDetectorRef.detectChanges();
    }
  }

}
