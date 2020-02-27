package panel.pogos

import groovy.transform.CompileStatic

@CompileStatic
abstract class PublisherInfo {

	static final Map<String, Closure<PublisherInfo>> PUBLISHER_INFO_TYPE = [
	        cards: { String updateProperty, Object cards ->
		        new CardsPublisherInfo(updateProperty, (List<Map<String, Object>>) cards)
	        },
	        mechanic: { String updateProperty, Object mechanics ->
		        new MechanicPublisherInfo(updateProperty, (List<Map<String, Object>>) mechanics)
	        },
	        appointment: { String updateProperty, Object appointment ->
		        new AppointmentPublisherInfo(updateProperty, (MechanicAppointment) appointment)
	        }
	]

	String updateObject
	String updateProperty

	static PublisherInfo findPublisherInfoType(String updateObject, String updateProperty, Object object) {
		return PUBLISHER_INFO_TYPE[updateObject](updateProperty, object)
	}

}
