import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";
import {Card} from "../../objects/card";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() card: Card;

  constructor() { }

  check() {
    console.log('checking card', this.card.id);
  }

}
