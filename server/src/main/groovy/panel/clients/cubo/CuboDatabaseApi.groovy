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

import javax.annotation.Nullable
import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
interface CuboDatabaseApi {

	List<EmployeeSchedule> getMechanics(
			@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
			@QueryValue @Nullable @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to,
			@QueryValue boolean fixedSchedules
	)

	void updateMechanicsPosition(
			@Header String sessionId,
			@Header realTimeAction,
			@Body List<EmployeeSchedule> mechanics
	)

	void updateMechanicLines(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body List<EmployeeSchedule> mechanics
	)

	void updateMechanicJobLineType(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body EmployeeSchedule mechanic
	)

	EmployeeScheduleAppointment createAppointment(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body MechanicAppointment mechanicAppointment
	)

	void updateAppointmentType(@Header String sessionId, @Body Map<String, Object> appointment)

	void deleteAppointment(
			@Header String sessionId,
			@QueryValue long id,
			@QueryValue long mechanicId,
			@QueryValue int index
	)

	void updateAppointmentSchedule(
			@Header String sessionId,
			@Header String realTimeAction,
			@Body MechanicAppointment mechanicAppointment
	)

	void deleteAppointmentSchedule(
			@Header String sessionId,
			@Body MechanicAppointment mechanicAppointment
	)

	List<utils.pogos.schedules.MechanicAppointment> getMechanicAppointments(
			@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
			@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to,
			@QueryValue List<String> codes
	)

}
