import {ChangeDetectionStrategy, Component, enableProdMode} from '@angular/core';
import {DaysService} from "./services/days.service";
import {TimeService} from "./services/time.service";

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

  constructor(private daysService: DaysService, private timeService: TimeService) {
    this.daysPanels = this.daysService.days;
  }

  get oneDayMode$() {
    return this.daysService.oneDayMode$;
  }

  get width$() {
    return this.timeService.width$
  }

  trackByDay(index, item) {
    return item
  }

}
