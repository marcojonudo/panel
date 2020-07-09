package panel.services

import groovy.transform.CompileStatic
import panel.clients.cubo.CuboDatabaseClient
import panel.pogos.appointmentDays.AppointmentType.AppointmentTypeCode
import panel.pogos.eCommerce.getSchedules.DayEcommerceSchedule
import panel.pogos.eCommerce.getSchedules.EcommerceSchedule
import panel.pogos.eCommerce.getSchedules.GetEcommerceScheduleError
import panel.pogos.eCommerce.getSchedules.GetEcommerceSchedulesInfo
import panel.pogos.schedules.EmployeeSchedule
import panel.pogos.schedules.MechanicAppointment
import panel.pogos.schedules.Schedule
import panel.pogos.schedules.ScheduleInterval
import panel.utils.Constants

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
class EcommerceService {

	@Inject private CuboDatabaseClient cuboDatabaseClient

	GetEcommerceSchedulesInfo findSchedules(LocalDate from, LocalDate to) {
		List<MechanicAppointment> mechanicsAppointments = cuboDatabaseClient.getMechanicAppointments(
			from,
			to,
			Constants.ECOMMERCE_APPOINTMENT_TYPE_CODES
		)
		List<DayEcommerceSchedule> daysEcommerceSchedules
		if (mechanicsAppointments) {
			daysEcommerceSchedules = buildAppointmentsSchedules(mechanicsAppointments)
			return new GetEcommerceSchedulesInfo(daysEcommerceSchedules)
		}
		List<EmployeeSchedule> mechanics = cuboDatabaseClient.getMechanics(from, to, false)
		daysEcommerceSchedules = buildMechanicsSchedules(mechanics)
		return daysEcommerceSchedules ?
			new GetEcommerceSchedulesInfo(daysEcommerceSchedules, GetEcommerceScheduleError.NO_APPOINTMENTS) :
			new GetEcommerceSchedulesInfo([], GetEcommerceScheduleError.NO_SCHEDULES)
	}

	/**
	 * Construye los horarios de eCommerce a partir de los horarios de citas de panel
	 * @param mechanicsAppointments Lista de citas
	 * @return Lista de horarios de eCommerce
	 */
	static List<DayEcommerceSchedule> buildAppointmentsSchedules(List<MechanicAppointment> mechanicsAppointments) {
		List<DayEcommerceSchedule> daysEcommerceSchedules = []
		mechanicsAppointments.each { MechanicAppointment mechanicAppointment ->
			AppointmentTypeCode appointmentTypeCode = findAppointmentTypeCode(mechanicAppointment.appointmentTypeCode)
			updateEmployeeSchedule(
				daysEcommerceSchedules,
				mechanicAppointment.mechanic.day,
				appointmentTypeCode,
				[mechanicAppointment.schedule]
			)
		}
		return daysEcommerceSchedules
	}

	/**
	 * Construye los horarios de eCommerce a partir de los horarios de mecánicos
	 * @param mechanics Lista de mecánicos
	 * @return Lista de horarios de eCommerce
	 */
	static List<DayEcommerceSchedule> buildMechanicsSchedules(List<EmployeeSchedule> mechanics) {
		List<DayEcommerceSchedule> daysEcommerceSchedules = []
		mechanics.each { EmployeeSchedule mechanic ->
			AppointmentTypeCode appointmentTypeCode = AppointmentTypeCode.ECO
			List<ScheduleInterval> intervals = buildScheduleIntervals(mechanic.schedule)
			updateEmployeeSchedule(daysEcommerceSchedules, mechanic.day, appointmentTypeCode, intervals)
		}
		return daysEcommerceSchedules
	}

	/**
	 * Actualiza los horarios de eCommerce
	 * @param daysEcommerceSchedules Lista de horarios de eCommerce para distintos días
	 * @param day Día
	 * @param appointmentTypeCode Código de cita
	 * @param intervals Nuevos horarios
	 */
	static void updateEmployeeSchedule(
			List<DayEcommerceSchedule> daysEcommerceSchedules,
			LocalDate day,
			AppointmentTypeCode appointmentTypeCode,
			List<ScheduleInterval> intervals
	) {
		DayEcommerceSchedule existentDaySchedules = findDayEcommerceSchedule(daysEcommerceSchedules, day)
		if (existentDaySchedules) {
			EcommerceSchedule existentTypeEcommerceSchedule = findTypeEcommerceSchedule(
				existentDaySchedules.schedules,
				appointmentTypeCode
			)
			if (existentTypeEcommerceSchedule) {
				existentTypeEcommerceSchedule.intervals += intervals
			} else {
				existentDaySchedules.schedules << new EcommerceSchedule(
					intervals, appointmentTypeCode
				)
			}
		} else {
			EcommerceSchedule ecommerceSchedule = new EcommerceSchedule(
				intervals, appointmentTypeCode
			)
			daysEcommerceSchedules << new DayEcommerceSchedule(day, [ecommerceSchedule])
		}
	}

	/**
	 * Decide el tipo de cita (ECO o TP) en función del tipo recibido
	 * @param mechanicAppointmentTypeCode Tipo de cita del mecánico
	 * @return TIpo de cita final
	 */
	static AppointmentTypeCode findAppointmentTypeCode(String mechanicAppointmentTypeCode) {
		AppointmentTypeCode mechanicAppointmentType = AppointmentTypeCode.values().find {
			it.toString() == mechanicAppointmentTypeCode
		}
		AppointmentTypeCode appointmentTypeCode = mechanicAppointmentType == AppointmentTypeCode.TP ?
			mechanicAppointmentType : AppointmentTypeCode.ECO
		return appointmentTypeCode
	}

	/**
	 * Encuentra un día con horarios de eCommerce dentro de la lista, si existe
	 * @param daysEcommerceSchedules Lista con días de horarios de eCommerce
	 * @param day Día
	 * @return Día con horarios encontrado
	 */
	static DayEcommerceSchedule findDayEcommerceSchedule(
			List<DayEcommerceSchedule> daysEcommerceSchedules,
			LocalDate day
	) {
		return daysEcommerceSchedules.find { it.day == day }
	}

	/**
	 * Encuentra un tipo de horario de eCommerce, si existe
	 * @param ecommerceSchedules Lista de horarios de un día
	 * @param appointmentTypeCode Código de cita
	 * @return Horario de un tipo de cita
	 */
	static EcommerceSchedule findTypeEcommerceSchedule(
			List<EcommerceSchedule> ecommerceSchedules,
			AppointmentTypeCode appointmentTypeCode
	) {
		return ecommerceSchedules.find { it.type == appointmentTypeCode }
	}

	/**
	 * Construye una lista de ScheduleInterval a partir de un Schedule deprecated
	 * @param schedule Horario con información de mañana y tarde
	 * @return Lista de intervalos de horarios
	 */
	static List<ScheduleInterval> buildScheduleIntervals(Schedule schedule) {
		List<ScheduleInterval> intervals = []
		if (schedule.morningStart) {
			intervals << new ScheduleInterval(
					start: schedule.morningStart,
					end: schedule.morningEnd
			)
		}
		if (schedule.afternoonStart) {
			intervals << new ScheduleInterval(
					start: schedule.afternoonStart,
					end: schedule.afternoonEnd
			)
		}
		return intervals
	}

}
