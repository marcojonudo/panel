import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";

@Component({
	selector: 'app-helper-card',
	templateUrl: './helper-card.component.html',
	styleUrls: ['./helper-card.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelperCardComponent {

	@Input() card: Card;

	private readonly CARD_STATE_COLOR: any;
	private readonly VEHICLE_POSITION: any;
	private readonly PENDING_ICON_COLOR: any;
	private readonly MATERIAL_ICON_COLOR: any;

	constructor() {
		this.CARD_STATE_COLOR = {
			P: '#FF0000',
			E: '#008000',
			A: '#0CC4D6'
		};
		this.VEHICLE_POSITION = {
			GARAGE: 'T',
			PARKING: 'P'
		};
		this.PENDING_ICON_COLOR = {
			E: '#1d4999',
			A: '#1d4999',
			P: '#c25308'
		};
		this.MATERIAL_ICON_COLOR = {
			E: '#c25308',
			A: '#1d4999',
			P: '#c25308'
		}
	}

	findBackground(type: string): string {
		return Constants.CARD_TYPE_BACKGROUND[type] || Constants.CARD_TYPE_BACKGROUND['DEFAULT'];
	}

	checkFirstCard(linkedPrevious: Card): boolean {
		return !linkedPrevious;
	}

	checkLastCard(linkedNext: Card): boolean {
		return !linkedNext;
	}

	findVehiclePosition(position: string): string {
		return this.VEHICLE_POSITION[position];
	}

	checkShowCustomIcon(): boolean {
		return this.card.pending.call || this.card.pending.budget || this.card.pending.material != undefined;
	}

	findCustomIcon(): string {
		if (this.card.pending.call) {
			return 'phone';
		} else if (this.card.pending.budget) {
			return 'file-contract';
		} else if (this.card.pending.material != undefined) {
			return 'shopping-cart';
		}
		return undefined;
	}

	findCustomIconColor(): string {
		if (this.card.pending.call || this.card.pending.budget) {
			return this.PENDING_ICON_COLOR[this.card.order.state];
		}
		if (this.card.pending.material != undefined) {
			return this.card.pending.material ? this.MATERIAL_ICON_COLOR[this.card.order.state] : '#1ebf1e';
		}
	}

	getOrderStateColor(state: string): string {
		return this.CARD_STATE_COLOR[state];
	}

	checkShowLeftLinkHandler(card: Card): boolean {
		return CardsService.findLeftNextCard(card) != undefined;
	}

	checkShowRightLinkHandler(card: Card): boolean {
		return CardsService.findRightNextCard(card) != undefined;
	}

	findLinkImage(linkedCard: Card): string {
		return linkedCard ? Constants.LINK_HANDLER_IMAGE.JOINED : Constants.LINK_HANDLER_IMAGE.SPLITTED;
	}

	findBottomSectionBackground(divisionIndex: number, color: string) {
		return divisionIndex == 0 ? color : `repeating-linear-gradient(45deg, ${color}, ${color} 4px, #fff 4px, #fff 8px)`
	}

	check(): void {
		if (Constants.CHECK) {
			console.log('checking helper card', this.card);
		}
	}

}
