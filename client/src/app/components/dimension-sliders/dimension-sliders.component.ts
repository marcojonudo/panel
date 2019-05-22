import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TimeService} from "../../services/time.service";

@Component({
  selector: 'app-dimension-sliders',
  templateUrl: './dimension-sliders.component.html',
  styleUrls: ['./dimension-sliders.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionSlidersComponent {

  private min: number;
  private max: number;

  constructor(private timeService: TimeService) {
    this.min = this.timeService.getMinWidthValue();
    this.max = this.timeService.getMaxWidthValue();
  }

  private updateWidth(value: number) {
    this.timeService.setWidthValue(this.max - (value - this.min));
  }

}
