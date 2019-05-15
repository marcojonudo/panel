import { Component, OnInit } from '@angular/core';
import {TimelineService} from "../../services/timeline.service";

@Component({
  selector: 'app-mechanic-line',
  templateUrl: './mechanic-line.component.html',
  styleUrls: ['./mechanic-line.component.css']
})
export class MechanicLineComponent implements OnInit {

  private hours: number[];
  private quartersPerHour: number;
  private intervalsPerQuarter: number;
  private intervals: number[];

  constructor(private timelineService:TimelineService) {
    this.quartersPerHour = 4;
    this.intervalsPerQuarter = 3;
  }

  ngOnInit() {
    // this.hours = this.timelineService.getHours();
    // let intervalsNumber = this.hours.length * this.quartersPerHour * this.intervalsPerQuarter;
    // for (interval of intervalsNumber) {
    //   this.intervals.push(interval);
    // }
    // console.log(this.intervals);
  }

}
