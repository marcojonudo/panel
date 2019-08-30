package panel.pogos

import groovy.transform.CompileStatic
import utils.pogos.panel.Card

@CompileStatic
class UpdateCards {

	List<Card> newCards
	List<Card> updatedCards
	List<Card> deletedCards

	List<Card> sameCards

	UpdateCards() {
		newCards = []
		updatedCards = []
		deletedCards = []
		sameCards = []
	}

	List<Card> getAll() {
		return newCards + updatedCards + deletedCards + sameCards
	}

}
