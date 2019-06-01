import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import interact from "interactjs";
import {Observable} from "rxjs/internal/Observable";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() width: number;
  @Output() clickedEmitter: EventEmitter<boolean>;

  constructor() {
    this.clickedEmitter = new EventEmitter()
  }

}
