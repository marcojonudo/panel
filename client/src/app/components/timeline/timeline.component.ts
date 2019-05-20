import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TimeService} from "../../services/time.service";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnInit {

  private hours: number[];
  private quarters: string[];

  constructor(private timeService: TimeService) { }

  ngOnInit() {
    this.hours = this.timeService.getHours();
    this.quarters = this.timeService.getQuarters()
  }

  fitWidth() {
    return this.timeService.getFitWidth()
  }

}
