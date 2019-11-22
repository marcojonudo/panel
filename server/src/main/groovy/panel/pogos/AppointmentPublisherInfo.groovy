package panel.pogos

import groovy.transform.CompileStatic

@CompileStatic
class AppointmentPublisherInfo extends PublisherInfo {

	Map<String, Object> appointment

	AppointmentPublisherInfo(String updateProperty, Map<String, Object> appointment) {
		this.updateObject = 'appointment'
		this.updateProperty = updateProperty
		this.appointment = appointment
	}

}
