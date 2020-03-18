package panel.clients.cubo

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import panel.pogos.MechanicAppointment
import panel.utils.Constants
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.EmployeeScheduleAppointment

import javax.annotation.Nullable
import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/cubo")
@Header(name = "database", value = "cubo")
interface CuboDatabaseClient extends CuboDatabaseApi {

	@Get("/mechanics")
	List<EmployeeSchedule> getMechanics(
			@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
			@QueryValue @Nullable @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to,
			@QueryValue boolean fixedSchedules
	)

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
			@Body MechanicAppointment mechanicAppointment
	)

	@Patch("/appointment/schedule")
	void updateAppointmentSchedule(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body MechanicAppointment mechanicAppointment
	)

	@Put("/appointment/schedule")
	void deleteAppointmentSchedule(
			@Header String sessionId,
			@Body MechanicAppointment mechanicAppointment
	)

	@Put("/appointment/type")
	void updateAppointmentType(
			@Header String sessionId,
			@Body Map<String, Object> appointment
	)

	@Delete("/appointment/type")
	void deleteAppointment(
			@Header String sessionId,
			@QueryValue long id,
			@QueryValue long mechanicId,
			@QueryValue int index
	)

	@Get("/mechanicsAppointments")
	List<utils.pogos.schedules.MechanicAppointment> getMechanicAppointments(
			@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
			@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to,
			@QueryValue List<String> codes
	)

}
