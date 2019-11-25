package panel.clients.cubo

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.*
import io.micronaut.http.client.annotation.Client
import utils.pogos.schedules.EmployeeScheduleAppointment

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/cubo")
@Header(name = "database", value = "cubo")
interface CuboDatabaseClient extends CuboDatabaseApi {

	@Post("/appointment/schedule")
	EmployeeScheduleAppointment createAppointment(
			@Header String sessionId,
			@Body Map<String, Object> appointment,
			@QueryValue long mechanicId
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

	@Put("/appointment/schedule")
	void updateAppointmentSchedule(
			@Header String sessionId,
			@Body Map<String, Object> appointment
	)

}
