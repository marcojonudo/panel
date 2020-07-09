package panel.pogos.firstLoad

import groovy.transform.CompileStatic
import panel.pogos.cards.Card

@CompileStatic
class UpdateCards {

	List<Card> newCards
	List<Card> newReplace
	List<Card> reset
	List<Card> updated
	List<Card> same
	List<Card> deleted
	List<Card> auxiliary

	UpdateCards(List<Card> same = [], List<Card> auxiliary = []) {
		newCards = []
		newReplace = []
		reset = []
		updated = []
		deleted = []
		this.same = same
		this.auxiliary = auxiliary
	}

	List<Card> getUpdate() {
		return reset + updated
	}

	List<Card> getAppointments() {
		return newCards + newReplace + reset
	}

	List<Card> getAll() {
		return newCards + newReplace + updated + reset + same
	}

	boolean updated() {
		return newCards || updated || deleted
	}

	LinkedHashMap<String, List<Card>> getSyncInfo() {
		return [
			newCards: newCards,
			updatedCards: updated,
			deletedCards: deleted
		]
	}

}
