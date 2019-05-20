import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-mechanic-line-container',
  templateUrl: './mechanic-line-container.component.html',
  styleUrls: ['./mechanic-line-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent implements OnInit {

  constructor() { }

  @Input() mechanic: string;

  ngOnInit() {
  }

}
