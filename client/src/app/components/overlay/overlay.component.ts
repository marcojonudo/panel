import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CardPositionService} from "../../services/card-position.service";
import {animate, animateChild, query, stagger, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnInit, OnDestroy {

  private coordinatesSubscription: any;
  private draggingSubscription: any;

  constructor(
    private cardPositionService: CardPositionService,
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
  }

  ngOnDestroy(): void {
    this.coordinatesSubscription.unsubscribe();
    this.draggingSubscription.unsubscribe();
  }

  get helperCard$() {
    return this.cardPositionService.helperCard$;
  }

  get dragging$() {
    return this.cardPositionService.dragging$;
  }

  check(): void {
    console.log('checking overlay');
  }

  test() {
    console.log('transition end');
  }

}
