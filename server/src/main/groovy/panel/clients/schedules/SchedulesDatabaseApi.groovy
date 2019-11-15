package panel.clients.schedules

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import panel.utils.Constants
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.EmployeeScheduleAppointment

import javax.inject.Singleton

@Singleton
@CompileStatic
interface SchedulesDatabaseApi {

	List<EmployeeSchedule> getMechanics(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date day, @QueryValue boolean fixedSchedules)

	List<Map> updateEmployeesSchedulesPosition(@Body List<EmployeeSchedule> employeesSchedules)

	void updateMechanicsPosition(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	void updateMechanicLines(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	EmployeeScheduleAppointment createMechanicAppointmentsSchedules(
			@Header String sessionId,
			@Body List<Map<String, Object>> mechanics,
			@QueryValue boolean morning
	)

	void updateMechanicAppointmentsSchedules(
			@Header String sessionId,
			@Body List<Map<String, Object>> mechanics,
			@QueryValue boolean morning
	)

	void deleteMechanicAppointmentSchedule(
			@Header String sessionId,
			@Body List<Map<String, Object>> mechanics,
			@QueryValue boolean morning
	)

}
