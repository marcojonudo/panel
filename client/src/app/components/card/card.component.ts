import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() card: any;

  constructor(private cardPositionService: CardPositionService) { }

  get helperCard$() {
    return this.cardPositionService.helperCard$;
  }

  check() {
    console.log('checking card');
  }

}
