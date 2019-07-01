import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {DaysService} from "../../services/days.service";
import {Constants} from "../../objects/constants";
import {Mechanic} from "../../objects/mechanic";
import {CardsService} from "../../services/cards.service";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() day: string;

  private _mechanics: Mechanic[];

  private mechanicsSubscription: any;

  constructor(
    private daysService: DaysService,
    private cardsService: CardsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.mechanicsSubscription = this.daysService.daysMechanics$[this.day].subscribe(mechanics => {
      this.mechanics = mechanics;
    });
    console.log('not on initias faisjdfpoaisdjfpoaidsf');
  }

  ngAfterViewInit(): void {
    console.log('**********************************');
    this.cardsService.initDimensions();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.mechanicsSubscription.unsubscribe();
  }

  get mechanics(): Mechanic[] {
    return this._mechanics;
  }

  set mechanics(value: Mechanic[]) {
    this._mechanics = value;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
  }

  get lineHeight$() {
    return this.daysService.lineHeight$;
  }

  check() {
    console.log('checking grid');
  }

}
