import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-band',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BandComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
