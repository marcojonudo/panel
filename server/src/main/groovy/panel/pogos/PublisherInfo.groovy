package panel.pogos

import groovy.transform.CompileStatic

@CompileStatic
abstract class PublisherInfo {

	static final Map<String, Closure<PublisherInfo>> PUBLISHER_INFO_TYPE = [
	        cards: { String updateProperty, Object cards -> new CardsPublisherInfo(updateProperty, (List<Map<String, Object>>) cards) },
	        mechanic: { String updateProperty, Object mechanic -> new MechanicPublisherInfo(updateProperty, (Map<String, Object>) mechanic) }
	]

	String updateObject
	String updateProperty

	static PublisherInfo findPublisherInfoType(String updateObject, String updateProperty, Object object) {
		return PUBLISHER_INFO_TYPE[updateObject](updateProperty, object)
	}

}
