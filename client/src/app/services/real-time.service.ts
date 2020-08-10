import {Injectable} from '@angular/core';
import {Card} from "../objects/card";
import {CardsService} from "./cards.service";
import {RealTimeCardUpdatePosition} from "../objects/real-time-update/real-time-card-update-position";
import {RealTimeCardUpdateDuration} from "../objects/real-time-update/real-time-card-update-duration";
import {RealTimeCardUpdateLinks} from "../objects/real-time-update/real-time-card-update-links";
import {RealTimeMechanicUpdateLines} from "../objects/real-time-update/real-time-mechanic-update-lines";
import {Mechanic} from "../objects/mechanic";
import {RealTimeMechanicUpdatePosition} from "../objects/real-time-update/real-time-mechanic-update-position";
import {RealTimeUpdateInfo} from "../objects/real-time-update/real-time-update-info";
import {RealTimeAppointmentUpdateSchedule} from "../objects/real-time-update/real-time-appointment-update-schedule";
import {AppointmentsService} from "./appointments.service";
import {AppointmentSchedule} from "../objects/appointment-schedule";
import {NotificationService} from "./notification.service";
import {CardsGroup} from "../objects/cards-group";
import {DimensionsService} from "./dimensions.service";
import {MechanicsService} from "./mechanics.service";
import {UnassignedCardLinkHandler} from "../objects/card-links/unassigned-card-link-handler";
import {AssignedCardLinkHandler} from "../objects/card-links/assigned-card-link-handler";
import {Dayjs} from "dayjs";
import {RealTimeAppointmentCreate} from "../objects/real-time-update/real-time-appointment-create";
import {RealTimeMechanicUpdateJobLineType} from "../objects/real-time-update/real-time-mechanic-update-job-line-type";
import {RealTimeAppointmentDelete} from "../objects/real-time-update/real-time-appointment-delete";
import {SyncCardsInfo} from "../objects/sync-cards-info";
import {RealTimeSyncJpdv} from "../objects/real-time-update/real-time-sync-jpdv";
import {CardPositionService} from "./card-position.service";
import {RealTimeCardUpdateVehiclePosition} from "../objects/real-time-update/real-time-card-update-vehicle-position";
import {RealTimeCardUpdatePendingCall} from "../objects/real-time-update/real-time-card-update-pending-call";
import {RealTimeCardUpdatePendingBudget} from "../objects/real-time-update/real-time-card-update-pending-budget";
import {Url} from "../objects/url";
import {UnassignedCardDurationHandler} from "../objects/card-duration/unassigned-card-duration-handler";
import {AssignedCardDurationHandler} from "../objects/card-duration/assigned-card-duration-handler";
import {RightCardLinkHandler} from "../objects/card-links/side/right-card-link-handler";
import {RealTimeCardDivide} from "../objects/real-time-update/real-time-card-divide";
import {DropzoneService} from "./dropzone.service";
import {AppointmentDay} from "../objects/appointments/appointment-day";
import {WarningToast} from "../objects/toasts/warning-toast";

@Injectable({
	providedIn: 'root'
})
export class RealTimeService {

	private readonly UPDATE_TYPE = {
		updateCardsPosition: (cards: any[]) =>
			new RealTimeCardUpdatePosition(this, cards),
		updateCardsDuration: (cards: any[]) =>
			new RealTimeCardUpdateDuration(this, cards),
		updateCardsLinks: (cards: any[]) =>
			new RealTimeCardUpdateLinks(this, cards),
		divideCards: (cards: any[]) =>
			new RealTimeCardDivide(this, cards),
		updateMechanicJobLineType: (mechanic: any) =>
			new RealTimeMechanicUpdateJobLineType(mechanic),
		updateMechanicLines: (mechanics: any[]) =>
			new RealTimeMechanicUpdateLines(mechanics),
		updateMechanicsPosition: (mechanics: any[]) =>
			new RealTimeMechanicUpdatePosition(this, mechanics),
		createAppointment: (appointment: any) =>
			new RealTimeAppointmentCreate(appointment),
		updateAppointmentSchedule: (appointment: any) =>
			new RealTimeAppointmentUpdateSchedule(appointment),
		deleteAppointment: (appointment: any) =>
			new RealTimeAppointmentDelete(appointment),
		syncJpdv: (updateInfo: any) =>
			new RealTimeSyncJpdv(this, updateInfo),
		updateVehiclePosition: (cards: any[]) =>
			new RealTimeCardUpdateVehiclePosition(this, cards),
		updatePendingCall: (cards: any[]) =>
			new RealTimeCardUpdatePendingCall(this, cards),
		updatePendingBudget: (cards: any[]) =>
			new RealTimeCardUpdatePendingBudget(this, cards),
	};

	constructor(
		private cardsService: CardsService,
		private mechanicsService: MechanicsService
	) {
		this.connectUpdatePublisher();
	}

	private static _sessionId: string;

	// region Getters / setters

	static get sessionId(): string {
		return this._sessionId;
	}

	static set sessionId(value: string) {
		this._sessionId = value;
	}

	// endregion

	connectUpdatePublisher(): void {
		const eventSource = new EventSource(Url.publisher());
		eventSource.onmessage = event => {
			if (event.lastEventId != RealTimeService.sessionId) {
				const updateInfo: RealTimeUpdateInfo = JSON.parse(event.data);
				console.log('Received update info:', updateInfo);
				const updateType = this.UPDATE_TYPE[updateInfo.action](updateInfo.content);
				updateType.update();
			}
		};
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

	updatePosition(cards: Card[]): void {
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

	updateDuration(cards: Card[]): void {
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
					this.updatePosition(cards.slice(1 + updatePositionIndex));
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

	updateLinks(cards: Card[]): void {
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

	divideCards(cards: Card[]): void {
		/* Al estar actualizando enlaces, sólo puede haber dos fichas: la de la izquierda y la de la derecha */
		const allGroups = this.findGroups(cards[0], cards[0].day, cards[0].mechanicCode);
		const group = CardsService.findCardGroup(allGroups, cards[0].panelId);
		const card = group.cards.find((c: Card) => {
			return c.panelId == cards[0].panelId
		});

		this.cardsService.divideCard(card, group, cards[0].duration, cards[1].duration, [], false);
		NotificationService.notifyGroups([group], true)
	}

	updateVehiclePosition(card: Card): void {
		const allGroups = this.findGroups(card, card.day, card.mechanicCode);
		const group = allGroups.find((group: CardsGroup) => group.id == card.panelId);
		const localCard = group.cards.find((c: Card) => c.panelId == card.panelId);

		this.cardsService.updateVehiclePosition(localCard, card.vehiclePosition, false);
	}

	updatePendingCall(card: Card): void {
		const allGroups = this.findGroups(card, card.day, card.mechanicCode);
		const group = allGroups.find((group: CardsGroup) => group.id == card.panelId);
		const localCard = group.cards.find((c: Card) => c.panelId == card.panelId);

		this.cardsService.updatePendingCall(localCard, card.pending.call, false);
	}

	updatePendingBudget(card: Card): void {
		const allGroups = this.findGroups(card, card.day, card.mechanicCode);
		const group = allGroups.find((group: CardsGroup) => group.id == card.panelId);
		const localCard = group.cards.find((c: Card) => c.panelId == card.panelId);

		this.cardsService.updatePendingBudget(localCard, card.pending.budget, false);
	}

	// endregion

	// region Mechanics

	static updateMechanicJobLineType(mechanic: Mechanic): void {
		const localMechanic = MechanicsService.findMechanicByPosition(mechanic.day, mechanic.panelPosition);
		localMechanic.jobLineType = mechanic.jobLineType;
		NotificationService.notifyMechanicLine(localMechanic.day, localMechanic.code);
	}

	static updateLines(mechanic: Mechanic): void {
		const localMechanic = MechanicsService.findMechanicByPosition(mechanic.day, mechanic.panelPosition);
		MechanicsService.updateMechanicLines(localMechanic, mechanic.lines);
	}

	updateMechanicPosition(mechanics: Mechanic[]): void {
		/* El último elemento de la lista es el mecánico eliminado */
		const removedMechanic = MechanicsService.findMechanicByPosition(
			mechanics[0].day,
			mechanics[mechanics.length-1].panelPosition
		);
		this.mechanicsService.removeMechanic(removedMechanic.day, removedMechanic, false);
	}

	// endregion

	// region Appointment

	static createAppointment(appointment: AppointmentSchedule): void {
		const mechanic = MechanicsService.findMechanic(appointment.day, appointment.mechanicCode);
		AppointmentsService.create(
			mechanic,
			appointment.appointmentType,
			appointment.schedule.start,
			appointment.schedule.end
		)
	}

	static updateAppointmentSchedule(appointment: AppointmentSchedule): void {
		const mechanic = MechanicsService.findMechanic(appointment.day, appointment.mechanicCode);
		AppointmentsService.updateSchedule(
			mechanic,
			appointment,
			appointment.schedule.start,
			appointment.schedule.end
		)
	}

	static deleteAppointment(appointment: AppointmentSchedule): void {
		const mechanic = MechanicsService.findMechanic(appointment.day, appointment.mechanicCode);
		AppointmentsService.delete(mechanic, appointment)
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
