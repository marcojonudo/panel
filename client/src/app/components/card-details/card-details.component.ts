import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";
import {NotificationService} from "../../services/notification.service";
import {DayLateralPanelInfo} from "../../objects/lateral-panel-info/day-lateral-panel-info";
import {HttpClient} from "@angular/common/http";
import {CardsService} from "../../services/cards.service";

@Component({
	selector: 'app-card-details',
	templateUrl: './card-details.component.html',
	styleUrls: ['./card-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDetailsComponent {

	@Input() card: Card;

	constructor(
		private cardsService: CardsService,
		private cdRef: ChangeDetectorRef
	) {}

	// region Getters / setters

	get garagePosition(): string {
		return Constants.VEHICLE_POSITION.GARAGE;
	}

	get parkingPosition(): string {
		return Constants.VEHICLE_POSITION.PARKING;
	}

	// endregion

	findStateName(state: string): string {
		return Constants.ORDER_STATE_NAME[state];
	}

	closePanel(): void {
		NotificationService.notifyLateralInfo(new DayLateralPanelInfo(this.card.day, undefined));
	}

	checkVehiclePosition(vehiclePosition: string): boolean {
		return this.card.vehiclePosition == vehiclePosition;
	}

	findVehiclePositionValue(vehiclePosition: string): string {
		return this.card.vehiclePosition == vehiclePosition ? undefined : vehiclePosition;
	}

	updateVehiclePosition(vehiclePosition: string): void {
		this.card.vehiclePosition = this.findVehiclePositionValue(vehiclePosition);
		this.cardsService.updateVehiclePosition(this.card);
		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.HIGHLIGHT_CARDS,
			this.card.day,
			this.card.mechanicCode
		);
		this.cdRef.detectChanges();
	}

	updatePendingCall(pendingCall: boolean): void {
		this.card.pending.call = pendingCall;
		this.cardsService.updatePendingCall(this.card);
		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.HIGHLIGHT_CARDS,
			this.card.day,
			this.card.mechanicCode
		);
		this.cdRef.detectChanges();
	}

	updatePendingBudget(pendingBudget: boolean): void {
		this.card.pending.budget = pendingBudget;
		this.cardsService.updatePendingBudget(this.card);
		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.HIGHLIGHT_CARDS,
			this.card.day,
			this.card.mechanicCode
		);
		this.cdRef.detectChanges();
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('Checking app card details', this.card);
		}
	}

}
