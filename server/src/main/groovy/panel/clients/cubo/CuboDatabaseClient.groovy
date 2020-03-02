package panel.clients.cubo

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import panel.pogos.MechanicAppointment
import panel.utils.Constants
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.EmployeeScheduleAppointment

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/cubo")
@Header(name = "database", value = "cubo")
interface CuboDatabaseClient extends CuboDatabaseApi {

	@Get("/mechanics")
	List<EmployeeSchedule> getMechanics(
			@QueryValue @Format(Constants.DATE_DB_PATTERN) Date from,
			@QueryValue boolean fixedSchedules
	)

	@Put("/mechanic/position")
	void updateMechanicsPosition(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	@Put("/mechanic/lines")
	void updateMechanicLines(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	@Put("/mechanic/jobLineType")
	void updateMechanicJobLineType(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	@Post("/appointment/schedule")
	EmployeeScheduleAppointment createAppointment(
			@Header String sessionId,
			@Body MechanicAppointment mechanicAppointment
	)

	@Patch("/appointment/schedule")
	void updateAppointmentSchedule(
			@Header String sessionId,
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

}
