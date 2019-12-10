import {CardsGroup} from "../cards-group";
import {Constants} from "../constants";
import {Mechanic} from "../mechanic";
import {Dropzone} from "./dropzone";
import {CardPositionService} from "../../services/card-position.service";
import {CardsService} from "../../services/cards.service";
import {Coordinates} from "../coordinates";
import {UnassignedCardUpdateTrigger} from "../update-cards/unassigned-card-update-trigger";

export class UnassignedDropzone implements Dropzone {

	cardPositionService: CardPositionService;
	cardsService: CardsService;

	type: string = Constants.DROPZONE_TYPE.UNASSIGNED;
	mechanic: Mechanic;
	rect: any;

	constructor(
		cardPositionService: CardPositionService,
		cardsService: CardsService
	) {
		this.cardPositionService = cardPositionService;
		this.cardsService = cardsService;
	}

	validateMovement(): CardsGroup[] {
		/* Si el destino es la cita, no hace falta validar ya que siempre es un movimiento válido. Por tanto, se
		*  devuelve una lista vacía en lugar de undefined */
		return [];
	}

	removeGroup(group: CardsGroup, validated: boolean): void {
		/* Si el movimiento se ha validado, es necesario ejectuar el CD para que se actualice la posición de los grupos
		*  no asignados. En caso contrario no, ya que la el grupo retornará a su posición original */
		this.cardsService.removeFromUnassigned(group, validated);
	}

	addGroup(
		groups: CardsGroup[],
		group: CardsGroup
	): Coordinates {
		this.cardsService.resetCardsGroup(group);
		this.cardsService.addToUnassigned(group);
		const newPosition = this.cardPositionService.handleUnassignedPosition(group);

		/* Terminada la transición, se ejecuta el CD para que se elimine el hidden del grupo añadido */
		setTimeout(
			() => this.cardsService.notifyUnassigned(),
			Constants.VALUE.CARD_MOVEMENT_DURATION
		);

		return newPosition;
	}

	handleNotValidatedMovement(group: CardsGroup): void {
		setTimeout(
			() => {
				this.cardsService.addToUnassigned(group);
			},
			Constants.VALUE.CARD_MOVEMENT_DURATION
		);
	}

}
