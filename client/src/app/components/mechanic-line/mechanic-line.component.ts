import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TimeService} from "../../services/time.service";

@Component({
  selector: 'app-mechanic-line',
  templateUrl: './mechanic-line.component.html',
  styleUrls: ['./mechanic-line.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineComponent implements OnInit {

  // private readonly quartersPerHour: number;
  // private readonly intervalsPerQuarter: number;
  private hours: number[];
  private quarters: string[];
  // private intervals: number[];

  constructor(private timeService:TimeService) {
    // this.quartersPerHour = 4;
    // this.intervalsPerQuarter = 3;
    this.hours = this.timeService.getHours();
    this.quarters = this.timeService.getQuarters();
  }

  ngOnInit() {
    // let intervalsNumber = this.hours.length * this.quartersPerHour * this.intervalsPerQuarter;
    // this.intervals = Array(intervalsNumber);
  }

  trackByItem(index, item) {
    return item;
  }

}
