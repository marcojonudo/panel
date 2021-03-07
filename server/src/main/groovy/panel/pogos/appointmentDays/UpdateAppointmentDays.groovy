package panel.pogos.appointmentDays

import panel.domains.panel.AppointmentDay
import groovy.transform.CompileStatic

@CompileStatic
class UpdateAppointmentDays {

	List<AppointmentDay> created
	List<AppointmentDay> updated

	UpdateAppointmentDays() {
		created = []
		updated = []
	}

	List<AppointmentDay> getAll() {
		return created + updated
	}

}
