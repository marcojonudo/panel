import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent {

  constructor(private cardPositionService: CardPositionService) { }

  get helperCard$() {
    return this.cardPositionService.helperCard$;
  }

  check(): void {
    console.log('checking overlay');
  }

}
