import {RealTimeUpdate} from "./real-time-update";
import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";
import {SyncCardsInfo} from "../sync-cards-info";

export class RealTimeSyncJpdv extends RealTimeUpdate {

	private realTimeService: RealTimeService;
	private readonly syncCardsInfo: SyncCardsInfo;

	constructor(realTimeService: RealTimeService, updateInfo: any) {
		super();
		this.realTimeService = realTimeService;
		this.syncCardsInfo = new SyncCardsInfo(
			updateInfo.newCards ? updateInfo.newCards.map(card => new Card(card, false)) : [],
			updateInfo.updatedCards ? updateInfo.updatedCards.map(card => new Card(card, false)) : [],
			updateInfo.deletedCards ? updateInfo.deletedCards.map(card => new Card(card, false)) : []
		);
	}

	update(): void {
		this.realTimeService.syncJpdvCards(this.syncCardsInfo);
	}

}
