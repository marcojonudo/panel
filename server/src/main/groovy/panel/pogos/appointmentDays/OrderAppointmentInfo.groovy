package panel.pogos.appointmentDays

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor

@CompileStatic
@TupleConstructor
class OrderAppointmentInfo {

	int orderNumber
	TimeAppointmentInfo previousInfo
	TimeAppointmentInfo newInfo

}

