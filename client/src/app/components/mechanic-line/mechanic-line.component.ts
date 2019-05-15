import { Component, OnInit } from '@angular/core';
import {TimelineService} from "../../services/timeline.service";

@Component({
  selector: 'app-mechanic-line',
  templateUrl: './mechanic-line.component.html',
  styleUrls: ['./mechanic-line.component.css']
})
export class MechanicLineComponent implements OnInit {

  private readonly quartersPerHour: number;
  private readonly intervalsPerQuarter: number;
  private hours: number[];
  private quarters: string[];
  private intervals: number[];

  constructor(private timelineService:TimelineService) {
    this.quartersPerHour = 4;
    this.intervalsPerQuarter = 3;
  }

  ngOnInit() {
    this.hours = this.timelineService.getHours();
    this.quarters = this.timelineService.getQuarters();
    let intervalsNumber = this.hours.length * this.quartersPerHour * this.intervalsPerQuarter;
    this.intervals = Array(intervalsNumber);
  }

}
