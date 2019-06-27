import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {GridsterConfig, GridsterItem} from "angular-gridster2";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-mechanic-line-container',
  templateUrl: './mechanic-line-container.component.html',
  styleUrls: ['./mechanic-line-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicLineContainerComponent {

  constructor() { }

  @Input() mechanic: string;
  // @Input() cards: any[];
  @Input() day: string;

  check() {
    console.log('checking mechanic line container', this.mechanic, this.day)
  }
}
