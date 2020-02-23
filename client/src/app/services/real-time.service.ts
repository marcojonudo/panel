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
import {UtilsService} from "./utils.service";
import {RealTimeAppointmentUpdateType} from "../objects/real-time-update/real-time-appointment-update-type";
import {NotificationService} from "./notification.service";
import {CardsGroup} from "../objects/cards-group";
import {DimensionsService} from "./dimensions.service";
import {MechanicsService} from "./mechanics.service";
import {UnassignedCardLinkHandler} from "../objects/card-links/unassigned-card-link-handler";
import {AssignedCardLinkHandler} from "../objects/card-links/assigned-card-link-handler";

@Injectable({
	providedIn: 'root'
})
export class RealTimeService {

	private readonly UPDATE_TYPE = {
		mechanic: {
			position: (updateInfo) => new RealTimeMechanicUpdatePosition(updateInfo.mechanics),
			lines: (updateInfo) => new RealTimeMechanicUpdateLines(updateInfo.mechanics)
		},
		cards: {
			position: (updateInfo) => new RealTimeCardUpdatePosition(this.cardsService, updateInfo.cards),
			duration: (updateInfo) => new RealTimeCardUpdateDuration(this.cardsService, updateInfo.cards),
			links: (updateInfo) => new RealTimeCardUpdateLinks(this.cardsService, updateInfo.cards)
		},
		appointment: {
			schedule: (updateInfo) => new RealTimeAppointmentUpdateSchedule(updateInfo.appointment),
			type: (updateInfo) => new RealTimeAppointmentUpdateType(updateInfo.appointment)
		}
	};

	constructor(
		private cardsService: CardsService,
		private mechanicsService: MechanicsService,
		private appointmentsService: AppointmentsService
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
		const eventSource = new EventSource(`${environment.serverUrl}/panel/publisher`);
		eventSource.onmessage = event => {
			if (event.lastEventId != this.sessionId) {
				const updateInfo: RealTimeUpdateInfo = JSON.parse(event.data);
				console.log('Received update info:', updateInfo);
				const updateType = this.UPDATE_TYPE[updateInfo.updateObject][updateInfo.updateProperty](updateInfo);
				updateType.update(this);
			}
		};
	}

	findGroups(card: Card, day: Date, mechanicCode: string): CardsGroup[] {
		/* En función de si la ficha estaba asignada antes de moverse en otro terminal o no, se busca en los
		*  grupos asignados o en los de la cinta */
		return day ?
			this.cardsService.findDayMechanicGroups(day, mechanicCode) :
			this.cardsService.findUnassignedGroups(card.type, card.status);
	}

	updatePosition(cards: Card[]): void {
		const [lastAssigned, assigned] = [cards[0].lastDay != undefined, cards[0].day != undefined];
		const allGroups = this.findGroups(cards[0], cards[0].lastDay, cards[0].lastMechanicCode);

		/* Si se mueve un grupo con varias fichas, para cada una de ellas se actualizaría la posición del grupo. Para
		*  evitarlo, se almacenan los grupos ya procesados para no volver a hacerlo */
		const processedGroups = [];
		cards.forEach((card: Card) => {
			const group = this.cardsService.findCardGroup(allGroups, card.panelId);
			if (group && processedGroups.indexOf(group) == -1) {
				/* Se elimina el grupo del origen */
				if (lastAssigned) {
					this.cardsService.removeFromAssigned(group, card.lastDay, card.lastMechanicCode);
				} else {
					this.cardsService.removeFromUnassigned(group, false);
				}

				/* Se actualizan propiedades y se añade el grupo al destino */
				if (assigned) {
					/* left se calcula a partir de la hora que ya tiene asignada la ficha (ya se ha movido antes en otro
					*  terminal) */
					group.left = DimensionsService.calcLeftFromStart(card.start);
					// this.cardsService.updatePosition(group, card.day, card.line, left);
					this.cardsService.updateAssignedCards(
						[group],
						group,
						card.day,
						card.mechanicCode,
						card.line,
						this.cardsService.findDayMechanicGroups(card.day, card.mechanicCode),
						false
					);
					this.cardsService.addToAssigned(group, card.day, card.mechanicCode);
				} else {
					this.cardsService.resetCardsGroup(group);
					this.cardsService.addToUnassigned(group);
				}

				processedGroups.push(group);
			}
		});
	}

	updateDuration(cards: Card[]): void {
		/* Por cómo se van actualizando las fichas (duración de una, desplazamientos de otras), aquella cuya duración
		*  se actualiza es la última de la lista. El resto, son fichas que se desplazaron al aumentar la duración de
		*  esta */
		const allGroups = this.findGroups(cards[0], cards[0].day, cards[0].mechanicCode);

		let updatedDurationCard: Card = undefined;
		let updatedDurationGroup = undefined;
		const translatedCards = [];
		cards.forEach((card: Card) => {
			const group = this.cardsService.findCardGroup(allGroups, card.panelId);
			const updatedDurationGroupCard = group.cards.find((c: Card) => {
				const receivedCard = cards.find((receivedCard: Card) => receivedCard.panelId == c.panelId);
				return receivedCard.duration != c.duration;
			});
			if (updatedDurationGroupCard) {
				if (!updatedDurationGroup) {
					updatedDurationCard = updatedDurationGroupCard;
					updatedDurationGroup = group;
				}
			} else {
				translatedCards.push(card);
			}
		});

		const receivedUpdatedDurationCard = cards.find((c: Card) => c.panelId == updatedDurationCard.panelId);
		const durationDiff = receivedUpdatedDurationCard.duration - updatedDurationCard.duration;
		const widthDiff = DimensionsService.calcWidthFromDuration(durationDiff);
		this.cardsService.updateDurationProperties(updatedDurationCard, updatedDurationGroup, widthDiff, durationDiff);
		if (translatedCards.length) {
			this.updatePosition(translatedCards);
		}
	}

	updateLinks(cards: Card[]): void {
		/* Al estar actualizando enlaces, sólo puede haber dos fichas: la de la izquierda y la de la derecha */

		const allGroups = this.findGroups(cards[0], cards[0].day, cards[0].mechanicCode);

		/* Si la ficha de la izquierda tiene linkedNextId, significa que ambas se están enlazando */
		if (cards[0].linkedNext) {
			const card = this.cardsService.findCardGroup(allGroups, cards[0].panelId).cards.find((c: Card) => {
				return c.panelId == cards[0].panelId
			});
			const linkHandler = card.day
				? new AssignedCardLinkHandler(this.cardsService) : new UnassignedCardLinkHandler(this.cardsService);
			this.cardsService.linkNext(card, linkHandler, false);
		} else {
			const card = this.cardsService.findCardGroup(allGroups, cards[0].panelId).cards.find((c: Card) => {
				return c.panelId == cards[0].panelId
			});
			const linkHandler = card.day
				? new AssignedCardLinkHandler(this.cardsService) : new UnassignedCardLinkHandler(this.cardsService);
			this.cardsService.unlink(card, Constants.NEXT_CARD_DIRECTION.RIGHT, linkHandler,false);
		}
	}

	updateLines(mechanic: Mechanic): void {
		const localMechanic = this.mechanicsService.findMechanicByPosition(mechanic.day, mechanic.panelPosition);
		this.mechanicsService.updateMechanicLines(localMechanic, mechanic.lines);
	}

	updateMechanicPosition(mechanics: Mechanic[]): void {
		/* El último elemento de la lista es el mecánico eliminado */
		const removedMechanic = this.mechanicsService.findMechanicByPosition(
			mechanics[0].day,
			mechanics[mechanics.length-1].panelPosition
		);
		this.mechanicsService.removeMechanic(removedMechanic.day, removedMechanic, false);
	}

	updateAppointmentSchedule(updatedAppointment: AppointmentSchedule): void {
		const dayMechanics = this.mechanicsService.findDayMechanics(
			UtilsService.clearTime(new Date(updatedAppointment.schedule.start.getTime()))
		);
		// const [mechanic, appointment] = this.appointmentsService.findMechanicAppointmentByMechanic(
		// 	dayMechanics,
		// 	updatedAppointment.mechanicId,
		// 	updatedAppointment.index
		// );

		/* El id y tipo se actualizan por el caso de creación de nueva cita. En ese caso, la cita del mecánico estará vacía,
		*  y si se asigna sólo el horario no tendrá información sobre su tipo */
		// appointment.appointmentType = updatedAppointment.appointmentType;
		// appointment.schedule = updatedAppointment.schedule;
		// NotificationService.notifyMechanicLine(
		// 	Constants.MECHANIC_LINE_UPDATE_TYPE.APPOINTMENT_SCHEDULE,
		// 	mechanic.day,
		// 	mechanic.code
		// );
	}

	updateAppointmentType(updatedAppointment: AppointmentSchedule): void {
		let mechanic, appointment;
		// if (!updatedAppointment.appointmentType) {
		// 	for (const mechanics of Object.values(this.mechanicsService.daysMechanics)) {
		// 		if (!mechanic) {
		// 			let [mec, app] = this.appointmentsService.findMechanicAppointmentByMechanic(
		// 				<Mechanic[]> mechanics,
		// 				updatedAppointment.mechanicId,
		// 				updatedAppointment.index
		// 			);
		// 			if (mec) {
		// 				[mechanic, appointment] = [mec, app]
		// 			}
		// 		}
		// 	}
		// 	appointment.reset();
		// } else {
		// 	const dayMechanics = this.mechanicsService.findDayMechanics(
		// 		UtilsService.clearTime(new Date(updatedAppointment.schedule.start.getTime()))
		// 	);
		// 	[mechanic, appointment] = this.appointmentsService.findMechanicAppointmentByMechanic(
		// 		dayMechanics,
		// 		updatedAppointment.mechanicId,
		// 		updatedAppointment.index
		// 	);
		// 	appointment.appointmentType = updatedAppointment.appointmentType;
		// }
		NotificationService.notifyMechanicLine(
			Constants.MECHANIC_LINE_UPDATE_TYPE.APPOINTMENT_TYPE,
			mechanic.day,
			mechanic.code
		);
	}

}
