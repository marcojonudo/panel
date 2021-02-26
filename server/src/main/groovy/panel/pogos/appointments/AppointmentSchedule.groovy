package panel.pogos.appointments

import com.fasterxml.jackson.annotation.JsonCreator
import groovy.transform.CompileStatic
import panel.pogos.schedules.Employee
import panel.pogos.schedules.EmployeeSchedule
import panel.pogos.schedules.ScheduleInterval

import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
class AppointmentSchedule {

	EmployeeSchedule mechanic
	String appointmentTypeCode
	ScheduleInterval schedule

	@JsonCreator
    AppointmentSchedule(Map<String, Object> info) {
		mechanic = new EmployeeSchedule(
			day: LocalDate.parse((String) info.day),
			employee: new Employee(code: (String) info.mechanicCode)
		)
		appointmentTypeCode = ((Map<String, Object>) info.appointmentType).code
		schedule = new ScheduleInterval(
			start: LocalTime.parse((String)((Map<String, Object>) info.schedule).start),
			end: LocalTime.parse((String)((Map<String, Object>) info.schedule).end),
		)
	}

}
