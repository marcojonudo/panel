import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridsterConfig, GridsterItem} from "angular-gridster2";

@Component({
  selector: 'app-mechanic-line-container',
  templateUrl: './mechanic-line-container.component.html',
  styleUrls: ['./mechanic-line-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent {

  constructor() { }

  @Input() mechanic: string;

  // ngOnInit() {
  // }

  // options: GridsterConfig;
  // dashboard: Array<GridsterItem>;
  //
  // static itemChange(item, itemComponent) {
  //   console.info('itemChanged', item, itemComponent);
  // }
  //
  // static itemResize(item, itemComponent) {
  //   console.info('itemResized', item, itemComponent);
  // }
  //
  // ngOnInit() {
  //   this.options = {
  //     minCols: 100,
  //     maxCols: 100,
  //     minRows: 2,
  //     maxRows: 2,
  //     displayGrid: 'always'
  //   };
  //
  //   this.dashboard = [
  //     {cols: 2, rows: 1, y: 0, x: 0},
  //     {cols: 2, rows: 2, y: 0, x: 2}
  //   ];
  // }

  // changedOptions() {
  //   this.options.api.optionsChanged();
  // }
  //
  // removeItem(item) {
  //   this.dashboard.splice(this.dashboard.indexOf(item), 1);
  // }
  //
  // addItem() {
  //   this.dashboard.push({});
  // }

  check() {
    console.log('------ Mechanic line container')
  }
}
