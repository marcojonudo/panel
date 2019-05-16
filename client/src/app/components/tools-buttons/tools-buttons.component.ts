import { Component, OnInit } from '@angular/core';
import {ToolsButtonInterface} from "../../objects/tools-button-interface";
import {TimeService} from "../../services/time.service";

@Component({
  selector: 'app-tools-buttons',
  templateUrl: './tools-buttons.component.html',
  styleUrls: ['./tools-buttons.component.css']
})
export class ToolsButtonsComponent {

  // private buttons: ToolsButtonInterface[];

  constructor(private timeService: TimeService) {
    // this.buttons = [
    //   { icon: 'fas fa-arrows-alt-h', action: this.fitTime },
    //   { icon: 'fas fa-binoculars', action: this.toggleView }
    // ];
  }

  ngOnInit() {
  }

  fitTime() {
    this.timeService.fitTimeToScreen();
  }

  toggleView() {
    console.log('adsa');
    console.log(this.timeService);
  }

}
