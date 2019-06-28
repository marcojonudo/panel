import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";
import {animate, animateChild, query, stagger, style, transition, trigger} from "@angular/animations";
import {Card} from "../../objects/card";
import {DaysService} from "../../services/days.service";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnInit, OnDestroy {

  private coordinatesSubscription: any;
  private draggingSubscription: any;
  private helperCardSubscription: any;

  private helperCard: Card;

  constructor(
    private cardPositionService: CardPositionService,
    private daysService: DaysService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.coordinatesSubscription = this.cardPositionService.coordinates$.subscribe( coordinates => {
      this.cdRef.detectChanges();
    });
    this.draggingSubscription = this.cardPositionService.dragging$.subscribe( dragging => {
      if (!dragging) {
        console.log('overlay detecting changes in dragging');
        this.cdRef.detectChanges();
      }
    });
    this.helperCardSubscription = this.cardPositionService.helperCard$.subscribe( helperCard => {
      this.helperCard = helperCard;
    })
  }

  ngOnDestroy(): void {
    this.coordinatesSubscription.unsubscribe();
    this.draggingSubscription.unsubscribe();
  }

  get lineHeight$() {
    return this.daysService.lineHeight$;
  }

  get dragging$() {
    return this.cardPositionService.dragging$;
  }

  check(): void {
    console.log('checking overlay');
  }

  test() {
    console.log('transition end', this.helperCard);
  }

}
