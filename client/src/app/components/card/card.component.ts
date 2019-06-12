import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() card: any;
  @Output() clickedEmitter: EventEmitter<boolean>;

  constructor(private cardPositionService: CardPositionService) {
    this.clickedEmitter = new EventEmitter()
  }

  get helperCard$() {
    return this.cardPositionService.helperCard$;
  }

}
