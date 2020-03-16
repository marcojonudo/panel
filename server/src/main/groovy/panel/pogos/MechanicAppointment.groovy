package panel.pogos

import com.fasterxml.jackson.annotation.JsonCreator
import groovy.transform.CompileStatic
import utils.pogos.Employee
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.ScheduleInterval

import java.time.Instant
import java.time.LocalTime
import java.time.ZoneId

@CompileStatic
class MechanicAppointment {

	EmployeeSchedule mechanic
	String appointmentTypeCode
	ScheduleInterval schedule

	@JsonCreator
    MechanicAppointment(Map<String, Object> info) {
		mechanic = new EmployeeSchedule(
				day: Instant.ofEpochMilli((long) info.day).atZone(ZoneId.systemDefault()).toLocalDate(),
				employee: new Employee(code: (String) info.mechanicCode)
		)
		appointmentTypeCode = ((Map<String, Object>) info.appointmentType).code
		schedule = new ScheduleInterval(
				start: LocalTime.parse((String)((Map<String, Object>) info.schedule).start),
				end: LocalTime.parse((String)((Map<String, Object>) info.schedule).end),
		)
	}

}
