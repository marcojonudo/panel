package panel.pogos

import groovy.transform.CompileStatic
import utils.pogos.panel.AppointmentDay

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
