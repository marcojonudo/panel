package panel.pogos.firstLoad

import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import panel.domains.panel.AppointmentDay
import panel.domains.panel.Card

@CompileStatic
class UpdateCards {

	@JsonInclude
	List<Card> newCards
	@JsonInclude
	List<Card> newReplace
	@JsonInclude
	List<Card> reset
	@JsonInclude
	List<Card> updated
	List<Card> same
	@JsonInclude
	List<Card> deleted
	List<Card> avoidSync

	@JsonInclude
	List<AppointmentDay> appointmentDays

	UpdateCards(List<Card> same = [], List<Card> avoidSync = []) {
		newCards = []
		newReplace = []
		reset = []
		updated = []
		deleted = []
		this.same = same
		this.avoidSync = avoidSync
	}

	List<Card> getUpdate() {
		return reset + updated
	}

	List<Card> getAppointments() {
		return newCards + newReplace + reset
	}

	List<Card> getAll() {
		return newCards + newReplace + reset + updated + same
	}

	boolean updated() {
		return newCards || newReplace || reset || updated || deleted
	}

	Map<String, List<Object>> getSyncInfo() {
		return [
			newCards: newCards,
			newReplace: newReplace,
			reset: reset,
			updated: updated,
			deletedCards: deleted,
			appointmentDays: appointmentDays
		] as Map<String, List<Object>>
	}

	void add(UpdateCards updateCards) {
		this.newCards += updateCards.newCards
		this.newReplace += updateCards.newReplace
		this.reset += updateCards.reset
		this.updated += updateCards.updated
		this.same += updateCards.same
		this.deleted += updateCards.deleted
		this.avoidSync += updateCards.avoidSync
	}

}
