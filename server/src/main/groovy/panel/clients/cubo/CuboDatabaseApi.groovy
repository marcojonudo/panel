package panel.clients.cubo

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import utils.pogos.schedules.AppointmentType
import utils.pogos.schedules.EmployeeScheduleAppointment

import javax.inject.Singleton

@Singleton
@CompileStatic
interface CuboDatabaseApi {

	EmployeeScheduleAppointment createAppointment(
			@Header String sessionId,
			@Body Map<String, Object> appointment,
			@QueryValue long mechanicId
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
