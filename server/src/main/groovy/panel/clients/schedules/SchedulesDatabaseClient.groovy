package panel.clients.schedules

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import panel.utils.Constants
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.EmployeeScheduleAppointment

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/schedules")
@Header(name = "database", value = "cubo")
interface SchedulesDatabaseClient extends SchedulesDatabaseApi {

	@Get("/mechanics")
	List<EmployeeSchedule> getMechanics(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date day, @QueryValue boolean fixedSchedules)

	@Get("/employeesSchedulesPosition")
	List<Map> updateEmployeesSchedulesPosition(@Body List<EmployeeSchedule> employeesSchedules)

	@Put("/mechanic/position")
	void updateMechanicsPosition(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	@Put("/mechanic/lines")
	void updateMechanicLines(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	@Post("/mechanic/appointments")
	EmployeeScheduleAppointment createMechanicAppointmentsSchedules(
			@Header String sessionId,
			@Body List<Map<String, Object>> mechanics,
			@QueryValue boolean morning
	)

	@Put("/mechanic/appointments")
	void updateMechanicAppointmentsSchedules(
			@Header String sessionId,
			@Body List<Map<String, Object>> mechanics,
			@QueryValue boolean morning
	)

	@Delete("/mechanic/appointments")
	void deleteMechanicAppointmentSchedule(
			@Header String sessionId,
			@Body List<Map<String, Object>> mechanics
	)

}
