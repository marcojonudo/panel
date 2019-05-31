import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";
import {MechanicsService} from "../../services/mechanics.service";
import {Constants} from "../../objects/constants";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {

  LINE_HEIGHT_DEFAULT: number = 80;
  LINE_HEIGHT_NARROW: number = 50;

  private mechanics: string[];

  constructor(private daysService: DaysService, private mechanicsService: MechanicsService) {
    this.mechanics = this.mechanicsService.mechanics;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
  }

  get oneDayMode$() {
    return this.daysService.oneDayMode$;
  }

  get lineHeightDefault() {
    return Constants.VALUE.LINE_HEIGHT_DEFAULT;
  }

  get lineHeightNarrow() {
    return Constants.VALUE.LINE_HEIGHT_NARROW;
  }

  check() {
    // console.log('---- Grid')
  }

}
