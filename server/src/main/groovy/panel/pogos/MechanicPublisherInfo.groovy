package panel.pogos

import groovy.transform.CompileStatic

@CompileStatic
class MechanicPublisherInfo extends PublisherInfo {

	List<Map<String, Object>> mechanics

	MechanicPublisherInfo(String updateProperty, List<Map<String, Object>> mechanics) {
		this.updateObject = 'mechanic'
		this.updateProperty = updateProperty
		this.mechanics = mechanics
	}

}
