import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mechanic-info',
  templateUrl: './mechanic-info.component.html',
  styleUrls: ['./mechanic-info.component.css']
})
export class MechanicInfoComponent implements OnInit {

  @Input() mechanic: string;

  constructor() { }

  ngOnInit() {
  }

}
