import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {DaysService} from "../../services/days.service";

@Component({
  selector: 'app-mechanic-info',
  templateUrl: './mechanic-info.component.html',
  styleUrls: ['./mechanic-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MechanicInfoComponent {

  @Input() mechanic: string;

  constructor(private daysService: DaysService) { }

  check() {
    //console.log('-------- Mechanic info')
  }

  get oneDayMode$() {
    return this.daysService.oneDayMode$;
  }

}
