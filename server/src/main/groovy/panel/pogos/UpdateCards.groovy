package panel.pogos

import groovy.transform.CompileStatic
import utils.pogos.panel.Card

@CompileStatic
class UpdateCards {

	List<Card> newCards
	List<Card> updatedCards
	List<Card> deletedCards

	List<Card> sameCards
	List<Card> auxiliaryCards

	UpdateCards(List<Card> sameCards = []) {
		newCards = []
		updatedCards = []
		deletedCards = []
		this.sameCards = sameCards
	}

	List<Card> getAll() {
		return newCards + updatedCards + sameCards
	}

	boolean updated() {
		return newCards || updatedCards || deletedCards
	}

	LinkedHashMap<String, List<Card>> getSyncInfo() {
		return [
				newCards: newCards,
				updatedCards: updatedCards,
				deletedCards: deletedCards
		]
	}

}
