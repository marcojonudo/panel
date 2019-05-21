import {ChangeDetectionStrategy, Component, enableProdMode} from '@angular/core';
import {DaysPanelsService} from "./services/days-panels.service";
import {DaysService} from "./services/days.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Panel';

  //TODO Cambiar tipo
  private daysPanels: any[];

  private scrollLeft: number;

  constructor(private daysService: DaysService) {
    this.daysPanels = this.daysService.days;
  }

  setScrollLeft(scrollLeft) {
    this.scrollLeft = scrollLeft;
  }

  get oneDayMode$() {
    return this.daysService.oneDayMode$;
  }

}
