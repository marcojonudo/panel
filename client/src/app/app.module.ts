import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { BandComponent } from './components/band/band.component';
import { GridComponent } from './components/grid/grid.component';
import { MechanicLineComponent } from './components/mechanic-line/mechanic-line.component';
import { MechanicInfoComponent } from './components/mechanic-info/mechanic-info.component';
import { MechanicLineContainerComponent } from './components/mechanic-line-container/mechanic-line-container.component';
import { TimelineContainerComponent } from './components/timeline-container/timeline-container.component';

import { ToolsPanelComponent } from './components/tools-panel/tools-panel.component';
import { AppointmentsPanelComponent } from './components/appointments-panel/appointments-panel.component';
import { ToolsButtonsComponent } from './components/tools-buttons/tools-buttons.component';
import { DayPanelComponent } from './components/day-panel/day-panel.component';
import { DimensionSlidersComponent } from './components/dimension-sliders/dimension-sliders.component';

import { TimeService } from "./services/time.service";
import { DaysPanelsService } from "./services/days-panels.service";

import { DaysPipe } from './pipes/days.pipe'

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { GridsterModule } from "angular-gridster2";

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    BandComponent,
    GridComponent,
    MechanicLineComponent,
    MechanicInfoComponent,
    MechanicLineContainerComponent,
    TimelineContainerComponent,
    ToolsPanelComponent,
    AppointmentsPanelComponent,
    ToolsButtonsComponent,
    DayPanelComponent,
    DimensionSlidersComponent,
    DaysPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    ScrollingModule,
    GridsterModule
  ],
  providers: [
    TimeService,
    DaysPanelsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
