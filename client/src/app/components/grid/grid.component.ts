import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {

  mechanics: string[];

  constructor() {
    this.mechanics = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
  }

}
