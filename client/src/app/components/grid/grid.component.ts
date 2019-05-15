import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  mechanics: string[];

  constructor() {
    this.mechanics = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
  }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    console.log(event.previousIndex);
    console.log(event.currentIndex);
    moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
  }

}
