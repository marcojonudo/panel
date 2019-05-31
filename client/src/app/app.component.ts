import {ChangeDetectionStrategy, Component, enableProdMode} from '@angular/core';
import {DaysService} from "./services/days.service";
import {TimeService} from "./services/time.service";
import {MechanicsService} from "./services/mechanics.service";
import {Constants} from "./objects/constants";

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
  private itemSize: number;

  constructor(
    private daysService: DaysService,
    private timeService: TimeService,
    private mechanicsService: MechanicsService
  ) {
    this.daysPanels = this.daysService.days;
    this.itemSize = this.mechanicsService.mechanics.length * (Constants.VALUE.LINE_HEIGHT_DEFAULT + 10);
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

  checkComponent() {
    //console.log('Component')
  }

}
