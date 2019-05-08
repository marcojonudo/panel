import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { BandComponent } from './components/band/band.component';
import { GridComponent } from './components/grid/grid.component';
import { MechanicLineComponent } from './components/mechanic-line/mechanic-line.component';
import { AppointmentsPanelComponent } from './components/appointments-panel/appointments-panel.component';
import { MechanicInfoComponent } from './components/mechanic-info/mechanic-info.component';
import { DayContainerComponent } from './components/day-container/day-container.component';
import { MechanicLineContainerComponent } from './components/mechanic-line-container/mechanic-line-container.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    BandComponent,
    GridComponent,
    MechanicLineComponent,
    AppointmentsPanelComponent,
    MechanicInfoComponent,
    DayContainerComponent,
    MechanicLineContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
