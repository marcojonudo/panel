import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {TimeService} from "../../services/time.service";
import {DaysService} from "../../services/days.service";
import {MechanicsService} from "../../services/mechanics.service";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {

  // @Input() dayCards: any[];
  // @Input() day: string;

  private mechanics: string[];

  constructor(
    private daysService: DaysService,
    private mechanicsService: MechanicsService,
    private cardsService: CardsService
  ) {
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

  // get unassignedCardsDay$() {
  //   return this.cardsService.unassignedCardsDays$;
  // }

  check() {
    console.log('checking grid');
  }

}
