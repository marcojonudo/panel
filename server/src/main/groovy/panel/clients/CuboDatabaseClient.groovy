package panel.clients

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import panel.pogos.appointments.AppointmentSchedule
import panel.pogos.schedules.EmployeeSchedule
import panel.pogos.schedules.EmployeeScheduleAppointment
import panel.pogos.schedules.MechanicAppointment
import panel.pogos.skills.Skill
import panel.utils.Constants

import javax.annotation.Nullable
import javax.inject.Singleton
import java.time.LocalDate
import java.time.LocalTime

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/cubo")
@Header(name = "database", value = "cubo")
interface CuboDatabaseClient {

	@Get("/mechanics")
	List<EmployeeSchedule> getMechanics(
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
		@QueryValue @Nullable @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to,
		@QueryValue boolean fixedSchedules
	)

	@Get("/firstScheduleDay")
	LocalDate getFirstScheduleDay(@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from)

	@Get("/lastScheduleDay")
	LocalDate getLastScheduleDay()

	@Put("/mechanic/position")
	void updateMechanicsPosition(
		@Header String sessionId,
		@Header realTimeAction,
		@Body List<EmployeeSchedule> mechanics
	)

	@Put("/mechanic/lines")
	void updateMechanicLines(
		@Header String sessionId,
		@Header String realTimeAction,
		@Body List<EmployeeSchedule> mechanics
	)

	@Put("/mechanic/jobLineType")
	void updateMechanicJobLineType(
		@Header String sessionId,
		@Header String realTimeAction,
		@Body EmployeeSchedule mechanic
	)

	@Post("/appointment")
	EmployeeScheduleAppointment createAppointment(
		@Header String sessionId,
		@Header String realTimeAction,
		@Body AppointmentSchedule appointmentSchedule
	)

	@Patch("/appointment/schedule")
	void updateAppointmentSchedule(
		@Header String sessionId,
		@Header String realTimeAction,
		@Body AppointmentSchedule appointmentSchedule
	)

	@Delete("/appointment")
	void deleteAppointment(
		@Header String sessionId,
		@Header String realTimeAction,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate day,
		@QueryValue String mechanicCode,
		@QueryValue String typeCode,
		@QueryValue @Format(Constants.TimeFormat.HH_mm) LocalTime start
	)

	@Put("/appointment/type")
	void updateAppointmentType(
		@Header String sessionId,
		@Body Map<String, Object> appointment
	)

	@Get("/mechanicsAppointments")
	List<MechanicAppointment> getMechanicAppointments(
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to,
		@QueryValue List<String> codes
	)

	@Get("/mechanicsSkills")
	List<Skill> getMechanicsSkills()

}
