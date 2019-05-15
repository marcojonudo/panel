import { Component, OnInit } from '@angular/core';
import { TimelineService } from '../../services/timeline.service'

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  private hours: number[];
  private quarters: string[];

  constructor(private timelineService:TimelineService) { }

  ngOnInit() {
    this.hours = this.timelineService.getHours();
    this.quarters = this.timelineService.getQuarters()
  }

}
