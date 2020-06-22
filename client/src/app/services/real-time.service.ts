import {Injectable} from '@angular/core';
import {Card} from "../objects/card";
import {CardsService} from "./cards.service";
import {environment} from "../../environments/environment";
import {RealTimeCardUpdatePosition} from "../objects/real-time-update/real-time-card-update-position";
import {RealTimeCardUpdateDuration} from "../objects/real-time-update/real-time-card-update-duration";
import {RealTimeCardUpdateLinks} from "../objects/real-time-update/real-time-card-update-links";
import {Constants} from "../objects/constants";
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

	private _sessionId: string;

	// region Getters / setters

	get sessionId(): string {
		return this._sessionId;
	}

	set sessionId(value: string) {
		this._sessionId = value;
	}

	// endregion

	connectUpdatePublisher(): void {
		const eventSource = new EventSource(Url.publisher());
		eventSource.onmessage = event => {
			if (event.lastEventId != this.sessionId) {
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

	updatePosition(cards: Card[]): void {
		/* Si al mover el grupo se solapa con otro, y este se desplaza (y así sucesivamente), habría fichas de más
		*  de una orden. Se agrupan para procesar los grupos de forma individual */
		const groupedCards = {};
		cards.forEach((card: Card) => {
			if (groupedCards[card.order.number]) {
				groupedCards[card.order.number].push(card);
			} else {
				groupedCards[card.order.number] = [card];
			}
		});

		for (const [orderNumber, orderCards] of Object.entries(groupedCards)) {
			/* Para saber si el grupo estaba asignado antes de moverlo en otro terminal, se recorren primero los grupos
			*  no asignados (la mayoría de las veces habrá muchos menos, por lo que será más eficiente) */
			let group = CardsService.findOrderGroups(CardsService.unassignedGroups, parseInt(orderNumber))
				.find((g: CardsGroup) => g.id == orderCards[0].panelId);
			group = group ? group : CardsService.findOrderGroups(CardsService.assignedGroups, parseInt(orderNumber))
				.find((g: CardsGroup) => g.id == orderCards[0].panelId)

			/* Si se encuentra el grupo dentro de los no asignados, se elimina de esa categoría */
			if (group.day == undefined) {
				CardsService.removeFromUnassigned(group, false);
			} else {
				/* Si no se encuentra el grupo dentro de los no asignados, significa que ya estaba asignado */
				CardsService.removeFromAssigned(group, group.day, group.mechanicCode);
			}

			/* Si las fichas están asignadas */
			if (orderCards[0].day != undefined) {
				/* left se calcula a partir de la hora que ya tiene asignada la ficha (ya se ha movido antes en otro
				*  terminal) */
				group.left = DimensionsService.calcLeftFromStart(orderCards[0].start);
				CardsService.updateAssignedCards(
					[group],
					group,
					orderCards[0].day,
					orderCards[0].mechanicCode,
					orderCards[0].line,
					CardsService.findDayMechanicGroups(orderCards[0].day, orderCards[0].mechanicCode)
				);
				CardsService.addToAssigned(group, orderCards[0].day, orderCards[0].mechanicCode);
			} else {
				CardsService.resetCardsGroup(group);
				CardsService.addToUnassigned(group);
			}
		}
		NotificationService.notifyUpdateArray();
	}

	updateDuration(cards: Card[]): void {
		const allGroups = this.findGroups(cards[0], cards[0].day, cards[0].mechanicCode);

		let updatedDurationCard = undefined;
		const card = cards.find((card: Card) => {
			const group = CardsService.findCardGroup(allGroups, card.panelId);
			updatedDurationCard = group.cards.find((c: Card) => c.duration != card.duration);
			return updatedDurationCard != undefined;
		});
		const widthIncrease = DimensionsService.calcWidthFromDuration(
			card.duration - updatedDurationCard.duration
		);
		let mechanic, handler;
		if (updatedDurationCard.day) {
			mechanic = MechanicsService.findMechanic(updatedDurationCard.day, updatedDurationCard.mechanicCode);
			handler = new AssignedCardDurationHandler();
		} else {
			handler = new UnassignedCardDurationHandler();
		}
		CardsService.handleCardDurationUpdate(updatedDurationCard, widthIncrease, mechanic, handler);
	}

	updateLinks(cards: Card[]): void {
		/* Al estar actualizando enlaces, sólo puede haber dos fichas: la de la izquierda y la de la derecha */
		const allGroups = this.findGroups(cards[0], cards[0].day, cards[0].mechanicCode);

		/* Si la ficha de la izquierda tiene linkedNextId, significa que ambas se están enlazando */
		if (cards[0].linkedNext) {
			const card = CardsService.findCardGroup(allGroups, cards[0].panelId).cards.find((c: Card) => {
				return c.panelId == cards[0].panelId
			});
			const linkHandler = card.day
				? new AssignedCardLinkHandler() : new UnassignedCardLinkHandler();
			CardsService.linkNext(card, linkHandler);
		} else {
			const card = CardsService.findCardGroup(allGroups, cards[0].panelId).cards.find((c: Card) => {
				return c.panelId == cards[0].panelId
			});
			const linkHandler = card.day
				? new AssignedCardLinkHandler() : new UnassignedCardLinkHandler();
			CardsService.unlink(card, Constants.NEXT_CARD_DIRECTION.RIGHT, linkHandler);
		}
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
		if (syncInfo.newCards.length) {
			console.log('Adding JPDV cards', syncInfo.newCards);
			syncInfo.newCards.forEach((card: Card) => {
				const group = new CardsGroup([card]);
				CardsService.addToUnassigned(group, false);
			});
		}
		if (syncInfo.updatedCards.length) {
			console.log('Updating JPDV cards', syncInfo.updatedCards);
			syncInfo.updatedCards.forEach((card: Card) => {
				const group = CardsService.findCardGroup(
					this.findGroups(card, card.day, card.mechanicCode),
					card.panelId
				);
				const localCard = group.cards.find((c: Card) => c.panelId == card.panelId);
				localCard.group = card.group;
				localCard.vehicle = card.vehicle;
				localCard.order = card.order;
				if (localCard.day) {
					NotificationService.notifyMechanicLine(localCard.day, localCard.mechanicCode);
				}
			});
		}
		if (syncInfo.deletedCards.length) {
			console.log('Deleting JPDV cards', syncInfo.deletedCards);
			syncInfo.deletedCards.forEach((card: Card) => {
				if (card.day) {
					const group = CardsService.findCardGroup(
						CardsService.findDayMechanicGroups(card.day, card.mechanicCode),
						card.panelId
					);
					/* Si el grupo tiene una sóla ficha, se borra el grupo completo */
					if (group.cards.length == 1) {
						CardsService.removeFromAssigned(group, card.day, card.mechanicCode);
					} else {
						/* Si el grupo tiene más de una ficha, no sé borra el grupo, sino que se borra la ficha de la
                        *  lista */
						group.removeCard(card.panelId);
						NotificationService.notifyMechanicLine(card.day, card.mechanicCode);
					}
				} else {
					const unassignedGroups = CardsService.findUnassignedGroups(card.type, card.status);
					const group = CardsService.findCardGroup(unassignedGroups, card.panelId);
					if (group.cards.length == 1) {
						CardsService.removeFromUnassigned(group, false)
					} else {
						/* Si el grupo tiene más de una ficha, no sé borra el grupo, sino que se borra la ficha de la
                        *  lista */
						group.removeCard(card.panelId);
						CardPositionService.updateUnassignedGroupsLeft(unassignedGroups);
					}
				}
			});
		}
		if (syncInfo.triggerCd) {
			NotificationService.notifyBand();
		}
	}

	// endregion

}
