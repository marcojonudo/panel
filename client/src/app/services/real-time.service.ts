import {Injectable} from '@angular/core';
import {Card} from "../objects/card";
import {CardsService} from "./cards.service";
import {Mechanic} from "../objects/mechanic";
import {RealTimeUpdateInfo} from "../objects/real-time-update/real-time-update-info";
import {AppointmentsService} from "./appointments.service";
import {NotificationService} from "./notification.service";
import {CardsGroup} from "../objects/cards-group";
import {DimensionsService} from "./dimensions.service";
import {MechanicsService} from "./mechanics.service";
import {UnassignedCardLinkHandler} from "../objects/card-links/unassigned-card-link-handler";
import {AssignedCardLinkHandler} from "../objects/card-links/assigned-card-link-handler";
import {Dayjs} from "dayjs";
import {SyncCardsInfo} from "../objects/sync-cards-info";
import {Url} from "../objects/url";
import {UnassignedCardDurationHandler} from "../objects/card-duration/unassigned-card-duration-handler";
import {AssignedCardDurationHandler} from "../objects/card-duration/assigned-card-duration-handler";
import {RightCardLinkHandler} from "../objects/card-links/side/right-card-link-handler";
import {DropzoneService} from "./dropzone.service";
import {AppointmentDay} from "../objects/appointments/appointment-day";
import {Constants} from "../objects/constants";
import {MechanicAppointment} from "../objects/mechanic-appointment";
import * as dayjs from "dayjs";
import {UtilsService} from "./utils.service";

@Injectable({
	providedIn: 'root'
})
export class RealTimeService {

	static sessionId: string;

	constructor(private cardsService: CardsService, private mechanicsService: MechanicsService) {
		this.connectUpdatePublisher();
	}

	connectUpdatePublisher(): void {
		const eventSource = new EventSource(Url.publisher());
		eventSource.onmessage = event => {
			if (event.lastEventId != RealTimeService.sessionId) {
				const updateInfo: RealTimeUpdateInfo = JSON.parse(event.data);
				console.log('Received update info:', updateInfo);
				this.executeRealTimeUpdate(updateInfo.action, updateInfo.content);
			}
		};
	}

	executeRealTimeUpdate(action: string, content: any): void {
		switch (action) {
			case Constants.REAL_TIME_ACTION.CREATE_MECHANIC_APPOINTMENT:
				this.createMechanicAppointment(content);
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_MECHANIC_APPOINTMENT:
				this.updateMechanicAppointment(content);
				break;
			case Constants.REAL_TIME_ACTION.DELETE_MECHANIC_APPOINTMENT:
				this.deleteMechanicAppointment(content);
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_CARDS_POSITION:
				this.updateCardsPosition(content.cards.map(c => new Card(c)));
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_CARDS_DURATION:
				this.updateCardsDuration(content.cards.map(c => new Card(c)));
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_CARDS_LINKS:
				this.updateCardsLinks(content.cards.map(c => new Card(c)));
				break;
			case Constants.REAL_TIME_ACTION.RESET_CARDS_LINKS:
				this.resetCardsLinks(content.cards.map(c => new Card(c)));
				break;
			case Constants.REAL_TIME_ACTION.DELETE_CARDS:
				this.deleteCards(content.cards.map(c => new Card(c)));
				break;
			case Constants.REAL_TIME_ACTION.CREATE_CARDS:
				this.createCards(content.cards.map(c => new Card(c)));
				break;
			case Constants.REAL_TIME_ACTION.DIVIDE_CARDS:
				this.divideCards(content.cards.map(c => new Card(c)));
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_MECHANIC_JOB_LINE_TYPE:
				this.updateMechanicJobLineType(new Mechanic(content.mechanic));
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_MECHANIC_LINES:
				this.updateMechanicLines(new Mechanic(content.mechanic));
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_MECHANICS_POSITION:
				this.updateMechanicsPosition(content.mechanics.map(m => new Mechanic(m)));
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_CARD_VEHICLE_POSITION:
				this.updateCardVehiclePosition(new Card(content.card));
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_CARD_PENDING_CALL:
				this.updateCardPendingCall(new Card(content.card));
				break;
			case Constants.REAL_TIME_ACTION.UPDATE_CARD_PENDING_BUDGET:
				this.updateCardPendingBudget(new Card(content.card));
				break;
			case Constants.REAL_TIME_ACTION.SYNC_JPDV:
				this.syncJpdvCards(new SyncCardsInfo(content));
				break;
		}
	}

	// region Cards

	findGroups(card: Card, day: Dayjs, mechanicCode: string): CardsGroup[] {
		/* En función de si la ficha estaba asignada antes de moverse en otro terminal o no, se busca en los
		*  grupos asignados o en los de la cinta */
		return day ?
			CardsService.findDayMechanicGroups(day, mechanicCode) :
			CardsService.findUnassignedGroups(card.type, card.status);
	}

	findPanelCardGroup(cardId: string): CardsGroup {
		let group = CardsService.findCardGroup(CardsService.unassignedGroups, cardId);
		group = group ? group : CardsService.findCardGroup(CardsService.finishedGroups, cardId);
		return group ? group : CardsService.findCardGroup(CardsService.assignedGroups, cardId);
	}

	updateCardsPosition(cards: Card[]): void {
		const processedGroups = [];
		let originDropzone = undefined;
		let destinyDropzone = undefined;
		cards.forEach((card: Card) => {
			/* Para saber si el grupo estaba asignado antes de moverlo en otro terminal, se recorren primero los grupos
			*  no asignados (la mayoría de las veces habrá muchos menos, por lo que será más eficiente). No se puede
			*  buscar a partir del card.day, o card.mechanicCode, porque al haber cambiado la posición estos pueden
			*  ser nuevos (si se mueve una ficha del día 1 al día 2, en este panel (donde sigue en el día 1), no se
			*  va a encontrar en el día 2 */
			let group = this.findPanelCardGroup(card.panelId);

			const processedGroup = processedGroups.find((g: CardsGroup) => g.id == group.id);
			if (!processedGroup) {
				/* El grupo existente en panel antes de actualizar está en la posición de origen (la que tenía antes de
				*  actualizarse en otro terminal) */
				originDropzone = DropzoneService.findDropzone(group.cards[0]);
				destinyDropzone = DropzoneService.findDropzone(card, true);

				originDropzone.removeGroup(group);
				destinyDropzone.updateProperties(
					[group], card.start, card.line, destinyDropzone.mechanic
				);
				destinyDropzone.addRealTimeGroup(group);
				processedGroups.push(group);
			}
		});
		originDropzone.notify(false);
		if (destinyDropzone.type != originDropzone.type) {
			destinyDropzone.notify(false);
		}
	}

	updateCardsDuration(cards: Card[]): void {
		const allGroups = this.findGroups(cards[0], cards[0].day, cards[0].mechanicCode);

		let updatedDurationCard = undefined;
		const card = cards.find((card: Card) => {
			const group = CardsService.findCardGroup(allGroups, card.panelId);
			updatedDurationCard = group.cards.find((c: Card) => c.panelId == card.panelId);
			return updatedDurationCard != undefined;
		});
		/* Si después de modificar la duración en el terminal original se deja como estaba, no habrá ninguna ficha con
		*  la duración actualizada, por lo que no es necesario hacer nada*/
		if (card) {
			/* Si hay más de una ficha, la primera será la que tenga la duración actualizada, y el resto habrán sido
			*  desplazadas. En ese caso, se actualiza su posición */
			if (cards.length > 1) {
				const updatePositionIndex = cards.slice(1).findIndex((c: Card) => !c.linkedPrevious);
				if (updatePositionIndex != -1) {
					this.updateCardsPosition(cards.slice(1 + updatePositionIndex));
				}
			}

			const widthIncrease = DimensionsService.calcWidthFromDuration(
				card.duration - updatedDurationCard.duration
			);
			let mechanic, handler;
			if (updatedDurationCard.mechanicCode) {
				mechanic = MechanicsService.findMechanic(updatedDurationCard.day, updatedDurationCard.mechanicCode);
				handler = new AssignedCardDurationHandler();
			} else {
				handler = new UnassignedCardDurationHandler();
			}
			CardsService.handleCardDurationUpdate(updatedDurationCard, widthIncrease, mechanic, handler, false);
		}
	}

	updateCardsLinks(cards: Card[]): void {
		/* Al estar actualizando enlaces, sólo puede haber dos fichas: la de la izquierda y la de la derecha */
		const allGroups = this.findGroups(cards[0], cards[0].day, cards[0].mechanicCode);
		const leftCard = CardsService.findCardGroup(allGroups, cards[0].panelId).cards.find((c: Card) => {
			return c.panelId == cards[0].panelId
		});
		const linkHandler = leftCard.day ? new AssignedCardLinkHandler() : new UnassignedCardLinkHandler();
		/* Para agrupar o desagrupar fichas, se puede hacer por el lado izquierdo o el derecho. Se escoge uno al azar */
		const sideLinkHandler = new RightCardLinkHandler();

		/* Si la ficha de la izquierda tiene linkedNext, significa que ambas se están enlazando */
		if (cards[0].linkedNext) {
			linkHandler.link(leftCard, sideLinkHandler);
		} else {
			linkHandler.unlink(leftCard, sideLinkHandler);
		}
	}

	resetCardsLinks(cards: Card[]): void {
		const linkedGroups = CardsService.initAssignedGroups(cards);
		/* Al estar actualizando enlaces, sólo puede haber dos fichas: la de la izquierda y la de la derecha */
		const allGroups = this.findGroups(cards[0], cards[0].day, cards[0].mechanicCode);
		const group = CardsService.findCardGroup(allGroups, cards[0].panelId);
		const cardsToRemove = [];
		/* La posición 1 corresponde a aquel grupo que ha reemplazado fichas auxiliares */
		linkedGroups[1].cards.forEach((card: Card) => {
			cardsToRemove.push(group.cards.find((c: Card) => c.panelId == card.panelId));
		});
		CardsService.handleReplacementGroupUpdate(group, cardsToRemove);
		const newGroup = CardsService.handleReplacementGroupCreation(cardsToRemove);
		CardsService.addToUnassigned(newGroup, true);
	}

	deleteCards(cards: Card[]): void {
		let originDropzone = undefined;
		cards.forEach((card: Card) => {
			const group = this.findPanelCardGroup(card.panelId);
			if (group) {
				originDropzone = DropzoneService.findDropzone(group.cards[0]);
				originDropzone.removeGroup(group);
			}
		});
		originDropzone.notify(false);
	}

	divideCards(cards: Card[]): void {
		/* En el array de fichas, la primera es la dividida recién creada, y la segunda aquella en la que se hizo
		*  click */
		const [newCard, dividedCard] = cards;
		const allGroups = this.findGroups(dividedCard, dividedCard.day, dividedCard.mechanicCode);
		const group = CardsService.findCardGroup(allGroups, dividedCard.panelId);
		const card = group.cards.find((c: Card) => c.panelId == dividedCard.panelId);

		this.cardsService.divideCard(card, group, dividedCard.duration, newCard.duration, [], false);
		NotificationService.notifyGroups([group], true)
	}

	createCards(cards: Card[]): void {
		let processed = [];
		cards.forEach((card: Card) => {
			const alreadyProcessed = processed.find((c: Card) => c.order.code == card.order.code);
			if (!alreadyProcessed) {
				const orderCards = cards.filter((c: Card) => c.order.code == card.order.code);
				const group = new CardsGroup(orderCards, DimensionsService.calcLeftFromStart(orderCards[0].start));

				const destinyDropzone = DropzoneService.findDropzone(card, true);
				destinyDropzone.addRealTimeGroup(group);
				destinyDropzone.notify(false);

				processed = processed.concat(orderCards);
			}
		})
	}

	updateCardVehiclePosition(card: Card): void {
		const allGroups = this.findGroups(card, card.day, card.mechanicCode);
		const group = allGroups.find((group: CardsGroup) => group.id == card.panelId);
		const localCard = group.cards.find((c: Card) => c.panelId == card.panelId);

		this.cardsService.updateVehiclePosition(localCard, card.vehiclePosition, false);
	}

	updateCardPendingCall(card: Card): void {
		const allGroups = this.findGroups(card, card.day, card.mechanicCode);
		const group = allGroups.find((group: CardsGroup) => group.id == card.panelId);
		const localCard = group.cards.find((c: Card) => c.panelId == card.panelId);

		this.cardsService.updatePendingCall(localCard, card.pending.call, false);
	}

	updateCardPendingBudget(card: Card): void {
		const allGroups = this.findGroups(card, card.day, card.mechanicCode);
		const group = allGroups.find((group: CardsGroup) => group.id == card.panelId);
		const localCard = group.cards.find((c: Card) => c.panelId == card.panelId);

		this.cardsService.updatePendingBudget(localCard, card.pending.budget, false);
	}

	// endregion

	// region Mechanics

	updateMechanicJobLineType(mechanic: Mechanic): void {
		const localMechanic = MechanicsService.findMechanicByPosition(mechanic.day, mechanic.panelInfo.position);
		localMechanic.jobLineType = mechanic.jobLineType;
		NotificationService.notifyMechanicLine(localMechanic.day, localMechanic.code);
	}

	updateMechanicLines(mechanic: Mechanic): void {
		const localMechanic = MechanicsService.findMechanicByPosition(mechanic.day, mechanic.panelInfo.position);
		MechanicsService.updateMechanicLines(localMechanic, mechanic.panelInfo.lines);
	}

	updateMechanicsPosition(mechanics: Mechanic[]): void {
		/* El último elemento de la lista es el mecánico eliminado */
		const removedMechanic = MechanicsService.findMechanicByPosition(
			mechanics[0].day,
			mechanics[mechanics.length-1].panelInfo.position
		);
		this.mechanicsService.removeMechanic(removedMechanic.day, removedMechanic, false);
	}

	// endregion

	// region Mechanic appointment

	createMechanicAppointment(mechanicAppointmentInfo: any): void {
		const day = dayjs(mechanicAppointmentInfo.day);
		const appointmentType = AppointmentsService.findAppointmentType(mechanicAppointmentInfo.appointmentTypeCode);
		const newMechanicAppointment = new MechanicAppointment(
			appointmentType, mechanicAppointmentInfo.mechanicAppointment, day
		);

		const mechanic = MechanicsService.findMechanic(day, mechanicAppointmentInfo.mechanicCode);
		AppointmentsService.addMechanicAppointment(mechanic, newMechanicAppointment);
	}

	updateMechanicAppointment(mechanicAppointmentInfo: any): void {
		const day = dayjs(mechanicAppointmentInfo.day);
		const appointmentType = AppointmentsService.findAppointmentType(mechanicAppointmentInfo.appointmentTypeCode);
		const lastStart = UtilsService.buildDate(day, mechanicAppointmentInfo.lastStart);
		const lastEnd = UtilsService.buildDate(day, mechanicAppointmentInfo.lastEnd);
		const newMechanicAppointment = new MechanicAppointment(
			appointmentType, mechanicAppointmentInfo.mechanicAppointment, day
		);

		const mechanic = MechanicsService.findMechanic(day, mechanicAppointmentInfo.mechanicCode);
		const mechanicAppointment = AppointmentsService.findMechanicAppointment(
			mechanic, appointmentType.code, lastStart, lastEnd
		);
		AppointmentsService.updateMechanicAppointment(
			mechanic, mechanicAppointment, newMechanicAppointment.interval.start, newMechanicAppointment.interval.end
		);
	}

	deleteMechanicAppointment(mechanicAppointmentInfo: any): void {
		const day = dayjs(mechanicAppointmentInfo.day);
		const appointmentType = AppointmentsService.findAppointmentType(mechanicAppointmentInfo.appointmentTypeCode);
		const lastStart = UtilsService.buildDate(day, mechanicAppointmentInfo.lastStart);
		const lastEnd = UtilsService.buildDate(day, mechanicAppointmentInfo.lastEnd);

		const mechanic = MechanicsService.findMechanic(day, mechanicAppointmentInfo.mechanicCode);
		const mechanicAppointment = AppointmentsService.findMechanicAppointment(
			mechanic, appointmentType.code, lastStart, lastEnd
		);
		AppointmentsService.deleteMechanicAppointment(mechanic, mechanicAppointment);
	}

	// updateAppointmentType(updatedAppointment: AppointmentSchedule): void {
	// 	let mechanic, appointment;
	// 	// if (!updatedAppointment.appointmentType) {
	// 	// 	for (const mechanics of Object.values(MechanicsService.daysMechanics)) {
	// 	// 		if (!mechanic) {
	// 	// 			let [mec, app] = this.appointmentsService.findMechanicAppointmentByMechanic(
	// 	// 				<Mechanic[]> mechanics,
	// 	// 				updatedAppointment.mechanicId,
	// 	// 				updatedAppointment.index
	// 	// 			);
	// 	// 			if (mec) {
	// 	// 				[mechanic, appointment] = [mec, app]
	// 	// 			}
	// 	// 		}
	// 	// 	}
	// 	// 	appointment.reset();
	// 	// } else {
	// 	// 	const dayMechanics = MechanicsService.findDayMechanics(
	// 	// 		UtilsService.clearTime(new Date(updatedAppointment.schedule.start.getTime()))
	// 	// 	);
	// 	// 	[mechanic, appointment] = this.appointmentsService.findMechanicAppointmentByMechanic(
	// 	// 		dayMechanics,
	// 	// 		updatedAppointment.mechanicId,
	// 	// 		updatedAppointment.index
	// 	// 	);
	// 	// 	appointment.appointmentType = updatedAppointment.appointmentType;
	// 	// }
	// 	NotificationService.notifyMechanicLine(
	// 		Constants.MECHANIC_LINE_UPDATE_TYPE.APPOINTMENT_TYPE,
	// 		mechanic.day,
	// 		mechanic.code
	// 	);
	// }

	// endregion

	// region Sync JPDV

	syncJpdvCards(syncInfo: SyncCardsInfo): void {
		const unassignedNotifyGroups = [];
		if (syncInfo.newCards.length) {
			console.log('Adding JPDV cards', syncInfo.newCards);
			syncInfo.newCards.forEach((card: Card) => {
				const group = new CardsGroup([card]);
				CardsService.addToUnassigned(group, false);
				unassignedNotifyGroups.push(group);
			});
		}
		if (syncInfo.newReplace.length) {
			console.log('Replacing assigned cards', syncInfo.newReplace);
			syncInfo.newReplace.forEach((card: Card) => {
				CardsService.addToAssigned(new CardsGroup([card]), card.day, card.mechanicCode);
			});
		}
		if (syncInfo.reset.length) {
			console.log('Resetting assigned cards', syncInfo.reset);
			const processedGroups = [];
			syncInfo.reset.forEach((card: Card) => {
				const group = this.findPanelCardGroup(card.panelId);
				const processedGroup = processedGroups.find((g: CardsGroup) => g.id == group.id);
				if (!processedGroup) {
					/* Se baja el grupo a la cinta sólo si estaba asignado anteriormente. Si no lo estaba, no hace falta
					*  operar con él */
					if (group.mechanicCode) {
						CardsService.removeFromAssigned(group, group.day, group.mechanicCode);
						CardsService.resetCardsGroup(group)
						CardsService.addToUnassigned(group, false);
						unassignedNotifyGroups.push(group);
					}
				}
			});
		}
		if (syncInfo.updated.length) {
			console.log('Updating JPDV cards', syncInfo.updated);
			syncInfo.updated.forEach((card: Card) => {
				const group = this.findPanelCardGroup(card.panelId);
				const localCard = group.cards.find((c: Card) => c.panelId == card.panelId);
				CardsService.updateCardOrder(localCard, card.order, card.vehicle);
				if (group.mechanicCode) {
					NotificationService.notifyMechanicLine(group.day, group.mechanicCode, false);
				} else {
					unassignedNotifyGroups.push(group);
				}
			});
		}
		if (syncInfo.deleted.length) {
			console.log('Deleting JPDV cards', syncInfo.deleted);
			const processedGroups = [];
			syncInfo.deleted.forEach((card: Card) => {
				const group = this.findPanelCardGroup(card.panelId);
				const processedGroup = processedGroups.find((g: CardsGroup) => g.id == group.id);
				if (!processedGroup) {
					/* El grupo existente en panel antes de actualizar está en la posición de origen (la que tenía antes de
					*  actualizarse en otro terminal) */
					const originDropzone = DropzoneService.findDropzone(group.cards[0]);
					originDropzone.removeGroup(group);
					processedGroups.push(group);
				}
			});
		}
		if (syncInfo.appointmentDays.length) {
			AppointmentsService.updateAppointmentDays(syncInfo.appointmentDays);
			syncInfo.appointmentDays.forEach((appointmentDay: AppointmentDay) => {
				NotificationService.notifyAppointmentDay(appointmentDay);
			});
		}
		/* Sólo se notifica el array de actualizaciones si se actualizó algún grupo (en cuyo caso, en el array estará
		*  la actualización correspondiente). En caso contrario, no se hace para no ejecutar el CD innecesariamente */
		if (NotificationService.updateArray.length) {
			NotificationService.notifyUpdateArray();
		}
		/* Sólo se ejecuta el CD de la cinta si hay grupos no asignados que actualizar */
		if (unassignedNotifyGroups.length) {
			NotificationService.notifyBand(undefined, unassignedNotifyGroups);
		}
	}

	// endregion

}
