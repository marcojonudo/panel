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
export class DayPanelComponent {

  @Input() index: number;

  constructor(
    private timeService: TimeService,
    private daysService: DaysService
  ) {
  }

  get oneDayMode$() {
    return this.daysService.oneDayMode$;
  }

  checkDayPanel() {
    console.log('-- Day panel ' + this.index);
  }

}
