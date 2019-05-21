import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {TimeService} from "../../services/time.service";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {

  private mechanics: string[];

  constructor(private timeService: TimeService) {
    // this.mechanics = ['A', 'B', 'C'];
    this.mechanics = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
  }

  getTotalTimeWidth() {
    // console.log('grid ' + this.timeService.getTotalTimeWidth());
    return this.timeService.getTotalTimeWidth();
  }

}
