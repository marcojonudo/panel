import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ToolsButtonInterface} from "../../objects/tools-button-interface";
import {TimeService} from "../../services/time.service";
import {DaysPanelsService} from "../../services/days-panels.service";
import {DaysService} from "../../services/days.service";

@Component({
  selector: 'app-tools-buttons',
  templateUrl: './tools-buttons.component.html',
  styleUrls: ['./tools-buttons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsButtonsComponent {

  // private buttons: ToolsButtonInterface[];

  constructor(
    private timeService: TimeService,
    private daysService: DaysService) {
    // this.buttons = [
    //   { icon: 'fas fa-arrows-alt-h', action: this.fitTime },
    //   { icon: 'fas fa-binoculars', action: this.toggleView }
    // ];
  }

  ngOnInit() {
  }

  fitTime() {
    this.timeService.toggleFitWidth();
  }

  toggleDayMode() {
    this.daysService.toggleDayMode();
  }

  testButtons() {
    // console.log('Test buttons');
  }

}
