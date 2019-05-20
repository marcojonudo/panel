import {ChangeDetectionStrategy, Component, enableProdMode} from '@angular/core';
import {DaysPanelsService} from "./services/days-panels.service";

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

  constructor(private daysPanelService: DaysPanelsService) {
    this.daysPanels = this.daysPanelService.getDaysPanels();
  }

  oneDayMode() {
    return this.daysPanelService.getOneDayMode()
  }

  setScrollLeft(scrollLeft) {
    this.scrollLeft = scrollLeft;
  }

  testS() {
    console.log('test en app.component');
  }

  testClick() {
    console.log('testing click');
  }

}
