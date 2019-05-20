import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TimeService} from "../../services/time.service";
import 'hammerjs'
import {MatSliderChange} from "@angular/material";

@Component({
  selector: 'app-dimension-sliders',
  templateUrl: './dimension-sliders.component.html',
  styleUrls: ['./dimension-sliders.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionSlidersComponent implements OnInit {

  private min: number;
  private max: number;

  constructor(private timeService: TimeService) {
    this.min = this.timeService.getMinWidthValue();
    this.max = this.timeService.getMaxWidthValue();
  }

  ngOnInit() {
  }

  private updateWidthValue(event: any) {
    console.log(event);
    // console.log(this.max - (event.value - this.min));
    console.log('update width value');
    // this.timeService.setWidthValue(this.max - (event.value - this.min));
    this.timeService.setWidthValue(this.max - (event - this.min));
  }

  mouseEnterTest() {
    console.log('HOLA');
  }

  testDimensionsSliders() {
    console.log('Dimension sliders');
  }
}
