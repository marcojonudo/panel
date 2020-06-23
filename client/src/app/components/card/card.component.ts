import {
	Component,
	Input, OnInit,
} from '@angular/core';
import {Card} from "../../objects/card";
import {Constants} from "../../objects/constants";
import {CardsService} from "../../services/cards.service";
import {UnassignedCardLinkHandler} from "../../objects/card-links/unassigned-card-link-handler";
import {AssignedCardLinkHandler} from "../../objects/card-links/assigned-card-link-handler";
import {Dayjs} from "dayjs";
import {MechanicsService} from "../../services/mechanics.service";
import {CardsGroup} from "../../objects/cards-group";
import {UtilsService} from "../../services/utils.service";
import {CardLinkHandler} from "../../objects/card-links/card-link-handler";
import {LeftCardLinkHandler} from "../../objects/card-links/side/left-card-link-handler";
import {RightCardLinkHandler} from "../../objects/card-links/side/right-card-link-handler";

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

	@Input() card: Card;
	@Input() width: number;

	private readonly CARD_STATE_COLOR: any;
	private readonly VEHICLE_POSITION: any;
	private readonly PENDING_ICON_COLOR: any;
	private readonly MATERIAL_ICON_COLOR: any;

	dividedPrevious: Card;
	dividedNext: Card;

	linkHandler: CardLinkHandler;

	constructor(private cardsService: CardsService) {
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

	ngOnInit(): void {
		this.linkHandler = this.card.day ? new AssignedCardLinkHandler() : new UnassignedCardLinkHandler();
	}

	checkFirstCard(linkedPrevious: Card): boolean {
		return !linkedPrevious;
	}

	checkLastCard(linkedNext: Card): boolean {
		return !linkedNext;
	}

	getOrderStateColor(state: string): string {
		return this.CARD_STATE_COLOR[state];
	}

	findVehiclePosition(position: string): string {
		return this.VEHICLE_POSITION[position];
	}

	checkShowLeftDivisionInfo(mechanicCode: string, dividedPrevious: Card): boolean {
		const show = dividedPrevious != undefined;
		if (show) {
			this.dividedPrevious = CardsService.findCard(dividedPrevious.panelId);
			return mechanicCode != this.dividedPrevious.mechanicCode;
		}
		return show;
	}

	checkShowRightDivisionInfo(mechanicCode: string, dividedNext: Card): boolean {
		const show = dividedNext != undefined;
		if (show) {
			this.dividedNext = CardsService.findCard(dividedNext.panelId);
			return mechanicCode != this.dividedNext.mechanicCode;
		}
		return show;
	}

	findDividedPosition(dividedCard: Card): string {
		return MechanicsService.findMechanic(dividedCard.day, dividedCard.mechanicCode).panelPosition;
	}

	checkArrowDirection(card: Card, dividedCard: Card) {
		const mechanicPosition = MechanicsService.findMechanic(card.day, card.mechanicCode).panelPosition;
		const dividedMechanicPosition = MechanicsService.findMechanic(
			dividedCard.day, dividedCard.mechanicCode
		).panelPosition;
		if (mechanicPosition > dividedMechanicPosition) {
			return 'up';
		} else if (mechanicPosition < dividedMechanicPosition) {
			return 'down';
		} else {
			return card.start.isBefore(dividedCard.start) ? 'right' : 'left';
		}
	}

	checkShowLinkedLeftArrow(
		id: string,
		day: Dayjs,
		divisionIndex: number,
		linkedPrevious: Card,
		orderNumber: number
	): boolean {
		if (linkedPrevious || !day || divisionIndex != 0) {
			return false;
		}
		const orderGroups = UtilsService.sort(
			CardsService.findOrderGroups(CardsService.assignedGroups, orderNumber),
			(g: CardsGroup) => g.start
		);
		const groupIndex = orderGroups.findIndex((g: CardsGroup) =>
			g.cards.find((c: Card) => c.panelId == id) != undefined
		);
		return groupIndex > 0;
	}

	checkShowLinkedRightArrow(
		id: string,
		day: Dayjs,
		divisionIndex: number,
		linkedNext: Card,
		orderNumber: number
	) {
		if (linkedNext || !day || divisionIndex != 0) {
			return false;
		}
		const orderGroups = UtilsService.sort(
			CardsService.findOrderGroups(CardsService.assignedGroups, orderNumber),
			(g: CardsGroup) => g.start
		);
		const groupIndex = orderGroups.findIndex((g: CardsGroup) =>
			g.cards.find((c: Card) => c.panelId == id) != undefined
		);
		return groupIndex < orderGroups.length - 1;
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

	findBackground(type: string): string {
		return Constants.CARD_TYPE_BACKGROUND[type] || Constants.CARD_TYPE_BACKGROUND['DEFAULT'];
	}

	findBottomSectionBackground(divisionIndex: number, color: string) {
		return divisionIndex == 0 ? color : `repeating-linear-gradient(45deg, ${color}, ${color} 4px, #fff 4px, #fff 8px)`
	}

	findLinkedArrowColor(divisionIndex: number): string {
		return divisionIndex == 0 ? Constants.COLOR.WHITE : Constants.COLOR.BLACK;
	}

	// region Link handlers

	checkShowLeftLinkHandler(card: Card, handler: CardLinkHandler = this.linkHandler): boolean {
		return card.linkedPrevious ? true : CardsService.checkShowHandler(
			card,
			handler.findNextGroup(card, new LeftCardLinkHandler())
		);
	}

	checkShowRightLinkHandler(card: Card, handler: CardLinkHandler = this.linkHandler): boolean {
		return card.linkedNext ? true: CardsService.checkShowHandler(
			card,
			handler.findNextGroup(card, new RightCardLinkHandler())
		);
	}

	findLinkImage(linkedCard: Card): string {
		return linkedCard ? Constants.LINK_HANDLER_IMAGE.JOINED : Constants.LINK_HANDLER_IMAGE.SPLITTED;
	}

	handlePreviousLink(card: Card, handler: CardLinkHandler = this.linkHandler): void {
		const sideLinkHandler = new LeftCardLinkHandler();
		const cardsToUpdate = card.linkedPrevious
			? handler.unlink(card, sideLinkHandler) : handler.link(card, sideLinkHandler);
		this.cardsService.updateDbCardsLinks(cardsToUpdate);
	}

	handleNextLink(card: Card, handler: CardLinkHandler = this.linkHandler): void {
		const sideLinkHandler = new RightCardLinkHandler();
		const cardsToUpdate = card.linkedNext
			? handler.unlink(card, sideLinkHandler) : handler.link(card, sideLinkHandler);
		this.cardsService.updateDbCardsLinks(cardsToUpdate)
	}

	// endregion

	check() {
		if (Constants.CHECK) {
			console.log('checking card', this.card.panelId, this.card.start);
		}
	}

}
