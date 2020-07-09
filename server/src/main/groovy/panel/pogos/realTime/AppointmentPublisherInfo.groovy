package panel.pogos.realTime

import groovy.transform.CompileStatic

@CompileStatic
class AppointmentPublisherInfo extends PublisherInfo {

	Object appointment

	AppointmentPublisherInfo(String updateProperty, Object appointment) {
		this.updateObject = 'appointment'
		this.updateProperty = updateProperty
		this.appointment = appointment
	}

}
