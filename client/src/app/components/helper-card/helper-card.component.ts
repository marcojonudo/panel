import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Card} from "../../objects/card";
import {CardPositionService} from "../../services/card-position.service";

@Component({
  selector: 'app-helper-card',
  templateUrl: './helper-card.component.html',
  styleUrls: ['./helper-card.component.css']
})
export class HelperCardComponent implements OnInit {

  @Input() card: Card;

  private coordinatesSubscription: any;
  private draggingSubscription: any;

  constructor(
    private cardPositionService: CardPositionService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.coordinatesSubscription = this.cardPositionService.coordinates$.subscribe( coordinates => {
    //   console.log('reciving coor helper card', coordinates);
    //   this.cdRef.detectChanges();
    // });
    // this.draggingSubscription = this.cardPositionService.dragging$.subscribe( dragging => {
    //   if (!dragging) {
    //     console.log('overlay detecting changes in dragging');
    //     this.cdRef.detectChanges();
    //   }
    // });
  }

  check(): void {
    // console.log('checking helper card');
  }

}
