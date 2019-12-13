import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {DaysService} from "../../services/days.service";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {UnassignedCardUpdateTrigger} from "../../objects/update-cards/unassigned-card-update-trigger";
import {NotificationService} from "../../services/notification.service";

@Component({
	selector: 'app-tools-bar',
	templateUrl: './tools-bar.component.html',
	styleUrls: ['./tools-bar.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent {

	private _showingFinished: boolean;

	constructor(
		private daysService: DaysService,
		private cardsService: CardsService
	) {
		this.showingFinished = false;
	}

	// region Getters / setters

	get toolsBarWidth(): number {
		return Constants.VALUE.TOOLS_BAR_WIDTH;
	}

	get finishDropzoneType(): string {
		return Constants.DROPZONE_TYPE.FINISH;
	}

	get showingFinished(): boolean {
		return this._showingFinished;
	}

	set showingFinished(value: boolean) {
		this._showingFinished = value;
	}

	// endregion

	toggleDayMode(): void {
		this.daysService.toggleDayMode();
	}

	showFinishedCardsBar(): void {
		const unassignedCardUpdate = new UnassignedCardUpdateTrigger(
			undefined,
			this.showingFinished ? this.cardsService.unassignedSections[0].name : Constants.CARD_STATUS.FINISHED
		);
		NotificationService.notifyBar(unassignedCardUpdate);
		this.showingFinished = !this.showingFinished;
	}

}
