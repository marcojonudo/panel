import {CardsGroup} from "../cards-group";
import {CardsService} from "../../services/cards.service";
import {Card} from "../card";
import {CardDurationHandler} from "./card-duration-handler";
import {Constants} from "../constants";
import {ScheduleInterval} from "../schedule-interval";
import {Mechanic} from "../mechanic";
import {NotificationService} from "../../services/notification.service";

export class AssignedCardDurationHandler implements CardDurationHandler {

	findGroups(card: Card): CardsGroup[] {
		return CardsService.findLineGroups(card.day, card.mechanicCode, card.line);
	}

	updateDuration(
		card: Card,
		group: CardsGroup,
		durationIncrease: number,
		widthIncrease: number,
		updatedGroups: CardsGroup[]
	): Card[] {
		/* Se actualiza la duración de la ficha*/
		card.setDuration(card.duration + durationIncrease, card.width + widthIncrease);
		/* Se actualiza la posición de las fichas ubicadas a continuación de la anterior */
		group.cards.forEach((c: Card) => {
			if (c.panelId != card.panelId && c.start > card.start) {
				c.setStart(c.start.add(durationIncrease, Constants.DAY_JS.m));
			}
		});
		group.end = group.end.add(durationIncrease, Constants.DAY_JS.m);

		let cardsToUpdate = [];
		if (updatedGroups.length) {
			cardsToUpdate = this.updateNextGroupsPosition(updatedGroups, widthIncrease, durationIncrease);
		}
		NotificationService.notifyGroups(updatedGroups.concat(group), true);
		return cardsToUpdate.concat(group.cards);
	}

	updateNextGroupsPosition(groups: CardsGroup[], widthStep: number, durationStep: number): Card[] {
		const cards = [];
		groups.forEach(group => {
			group.left += widthStep;
			if (group.start) {
				group.start = group.start.add(durationStep, Constants.DAY_JS.m);
				group.end = group.end.add(durationStep, Constants.DAY_JS.m);

				group.cards.forEach(c => {
					c.start = c.start.add(durationStep, Constants.DAY_JS.m);
					c.end = c.start.add(c.duration, Constants.DAY_JS.m);
				});
			}
			cards.push(...group.cards);
		});
		return cards;
	}

	validateDurationUpdate(group: CardsGroup, card: Card, mechanic: Mechanic): CardsGroup[] {
		const groupOutsideSchedule = this.checkGroupOutsideSchedule(group, mechanic.schedules);
		/* Si el grupo se sale del horario al aumentar la duración */
		if (groupOutsideSchedule) {
			return undefined;
		}

		const updatedGroups = this.findTranslatedGroups(card);
		/* Si no se desplazan otros grupos al aumentar la duración, o se desplazan pero siguen dentro del horario, se
		*  se valida la actualización y se devuelven los grupos actualizados */
		if (!updatedGroups.length ||
			!this.checkGroupOutsideSchedule(updatedGroups[updatedGroups.length - 1], mechanic.schedules)) {
			return updatedGroups;
		}
		return undefined;
	}

	checkGroupOutsideSchedule(group: CardsGroup, schedules: ScheduleInterval[]): boolean {
		const threshold = schedules.find((interval: ScheduleInterval) => interval.end.isSame(group.end));
		return threshold != undefined;
	}

	findTranslatedGroups(card: Card): CardsGroup[] {
		const lineGroups = CardsService.findLineGroups(card.day, card.mechanicCode, card.line);
		let stopSearching = false;
		return lineGroups.filter((group, i) => {
			if (!stopSearching && group.start.isAfter(card.start)) {
				const gapBetweenGroups = !lineGroups[i - 1].end.isSame(group.start);
				if (gapBetweenGroups) {
					stopSearching = true;
				}
				return !gapBetweenGroups
			}
			return false;
		});
	}

}
