package panel.pogos.cards

import groovy.transform.CompileStatic
import panel.pogos.appointmentDays.AppointmentType

@CompileStatic
class Group {

	Long id
	int code
	String name
	String shortName
	boolean unitsInShortName
	GroupColor color
	List<Task> tasks
	AppointmentType appointmentType

}
