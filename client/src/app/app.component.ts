import { Component } from '@angular/core';
import {TimeService} from "./services/time.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spa';

  constructor(private timeService: TimeService) { }

  getTotalTimeWidth() {
    return this.timeService.getTotalTimeWidth()
  }

  fitWidth() {
    return this.timeService.getFitWidth()
  }

}
