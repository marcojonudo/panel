import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-mechanic-info',
  templateUrl: './mechanic-info.component.html',
  styleUrls: ['./mechanic-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicInfoComponent implements OnInit {

  @Input() mechanic: string;

  constructor() { }

  ngOnInit() {
  }

}
