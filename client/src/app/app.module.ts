import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { BandComponent } from './components/band/band.component';
import { GridComponent } from './components/grid/grid.component';
import { MechanicLineComponent } from './components/mechanic-line/mechanic-line.component';
import { MechanicInfoComponent } from './components/mechanic-info/mechanic-info.component';
import { DayContainerComponent } from './components/day-container/day-container.component';
import { MechanicLineContainerComponent } from './components/mechanic-line-container/mechanic-line-container.component';
import { TimelineContainerComponent } from './components/timeline-container/timeline-container.component';
import { TimeService } from "./services/time.service";

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToolsPanelComponent } from './components/tools-panel/tools-panel.component';
import { AppointmentsPanelComponent } from './components/appointments-panel/appointments-panel.component';
import { ToolsButtonsComponent } from './components/tools-buttons/tools-buttons.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    BandComponent,
    GridComponent,
    MechanicLineComponent,
    MechanicInfoComponent,
    DayContainerComponent,
    MechanicLineContainerComponent,
    TimelineContainerComponent,
    ToolsPanelComponent,
    AppointmentsPanelComponent,
    ToolsButtonsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [
    TimeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
