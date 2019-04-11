package panel.pogos

import groovy.transform.CompileStatic
import utils.pogos.panel.Card

@CompileStatic
class UpdateCards {

	List<Card> newCards
	List<Card> updatedCards
	List<Card> deletedCards

	UpdateCards() {
		newCards = []
		updatedCards = []
		deletedCards = []
	}

	List<Card> getAll() {
		return newCards + updatedCards + deletedCards
	}

}
