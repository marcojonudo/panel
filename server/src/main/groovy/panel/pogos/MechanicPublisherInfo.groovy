package panel.pogos

import groovy.transform.CompileStatic

@CompileStatic
class MechanicPublisherInfo extends PublisherInfo {

	Map<String, Object> mechanic

	MechanicPublisherInfo(String updateProperty, Map<String, Object> mechanic) {
		this.updateObject = 'mechanic'
		this.updateProperty = updateProperty
		this.mechanic = mechanic
	}

}
