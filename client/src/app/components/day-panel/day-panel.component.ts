import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {TimeService} from "../../services/time.service";
import {DaysPanelsService} from "../../services/days-panels.service";
import {Constants} from "../../objects/constants";

@Component({
  selector: 'app-day-panel',
  templateUrl: './day-panel.component.html',
  styleUrls: ['./day-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPanelComponent implements OnInit {

  @Output() scrollLeft: EventEmitter<number>;
  @Input() index: number = 3;

  @ViewChild(Constants.ELEMENT.SCROLLABLE_CONTAINER) scrollableContainer: ElementRef;

  // test: any;

  constructor(
    private timeService: TimeService,
    private daysPanelsService: DaysPanelsService,
    private renderer: Renderer2
  ) {
    this.scrollLeft = new EventEmitter();
    // this.test = {'width.%': 350};
    // this.timeService.widthValueChange.subscribe((value) => {
    //   this.test['width.%'] = value
    // })
  }

  ngOnInit() { }

  testDayPanel() {
    console.log('Day panel');
  }

  getTotalTimeWidth() {
    // this.test['width.%'] = this.timeService.getTotalTimeWidth();
    // console.log(this.test);
    console.log('Width en day panel: ' + this.timeService.getTotalTimeWidth());
    return this.timeService.getTotalTimeWidth();
  }

  fitWidth() {
    return this.timeService.getFitWidth()
  }

  oneDayMode() {
    return this.daysPanelsService.getOneDayMode()
  }

  emitScrollValue(event) {
    this.scrollLeft.emit(event.target.scrollLeft)
  }

  @Input()
  set setScrollLeft(scrollLeft: number) {
    this.renderer.setProperty(
      this.scrollableContainer.nativeElement,
      Constants.PROPERTY.SCROLL_LEFT,
      scrollLeft
    );
  }

}
