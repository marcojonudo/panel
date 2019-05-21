import {
  AfterViewChecked,
  AfterViewInit,
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
import {DaysService} from "../../services/days.service";

@Component({
  selector: 'app-day-panel',
  templateUrl: './day-panel.component.html',
  styleUrls: ['./day-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPanelComponent implements OnInit, AfterViewInit {

  @Output() scrollLeftEmitter: EventEmitter<number>;

  @ViewChild(Constants.ELEMENT.SCROLLABLE_CONTAINER) scrollableContainer: ElementRef;

  private writeDom: boolean;
  private initialScrollLeft: number;

  constructor(
    private timeService: TimeService,
    private daysService: DaysService,
    private renderer: Renderer2
  ) {
    this.scrollLeftEmitter = new EventEmitter();
    this.writeDom = false;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.writeDom = true;
    // TODO Asignar valor al cargar el component para evitar el forced reflow
    // this.setScrollLeft(this.initialScrollLeft);
  }

  get width$() {
    return this.timeService.width$
  }

  get oneDayMode$() {
    return this.daysService.oneDayMode$;
  }

  emitScrollValue(event) {
    this.scrollLeftEmitter.emit(event.target.scrollLeft)
  }

  @Input()
  set scrollLeft(scrollLeft: number) {
    if (this.scrollableContainer && this.writeDom) {
      this.setScrollLeft(scrollLeft);
    } else {
      this.initialScrollLeft = scrollLeft;
    }
  }

  setScrollLeft(scrollLeft: number) {
    this.renderer.setProperty(
      this.scrollableContainer.nativeElement,
      Constants.PROPERTY.SCROLL_LEFT,
      scrollLeft
    );
  }

}
