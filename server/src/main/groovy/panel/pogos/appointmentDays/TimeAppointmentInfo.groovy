package panel.pogos.appointmentDays

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.pogos.appointmentDays.AppointmentType.AppointmentTypeCode

import java.time.LocalTime

@CompileStatic
@TupleConstructor
class TimeAppointmentInfo {

	LocalTime start
	int duration
	List<AppointmentTypeCode> codes

}
