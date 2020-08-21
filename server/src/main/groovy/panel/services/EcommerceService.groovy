package panel.services

import groovy.transform.CompileStatic
import io.micronaut.runtime.server.EmbeddedServer
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import panel.clients.CuboDatabaseClient
import panel.clients.IfvClient
import panel.clients.PanelDatabaseClient
import panel.pogos.appointmentDays.AppointmentType.AppointmentTypeCode
import panel.pogos.cards.Card
import panel.pogos.cards.Group
import panel.pogos.cards.OrderInfo
import panel.pogos.eCommerce.confirm.ConfirmAppointmentInfo
import panel.pogos.eCommerce.getSchedules.DayEcommerceSchedule
import panel.pogos.eCommerce.getSchedules.EcommerceSchedule
import panel.pogos.eCommerce.getSchedules.GetEcommerceSchedulesInfo
import panel.pogos.eCommerce.getSchedules.OldEcommerceSchedule
import panel.pogos.eCommerce.save.EcommerceCard
import panel.pogos.eCommerce.save.SaveEcommerceCardInfo
import panel.pogos.ifv.getSchedules.GetSchedulesBody
import panel.pogos.ifv.getSchedules.GetSchedulesResponse
import panel.pogos.schedules.MechanicAppointment
import panel.pogos.schedules.ScheduleInterval
import panel.utils.Constants

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate
import java.time.LocalTime

@Singleton
@CompileStatic
class EcommerceService {

	private static final Logger LOG = LoggerFactory.getLogger(EcommerceService)

	@Inject private EmbeddedServer embeddedServer
	@Inject private PanelDatabaseClient panelDatabaseClient
	@Inject private CuboDatabaseClient cuboDatabaseClient
	@Inject private IfvClient ifvClient

	// region Get schedules

	GetEcommerceSchedulesInfo findSchedules(LocalDate from, LocalDate to) {
		int centreCode = findCentreCode()
		GetSchedulesResponse schedulesResponse = ifvClient.getSchedules(new GetSchedulesBody(centreCode, from, to))
		List<DayEcommerceSchedule> daysEcommerceSchedules = schedulesResponse.data.collect {
			List<EcommerceSchedule> typesSchedules = [
				new EcommerceSchedule(AppointmentTypeCode.ECO, [new ScheduleInterval(start: it.start, end: it.end)]),
				new EcommerceSchedule(AppointmentTypeCode.TP, [new ScheduleInterval(start: it.start, end: it.end)])
			]
			return new DayEcommerceSchedule(it.day, typesSchedules)
		}
		List<List<OldEcommerceSchedule>> schedules = daysEcommerceSchedules.collect { DayEcommerceSchedule daySchedule ->
			return daySchedule.schedules.collect { new OldEcommerceSchedule(daySchedule.day, it) }
		}
		return new GetEcommerceSchedulesInfo(schedules)
//		List<IfvCentreSchedule> ifvCentreSchedules = newIfvService.getCentreSchedules(Centre.code ?: 17, from, to)
//
//		to = to ?: from + daysNumber
//		schedules = (from..to).collect { Date day ->
//			List<EcommerceSchedule> ecommerceSchedules = []
//			if (day.getTime() >= ecommerceLine.threshold.getTime()) {
//				IfvCentreSchedule ifvCentreSchedule = ifvCentreSchedules.find { it.day.time == day.time }
//				if (ifvCentreSchedule) {
//					ScheduleInterval scheduleInterval = new ScheduleInterval(ifvCentreSchedule.start, ifvCentreSchedule.end)
//					ecommerceSchedules = [
//						new EcommerceSchedule(ifvCentreSchedule.day, "ECO", [scheduleInterval]),
//						new EcommerceSchedule(ifvCentreSchedule.day, "TP", [scheduleInterval])
//					]
//				}
//			}
//			return ecommerceSchedules
//		}




//		List<MechanicAppointment> mechanicsAppointments = cuboDatabaseClient.getMechanicAppointments(
//			from, to, Constants.ECOMMERCE_APPOINTMENT_TYPE_CODES
//		)
//		List<DayEcommerceSchedule> daysEcommerceSchedules
//		if (mechanicsAppointments) {
//			daysEcommerceSchedules = buildAppointmentsSchedules(mechanicsAppointments)
//			return new GetEcommerceSchedulesInfo(daysEcommerceSchedules)
//		}
//		List<EmployeeSchedule> mechanics = cuboDatabaseClient.getMechanics(from, to, false)
//		daysEcommerceSchedules = buildMechanicsSchedules(mechanics)
//		return daysEcommerceSchedules ?
//			new GetEcommerceSchedulesInfo(daysEcommerceSchedules, GetEcommerceScheduleError.NO_APPOINTMENTS) :
//			new GetEcommerceSchedulesInfo([], GetEcommerceScheduleError.NO_SCHEDULES)
	}

	int findCentreCode() {
		return embeddedServer.host ==~ /([A-Z]*)(\d*)/ ? embeddedServer.host[3..-1] as int : 39
	}

//	/**
//	 * Construye los horarios de eCommerce a partir de los horarios de citas de panel
//	 * @param mechanicsAppointments Lista de citas
//	 * @return Lista de horarios de eCommerce
//	 */
//	static List<DayEcommerceSchedule> buildAppointmentsSchedules(List<MechanicAppointment> mechanicsAppointments) {
//		List<DayEcommerceSchedule> daysEcommerceSchedules = []
//		mechanicsAppointments.each { MechanicAppointment mechanicAppointment ->
//			AppointmentTypeCode appointmentTypeCode = findAppointmentTypeCode(mechanicAppointment.appointmentTypeCode)
//			updateEmployeeSchedule(
//				daysEcommerceSchedules,
//				mechanicAppointment.mechanic.day,
//				appointmentTypeCode,
//				[mechanicAppointment.schedule]
//			)
//		}
//		return daysEcommerceSchedules
//	}
//
//	/**
//	 * Construye los horarios de eCommerce a partir de los horarios de mecánicos
//	 * @param mechanics Lista de mecánicos
//	 * @return Lista de horarios de eCommerce
//	 */
//	static List<DayEcommerceSchedule> buildMechanicsSchedules(List<EmployeeSchedule> mechanics) {
//		List<DayEcommerceSchedule> daysEcommerceSchedules = []
//		mechanics.each { EmployeeSchedule mechanic ->
//			AppointmentTypeCode appointmentTypeCode = AppointmentTypeCode.ECO
//			List<ScheduleInterval> intervals = buildScheduleIntervals(mechanic.schedule)
//			updateEmployeeSchedule(daysEcommerceSchedules, mechanic.day, appointmentTypeCode, intervals)
//		}
//		return daysEcommerceSchedules
//	}
//
//	/**
//	 * Actualiza los horarios de eCommerce
//	 * @param daysEcommerceSchedules Lista de horarios de eCommerce para distintos días
//	 * @param day Día
//	 * @param appointmentTypeCode Código de cita
//	 * @param intervals Nuevos horarios
//	 */
//	static void updateEmployeeSchedule(
//		List<DayEcommerceSchedule> daysEcommerceSchedules,
//		LocalDate day,
//		AppointmentTypeCode appointmentTypeCode,
//		List<ScheduleInterval> intervals
//	) {
//		DayEcommerceSchedule existentDaySchedules = findDayEcommerceSchedule(daysEcommerceSchedules, day)
//		if (existentDaySchedules) {
//			EcommerceSchedule existentTypeEcommerceSchedule = findTypeEcommerceSchedule(
//				existentDaySchedules.schedules,
//				appointmentTypeCode
//			)
//			if (existentTypeEcommerceSchedule) {
//				existentTypeEcommerceSchedule.intervals += intervals
//			} else {
//				existentDaySchedules.schedules << new EcommerceSchedule(
//					appointmentTypeCode, intervals
//				)
//			}
//		} else {
//			EcommerceSchedule ecommerceSchedule = new EcommerceSchedule(
//				appointmentTypeCode, intervals
//			)
//			daysEcommerceSchedules << new DayEcommerceSchedule(day, [ecommerceSchedule])
//		}
//	}
//
//	/**
//	 * Decide el tipo de cita (ECO o TP) en función del tipo recibido
//	 * @param mechanicAppointmentTypeCode Tipo de cita del mecánico
//	 * @return Tipo de cita final
//	 */
//	static AppointmentTypeCode findAppointmentTypeCode(String mechanicAppointmentTypeCode) {
//		AppointmentTypeCode mechanicAppointmentType = AppointmentTypeCode.values().find {
//			it.toString() == mechanicAppointmentTypeCode
//		}
//		AppointmentTypeCode appointmentTypeCode = mechanicAppointmentType == AppointmentTypeCode.TP ?
//			mechanicAppointmentType : AppointmentTypeCode.ECO
//		return appointmentTypeCode
//	}
//
//	/**
//	 * Encuentra un día con horarios de eCommerce dentro de la lista, si existe
//	 * @param daysEcommerceSchedules Lista con días de horarios de eCommerce
//	 * @param day Día
//	 * @return Día con horarios encontrado
//	 */
//	static DayEcommerceSchedule findDayEcommerceSchedule(
//		List<DayEcommerceSchedule> daysEcommerceSchedules,
//		LocalDate day
//	) {
//		return daysEcommerceSchedules.find { it.day == day }
//	}
//
//	/**
//	 * Encuentra un tipo de horario de eCommerce, si existe
//	 * @param ecommerceSchedules Lista de horarios de un día
//	 * @param appointmentTypeCode Código de cita
//	 * @return Horario de un tipo de cita
//	 */
//	static EcommerceSchedule findTypeEcommerceSchedule(
//		List<EcommerceSchedule> ecommerceSchedules,
//		AppointmentTypeCode appointmentTypeCode
//	) {
//		return ecommerceSchedules.find { it.type == appointmentTypeCode }
//	}
//
//	/**
//	 * Construye una lista de ScheduleInterval a partir de un Schedule deprecated
//	 * @param schedule Horario con información de mañana y tarde
//	 * @return Lista de intervalos de horarios
//	 */
//	static List<ScheduleInterval> buildScheduleIntervals(Schedule schedule) {
//		List<ScheduleInterval> intervals = []
//		if (schedule.morningStart) {
//			intervals << new ScheduleInterval(
//				start: schedule.morningStart,
//				end: schedule.morningEnd
//			)
//		}
//		if (schedule.afternoonStart) {
//			intervals << new ScheduleInterval(
//				start: schedule.afternoonStart,
//				end: schedule.afternoonEnd
//			)
//		}
//		return intervals
//	}

	// endregion

	// region Save card

	SaveEcommerceCardInfo saveCard(
		LocalDate day, LocalTime start, int duration, int groupCode, AppointmentTypeCode type
	) {
		LocalTime end = start.plusMinutes(duration)
		String code = findEcommerceCardCode()

		List<MechanicAppointment> mechanicsAppointments = cuboDatabaseClient.getMechanicAppointments(
			day, day, Constants.ECOMMERCE_CARD_APPOINTMENT_TYPE_CODES.value
		)
		/* Si no hay mecánicos con citas, se devuelve una respuesta mockeada */
		if (!mechanicsAppointments) {
			LOG.info("[$day][$start][$duration][$type] No mechanics with appointments schedules available")
			return mockSaveEcommerceCardInfo(day, start, end, code)
		}

		List<Card> cards = panelDatabaseClient.findCards(day, mechanicsAppointments.mechanic.employee.code)
		List<MechanicAppointment> availableMechanics = findAvailableSchedules(
			mechanicsAppointments, start, start.plusMinutes(duration), cards
		)
		if (!availableMechanics) {
			LOG.info("[$day][$start][$duration][$type] No available schedules")
			return mockSaveEcommerceCardInfo(day, start, end, code)
		}

		Group group = panelDatabaseClient.findGroup(groupCode)
		String mechanicCode = availableMechanics[0].mechanic.employee.code
		Card card = new Card(
			code, day, start, duration, mechanicCode, 1, group, new OrderInfo(code: code)
		)
		panelDatabaseClient.createCards("", [card.properties], false)
		return new SaveEcommerceCardInfo(new EcommerceCard(day, start, end, code, "TEMPORAL"))
	}

	private static List<MechanicAppointment> findAvailableSchedules(
		List<MechanicAppointment> mechanicsAppointments, LocalTime start, LocalTime end, List<Card> cards
	) {
		return mechanicsAppointments.findAll {
			boolean availableSchedule = it.schedule.start <= start && it.schedule.end >= end
			if (availableSchedule) {
				return !cards.findAll { findOverlappedCard(it, start, end) }
			}
			return false
		}
	}

	private String findEcommerceCardCode() {
		String lastEcommerceCode = panelDatabaseClient.findLastEcommerceCode()
		return buildEcommerceCardCode(lastEcommerceCode)
	}

	private static boolean findOverlappedCard(Card existentCard, LocalTime start, LocalTime end) {
		LocalTime cardEnd = existentCard.start.plusMinutes(existentCard.duration)
		return (start <= existentCard.start && end > existentCard.start) ||
			(end >= cardEnd && start < cardEnd) ||
			(start > existentCard.start && end < cardEnd)
	}

	private static SaveEcommerceCardInfo mockSaveEcommerceCardInfo(
		LocalDate day,
		LocalTime start,
		LocalTime end,
		String code
	) {
		EcommerceCard card = new EcommerceCard(
			day, start, end, code, "TEMPORAL"
		)
		return new SaveEcommerceCardInfo(card)
	}

	private static String buildEcommerceCardCode(String lastEcommerceCode) {
		return "${AppointmentTypeCode.ECO.toString()}${lastEcommerceCode ? ((lastEcommerceCode[3..-1] as int) + 1) : 1}"
	}

	// endregion

	// region Confirm card

	ConfirmAppointmentInfo confirmAppointment(String code) {
		Card card = panelDatabaseClient.findCard(code)
		if (!card) {
			return new ConfirmAppointmentInfo(
				"$Constants.NON_EXISTENT_CARD$code",
				ConfirmAppointmentInfo.Error.NON_EXISTENT_CARD
			)
		}
		card.status = Card.Status.CONFIRMED
		panelDatabaseClient.updateStatus(card)
		return new ConfirmAppointmentInfo()
	}

	// endregion

}
