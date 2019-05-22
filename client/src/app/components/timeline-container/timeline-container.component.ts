import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-timeline-container',
  templateUrl: './timeline-container.component.html',
  styleUrls: ['./timeline-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
