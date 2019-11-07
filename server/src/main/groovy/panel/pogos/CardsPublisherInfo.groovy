package panel.pogos

import groovy.transform.CompileStatic

@CompileStatic
class CardsPublisherInfo extends PublisherInfo {

	List<Map<String, Object>> cards

	CardsPublisherInfo(String updateProperty, List<Map<String, Object>> cards) {
		this.updateObject = 'cards'
		this.updateProperty = updateProperty
		this.cards = cards
	}

}
