package panel.pogos

import com.fasterxml.jackson.annotation.JsonCreator
import groovy.transform.CompileStatic
import utils.TimeFormat
import utils.Utils
import utils.pogos.Employee
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.ScheduleInterval

@CompileStatic
class MechanicAppointment {

	EmployeeSchedule mechanic
	String appointmentTypeCode
	ScheduleInterval schedule

	@JsonCreator
    MechanicAppointment(Map<String, Object> info) {
		mechanic = new EmployeeSchedule(
				day: Utils.newDate(new Date((long) info.day)),
				employee: new Employee(code: (String) info.mechanicCode)
		)
		appointmentTypeCode = ((Map<String, Object>) info.appointmentType).code
		schedule = new ScheduleInterval(
				start: Utils.parse((String)((Map<String, Object>) info.schedule).start, TimeFormat.HOUR_MINUTE_SECOND),
				end: Utils.parse((String)((Map<String, Object>) info.schedule).end, TimeFormat.HOUR_MINUTE_SECOND),
		)
	}

}
