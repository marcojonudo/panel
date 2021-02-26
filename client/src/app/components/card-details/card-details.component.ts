import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";
import {NotificationService} from "../../services/notification.service";
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
		NotificationService.notifyLateralInfo(this.card.day, undefined, true);
	}

	checkVehiclePosition(vehiclePosition: string): boolean {
		return this.card.vehiclePosition == vehiclePosition;
	}

	updateVehiclePosition(vehiclePosition: string, card: Card = this.card): void {
		this.cardsService.updateVehiclePosition(card, vehiclePosition);
		this.cdRef.detectChanges();
	}

	updatePendingCall(pendingCall: boolean, card: Card = this.card): void {
		this.cardsService.updatePendingCall(card, pendingCall);
		this.cdRef.detectChanges();
	}

	updatePendingBudget(pendingBudget: boolean, card: Card = this.card): void {
		this.cardsService.updatePendingBudget(card, pendingBudget, true);
		this.cdRef.detectChanges();
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('Checking app card details', this.card);
		}
	}

}
