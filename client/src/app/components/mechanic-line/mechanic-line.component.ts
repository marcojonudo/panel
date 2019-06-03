import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, Input,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {TimeService} from "../../services/time.service";
import interact from "interactjs"

@Component({
  selector: 'app-mechanic-line',
  templateUrl: './mechanic-line.component.html',
  styleUrls: ['./mechanic-line.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent implements AfterViewInit {

  // private readonly quartersPerHour: number;
  // private readonly intervalsPerQuarter: number;
  private hours: number[];
  private quarters: string[];
  private intervalWidth: number;

  @Input() mechanic: string;

  @ViewChild('dropzone') dropzone: ElementRef;

  constructor(private timeService: TimeService) {
    this.hours = this.timeService.getHours();
    this.quarters = this.timeService.getQuarters();
  }

  ngAfterViewInit() {
    console.log(this.dropzone.nativeElement.offsetWidth);
    this.timeService.calculateIntervalWidth(5840);
    // this.timeService.calculateIntervalWidth(this.dropzone.nativeElement.offsetWidth);
    interact('.dropzone-' + this.mechanic)
      .dropzone({
        accept: '.draggable',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.5,

        // listen for drop related events:

        // ondropactivate: this.onDropActive,
        ondragenter: (event) => this.onDragEnter(event),
        ondragleave: this.onDragLeave,
        ondropmove: (event) => this.onDropMove(event)
        // ondrop: this.onDrop,
        // ondropdeactivate: this.onDropDeactivate
      });
  }

  onDropMove(event) {
    const draggableRect = interact.getElementRect(event.relatedTarget);
    const leftIntervals = Math.floor((draggableRect.left - 180) / this.timeService.intervalWidth);
    const left = 180 + leftIntervals * this.timeService.intervalWidth;

    const dropzoneRect = interact.getElementRect(event.target);
    const dropzoneTop = draggableRect.top > dropzoneRect.top + dropzoneRect.height/4 ? dropzoneRect.top + dropzoneRect.height/2 : dropzoneRect.top;

    event.draggable.options.drag.modifiers[0].options.targets[0] = () => {
      return {x: left, y: dropzoneTop}
    };
  }

  // onDropDeactivate(event) {
  //   console.log('onDropDeactivate');
  // }
  // // listen for drop related events:
  //
  // onDropActive(event) {
  //   console.log('onDropActive');
  //   // add active dropzone feedback
  //   event.target.classList.add('drop-active');
  // }

  onDragEnter(event) {
    event.relatedTarget.setAttribute('data-dropzone', event.target.id);
    event.relatedTarget.setAttribute('data-dropzone-top', interact.getElementRect(event.target).top);
  }

  onDragLeave(event) {
    event.relatedTarget.removeAttribute('data-dropzone');
    const draggableElement = event.relatedTarget;

    if (JSON.parse(draggableElement.getAttribute('data-record-position'))) {
      const x = draggableElement.getAttribute('data-start-x');
      const y = draggableElement.getAttribute('data-start-y');
      event.draggable.options.drag.modifiers[0].options.targets[0] = () => {
        return {x: +x, y: +y}
      };
    }
  }

  // onDrop(event) {
  //   console.log('onDrop');
  //   console.log(event);
  //   event.relatedTarget.textContent = 'Dropped';
  // }

  trackByItem(index, item) {
    return item;
  }

  check() {
    // console.log('-------- Mechanic line')
  }



}
