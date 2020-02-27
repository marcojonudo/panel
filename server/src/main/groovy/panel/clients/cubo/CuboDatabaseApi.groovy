package panel.clients.cubo

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import panel.pogos.MechanicAppointment
import panel.utils.Constants
import utils.pogos.schedules.EmployeeSchedule
import utils.pogos.schedules.EmployeeScheduleAppointment

import javax.inject.Singleton

@Singleton
@CompileStatic
interface CuboDatabaseApi {

	List<EmployeeSchedule> getMechanics(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date day, @QueryValue boolean fixedSchedules)

	void updateMechanicsPosition(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	void updateMechanicLines(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	void updateMechanicJobLineType(@Header String sessionId, @Body List<Map<String, Object>> mechanics)

	EmployeeScheduleAppointment createAppointment(
			@Header String sessionId,
			@Body MechanicAppointment mechanicAppointment
	)

	void updateAppointmentType(@Header String sessionId, @Body Map<String, Object> appointment)

	void deleteAppointment(
			@Header String sessionId,
			@QueryValue long id,
			@QueryValue long mechanicId,
			@QueryValue int index
	)

	void updateAppointmentSchedule(@Header String sessionId, @Body Map<String, Object> appointment)

}
