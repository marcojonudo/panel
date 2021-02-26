import {RealTimeUpdate} from "./real-time-update";
import {Card} from "../card";
import {RealTimeService} from "../../services/real-time.service";
import {SyncCardsInfo} from "../sync-cards-info";
import {AppointmentDay} from "../appointments/appointment-day";

export class RealTimeSyncJpdv extends RealTimeUpdate {

	private realTimeService: RealTimeService;
	private readonly syncCardsInfo: SyncCardsInfo;

	constructor(realTimeService: RealTimeService, updateInfo: any) {
		super();
		this.realTimeService = realTimeService;
		this.syncCardsInfo = new SyncCardsInfo(
			updateInfo.newCards ? updateInfo.newCards.map(card => new Card(card, false)): [],
			updateInfo.newReplace ? updateInfo.newReplace.map(card => new Card(card, false)): [],
			updateInfo.reset ? updateInfo.reset.map(card => new Card(card, false)): [],
			updateInfo.updated ? updateInfo.updated.map(card => new Card(card, false)): [],
			updateInfo.deleted ? updateInfo.deleted.map(card => new Card(card, false)): [],
			updateInfo.appointmentDays ? updateInfo.appointmentDays.map(appointmentDay => new AppointmentDay(appointmentDay)) : []
		);
	}

	update(): void {
		this.realTimeService.syncJpdvCards(this.syncCardsInfo);
	}

}
