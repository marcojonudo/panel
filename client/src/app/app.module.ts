import {BrowserModule, EventManager} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {BandComponent} from './components/band/band.component';
import {GridComponent} from './components/grid/grid.component';
import {MechanicLineComponent} from './components/mechanic-line/mechanic-line.component';
import {MechanicInfoComponent} from './components/mechanic-info/mechanic-info.component';
import {MechanicLineContainerComponent} from './components/mechanic-line-container/mechanic-line-container.component';
import {TimelineContainerComponent} from './components/timeline-container/timeline-container.component';

import {ToolsPanelComponent} from './components/tools-panel/tools-panel.component';
import {AppointmentsPanelComponent} from './components/appointments-panel/appointments-panel.component';
import {ToolsButtonsComponent} from './components/tools-buttons/tools-buttons.component';
import {DayPanelComponent} from './components/day-panel/day-panel.component';
import {DimensionSlidersComponent} from './components/dimension-sliders/dimension-sliders.component';

import {TimeService} from "./services/time.service";
import {DaysPanelsService} from "./services/days-panels.service";

import {DaysPipe} from './pipes/days.pipe'

import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from "@angular/cdk/scrolling";

import {CardComponent} from './components/card/card.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AngularDraggableModule} from "angular2-draggable";
import {DraggableDirective} from './directives/draggable.directive'
import {OverlayModule} from "@angular/cdk/overlay";
import {MovableDirective} from './directives/movable.directive';
import {ScrollableDirective} from './directives/scrollable.directive';
import {DropzoneDirective} from './directives/dropzone.directive';
import {OverlayComponent} from './components/overlay/overlay.component';
import {MainComponent} from './components/main/main.component';
import {HelperCardComponent} from './components/helper-card/helper-card.component';
import {ResizableDirective} from './directives/resizable.directive';

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
		DaysPipe,
		CardComponent,
		DraggableDirective,
		MovableDirective,
		ScrollableDirective,
		DropzoneDirective,
		OverlayComponent,
		MainComponent,
		HelperCardComponent,
		ResizableDirective
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		DragDropModule,
		ScrollingModule,
		BrowserAnimationsModule,
		AngularDraggableModule,
		OverlayModule
	],
	providers: [
		TimeService,
		DaysPanelsService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
