import {Directive, HostBinding, HostListener, OnInit} from '@angular/core';
import {CardPositionService} from "../services/card-position.service";

@Directive({
  selector: '[appDropzone]'
})
export class DropzoneDirective implements OnInit {

  //TODO Revisar comportamiento dragging
  @HostBinding('class.dropzone-dragging') entered: boolean;

  private dragging: boolean;

  constructor(private cardPositionService: CardPositionService) { }

  ngOnInit() {
    this.cardPositionService.helperCard$.subscribe(helperCard => this.onDrag(helperCard));
  }

  onDrag(helperCard: any) {
    this.dragging = !!helperCard;
    if (!this.dragging) {
      if (this.entered) {
        console.log('on drop!');
      }
      this.entered = false;
    }
  }

  // @HostListener('pointerenter')
  // onPointerEnter(): void {
  //   if (this.dragging) {
  //     this.entered = true;
  //   }
  // }
  //
  // @HostListener('pointerleave')
  // onPointerLeave(): void {
  //   if (this.dragging) {
  //     this.entered = false;
  //   }
  // }

}
