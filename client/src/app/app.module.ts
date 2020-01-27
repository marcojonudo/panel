import {BrowserModule} from '@angular/platform-browser';
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

import {DayInfoPanelComponent} from './components/day-info-panel/day-info-panel.component';
import {AppointmentsPanelComponent} from './components/appointments-panel/appointments-panel.component';
import {DayPanelComponent} from './components/day-panel/day-panel.component';
import {DimensionSlidersComponent} from './components/dimension-sliders/dimension-sliders.component';

import {DaysPipe} from './pipes/days.pipe'

import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from "@angular/cdk/scrolling";

import {CardComponent} from './components/card/card.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AngularDraggableModule} from "angular2-draggable";
import {ClickableCardDirective} from './directives/clickable-card.directive'
import {OverlayModule} from "@angular/cdk/overlay";
import {MovableDirective} from './directives/movable.directive';
import {ScrollableDirective} from './directives/scrollable.directive';
import {DropzoneDirective} from './directives/dropzone.directive';
import {OverlayComponent} from './components/overlay/overlay.component';
import {MainComponent} from './components/main/main.component';
import {HelperCardComponent} from './components/helper-card/helper-card.component';
import {DraggableGroupComponent} from './components/draggable-group/draggable-group.component';
import {HelperDraggableGroupComponent} from './components/helper-draggable-group/helper-draggable-group.component';
import {ResizableLineDirective} from './directives/resizable-line.directive';
import {ResizableCardDirective} from './directives/resizable-card.directive';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SpinnerComponent} from './components/spinner/spinner.component';
import {FormsModule} from "@angular/forms";
import {ToolsBarComponent} from './components/tools-bar/tools-bar.component';
import {SkillsDetailsComponent} from './components/skills-details/skills-details.component';
import {UtilsService} from "./services/utils.service";
import {SessionIdInterceptor} from "./interceptors/session-id-interceptor";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AppointmentSchedulePanelComponent} from './components/appointment-schedule-panel/appointment-schedule-panel.component';
import {DraggableScheduleDirective} from './directives/draggable-schedule.directive';
import {AppointmentsPipe} from './pipes/appointments.pipe';
import {CardSectionPipe} from './pipes/card-section.pipe';
import {CardDetailsComponent} from './components/card-details/card-details.component';
import {CardContextMenuComponent} from './components/card-context-menu/card-context-menu.component';
import {HorizontalScrollableDirective} from './directives/horizontal-scrollable.directive';
import {MechanicsPipe} from './pipes/mechanics.pipe';

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
		DayInfoPanelComponent,
		AppointmentsPanelComponent,
		DayPanelComponent,
		DimensionSlidersComponent,
		DaysPipe,
		CardComponent,
		ClickableCardDirective,
		MovableDirective,
		ScrollableDirective,
		DropzoneDirective,
		OverlayComponent,
		MainComponent,
		HelperCardComponent,
		DraggableGroupComponent,
		HelperDraggableGroupComponent,
		ResizableLineDirective,
		ResizableCardDirective,
		SpinnerComponent,
		ToolsBarComponent,
		SkillsDetailsComponent,
		AppointmentSchedulePanelComponent,
		DraggableScheduleDirective,
		AppointmentsPipe,
		CardSectionPipe,
		CardDetailsComponent,
		CardContextMenuComponent,
		HorizontalScrollableDirective,
		MechanicsPipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		DragDropModule,
		ScrollingModule,
		BrowserAnimationsModule,
		AngularDraggableModule,
		OverlayModule,
		HttpClientModule,
		FormsModule,
		NgbModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: SessionIdInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {

	constructor() {
		this.overrideDateToJSON();
	}

	private overrideDateToJSON() {
		Date.prototype.toJSON = function () {
			return UtilsService.isDate(this) ? this.getTime() : this.toLocaleTimeString();
		};
	}

}
