import { Component, OnInit } from '@angular/core';
import {ToolsButtonInterface} from "../../objects/tools-button-interface";
import {ToolsButtonsService} from "../../services/tools-buttons.service";

@Component({
  selector: 'app-tools-buttons',
  templateUrl: './tools-buttons.component.html',
  styleUrls: ['./tools-buttons.component.css']
})
export class ToolsButtonsComponent implements OnInit {

  private buttons: ToolsButtonInterface[];

  constructor() {
    this.buttons = [
      {
        icon: 'fas fa-binoculars', action: this.toggleView
      }
    ];
  }

  ngOnInit() {
  }

  toggleView() {
    console.log('adsa');
  }

}
