package panel.pogos

import groovy.transform.CompileStatic

@CompileStatic
class CardsPublisherInfo {

	String updateId
	List<Map<String, Object>> cards

	CardsPublisherInfo(String updateId, List<Map<String, Object>> cards) {
		this.updateId = updateId;
		this.cards = cards;
	}

}
