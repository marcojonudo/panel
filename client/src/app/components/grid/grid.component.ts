import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";

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

  constructor(private daysService: DaysService) {
    // this.mechanics = ['A', 'B', 'C'];
    this.mechanics = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
  }

  get oneDayMode$() {
    return this.daysService.oneDayMode$;
  }

  check() {
    console.log('---- Grid')
  }

}
