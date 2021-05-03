import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";
import {NotificationService} from "../../services/notification.service";
import {CardsService} from "../../services/cards.service";
import {OrderLine} from "../../objects/order-line";
import {Dayjs} from "dayjs";

@Component({
	selector: 'app-card-details',
	templateUrl: './card-details.component.html',
	styleUrls: ['./card-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDetailsComponent {

	@Input() card: Card;

	constructor(private cardsService: CardsService, private cdRef: ChangeDetectorRef) {}

	// region Getters / setters

	get garagePosition(): string {
		return Constants.VEHICLE_POSITION.GARAGE;
	}

	get parkingPosition(): string {
		return Constants.VEHICLE_POSITION.PARKING;
	}

	// endregion

	closePanel(): void {
		NotificationService.notifyLateralInfo(this.card.day, undefined, true);
	}

	checkVehiclePosition(vehiclePosition: string, card: Card = this.card): boolean {
		return card && card.vehiclePosition == vehiclePosition;
	}

	checkPendingCall(card: Card = this.card): boolean {
		return card && card.pending.call;
	}

	checkPendingBudget(card: Card = this.card): boolean {
		return card && card.pending.budget;
	}

	findClientName(card: Card = this.card): string {
		return card ? card.client.name : undefined;
	}

	findClientSurnames(card: Card = this.card): string {
		return card ? card.client.surnames : undefined;
	}

	findClientPhoneNumber(card: Card = this.card): number {
		return card ? card.client.phoneNumber : undefined;
	}

	findVehicleNumberPlate(card: Card = this.card): string {
		return card ? card.vehicle.numberPlate : undefined;
	}

	findVehicleBrand(card: Card = this.card): string {
		return card ? card.vehicle.brand : undefined;
	}

	findVehicleModel(card: Card = this.card): string {
		return card ? card.vehicle.model : undefined;
	}

	findVehicleCylinder(card: Card = this.card): string {
		return card ? card.vehicle.cylinder : undefined;
	}

	findVehicleColor(card: Card = this.card): string {
		return card ? card.vehicle.color : undefined;
	}

	findOrderCreated(card: Card = this.card): Dayjs {
		return card ? card.order.created : undefined;
	}

	findOrderDeadline(card: Card = this.card): Dayjs {
		return card ? card.order.deadline : undefined;
	}

	findOrderNumber(card: Card = this.card): number {
		return card ? card.order.number : undefined;
	}

	findOrderCode(card: Card = this.card): string {
		return card ? card.order.code : undefined;
	}

	findStateName(card: Card = this.card): string {
		return card ? Constants.ORDER_STATE_NAME[card.order.state] : undefined;
	}

	findOrderLines(card: Card = this.card): OrderLine[] {
		return card ? card.order.lines : [];
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
