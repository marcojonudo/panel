import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mechanic-line-container',
  templateUrl: './mechanic-line-container.component.html',
  styleUrls: ['./mechanic-line-container.component.css']
})
export class MechanicLineContainerComponent implements OnInit {

  constructor() { }

  @Input() mechanic: string;

  ngOnInit() {
  }

}
