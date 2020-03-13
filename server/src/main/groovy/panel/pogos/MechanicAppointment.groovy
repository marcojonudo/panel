package panel.pogos

import com.fasterxml.jackson.annotation.JsonCreator
import groovy.transform.CompileStatic
import utils.Utils
import utils.pogos.Employee
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.ScheduleInterval

import java.time.LocalTime

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
				start: LocalTime.parse((String)((Map<String, Object>) info.schedule).start),
				end: LocalTime.parse((String)((Map<String, Object>) info.schedule).end),
		)
	}

}
