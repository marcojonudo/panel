package panel.services

import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import panel.clients.CuboDatabaseClient
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject
import java.time.LocalDate
import java.time.LocalTime

@MicronautTest
class EcommerceServiceSpec extends Specification {

	// region Collaborators

	@Inject
	EcommerceService ecommerceService

	@Inject
	CuboDatabaseClient cuboDatabaseClient

	@MockBean(CuboDatabaseClient)
	CuboDatabaseClient cuboDatabaseClient() {
		Mock(CuboDatabaseClient)
	}

	// endregion

	// region Variables

	@Shared LocalDate today
	@Shared LocalTime time8
	@Shared LocalTime time15
	@Shared LocalTime time20

	// endregion

	void setupSpec() {
		today = LocalDate.now()
		time8 = LocalTime.of(8, 0)
		time15 = LocalTime.of(15, 0)
		time20 = LocalTime.of(20, 0)
	}

	// region Build appointments schedules

//	void "test build appointments schedules one ECO appointment"() {
//		given:
//		List<MechanicAppointment> mechanicsAppointments = [
//			new MechanicAppointment(
//				mechanic: new EmployeeSchedule(day: today),
//				appointmentTypeCode: AppointmentTypeCode.ECO.toString(),
//				schedule: new ScheduleInterval(start: time8, end: time15)
//			)
//		]
//
//		when:
//		List<DayEcommerceSchedule> daysEcommerceSchedules = ecommerceService.buildAppointmentsSchedules(
//			mechanicsAppointments
//		)
//
//		then:
//		daysEcommerceSchedules.size() == 1
//		daysEcommerceSchedules.schedules.size() == 1
//		daysEcommerceSchedules.schedules[0].intervals.size() == 1
//		daysEcommerceSchedules[0].schedules[0].intervals[0].start == time8
//		daysEcommerceSchedules[0].schedules[0].intervals[0].end == time15
//	}
//
//	void "test build appointments schedules several types appointment same day"() {
//		given:
//		List<MechanicAppointment> mechanicsAppointments = [
//			new MechanicAppointment(
//				mechanic: new EmployeeSchedule(day: today),
//				appointmentTypeCode: AppointmentTypeCode.ECO.toString(),
//				schedule: new ScheduleInterval(start: time8, end: time15)
//			),
//			new MechanicAppointment(
//				mechanic: new EmployeeSchedule(day: today),
//				appointmentTypeCode: AppointmentTypeCode.ECO.toString(),
//				schedule: new ScheduleInterval(start: time15, end: time20)
//			),
//			new MechanicAppointment(
//				mechanic: new EmployeeSchedule(day: today),
//				appointmentTypeCode: AppointmentTypeCode.TP.toString(),
//				schedule: new ScheduleInterval(start: time8, end: time15)
//			)
//		]
//
//		when:
//		List<DayEcommerceSchedule> daysEcommerceSchedules = ecommerceService.buildAppointmentsSchedules(
//			mechanicsAppointments
//		)
//
//		then:
//		daysEcommerceSchedules.size() == 1
//		daysEcommerceSchedules[0].day == today
//		daysEcommerceSchedules[0].schedules.size() == 2
//		daysEcommerceSchedules[0].schedules[0].type == AppointmentTypeCode.ECO
//		daysEcommerceSchedules[0].schedules[0].intervals.size() == 2
//		daysEcommerceSchedules[0].schedules[0].intervals[0].start == time8
//		daysEcommerceSchedules[0].schedules[0].intervals[0].end == time15
//		daysEcommerceSchedules[0].schedules[0].intervals[1].start == time15
//		daysEcommerceSchedules[0].schedules[0].intervals[1].end == time20
//		daysEcommerceSchedules[0].schedules[1].type == AppointmentTypeCode.TP
//		daysEcommerceSchedules[0].schedules[1].intervals.size() == 1
//		daysEcommerceSchedules[0].schedules[1].intervals[0].start == time8
//		daysEcommerceSchedules[0].schedules[1].intervals[0].end == time15
//	}
//
//	void "test build appointments schedules several types appointment several days"() {
//		given:
//		List<MechanicAppointment> mechanicsAppointments = [
//			new MechanicAppointment(
//				mechanic: new EmployeeSchedule(day: today),
//				appointmentTypeCode: AppointmentTypeCode.ECO.toString(),
//				schedule: new ScheduleInterval(start: time8, end: time15)
//			),
//			new MechanicAppointment(
//				mechanic: new EmployeeSchedule(day: today),
//				appointmentTypeCode: AppointmentTypeCode.ECO.toString(),
//				schedule: new ScheduleInterval(start: time15, end: time20)
//			),
//			new MechanicAppointment(
//				mechanic: new EmployeeSchedule(day: today.plusDays(1)),
//				appointmentTypeCode: AppointmentTypeCode.TP.toString(),
//				schedule: new ScheduleInterval(start: time8, end: time15)
//			)
//		]
//
//		when:
//		List<DayEcommerceSchedule> daysEcommerceSchedules = ecommerceService.buildAppointmentsSchedules(
//			mechanicsAppointments
//		)
//
//		then:
//		daysEcommerceSchedules.size() == 2
//		daysEcommerceSchedules[0].day == today
//		daysEcommerceSchedules[0].schedules.size() == 1
//		daysEcommerceSchedules[0].schedules[0].type == AppointmentTypeCode.ECO
//		daysEcommerceSchedules[0].schedules[0].intervals.size() == 2
//		daysEcommerceSchedules[0].schedules[0].intervals[0].start == time8
//		daysEcommerceSchedules[0].schedules[0].intervals[0].end == time15
//		daysEcommerceSchedules[0].schedules[0].intervals[1].start == time15
//		daysEcommerceSchedules[0].schedules[0].intervals[1].end == time20
//		daysEcommerceSchedules[1].day == today.plusDays(1)
//		daysEcommerceSchedules[1].schedules.size() == 1
//		daysEcommerceSchedules[1].schedules[0].type == AppointmentTypeCode.TP
//		daysEcommerceSchedules[1].schedules[0].intervals.size() == 1
//		daysEcommerceSchedules[1].schedules[0].intervals[0].start == time8
//		daysEcommerceSchedules[1].schedules[0].intervals[0].end == time15
//	}
//
//	// endregion
//
//	// region Build schedule intervals
//
//	void "test build schedule intervals morning"() {
//		given:
//		Schedule schedule = new Schedule(
//			morningStart: time8,
//			morningEnd: time15
//		)
//
//		when:
//		List<ScheduleInterval> intervals = ecommerceService.buildScheduleIntervals(schedule)
//
//		then:
//		intervals.size() == 1
//		intervals[0].start == time8
//		intervals[0].end == time15
//	}
//
//	void "test build schedule intervals afternoon"() {
//		given:
//		Schedule schedule = new Schedule(
//			afternoonStart: time15,
//			afternoonEnd: time20
//		)
//
//		when:
//		List<ScheduleInterval> intervals = ecommerceService.buildScheduleIntervals(schedule)
//
//		then:
//		intervals.size() == 1
//		intervals[0].start == time15
//		intervals[0].end == time20
//	}
//
//	void "test build schedule intervals morning and afternoon"() {
//		given:
//		Schedule schedule = new Schedule(
//			morningStart: time8,
//			morningEnd: time15,
//			afternoonStart: time15,
//			afternoonEnd: time20
//		)
//
//		when:
//		List<ScheduleInterval> intervals = ecommerceService.buildScheduleIntervals(schedule)
//
//		then:
//		intervals.size() == 2
//		intervals[0].start == time8
//		intervals[0].end == time15
//		intervals[1].start == time15
//		intervals[1].end == time20
//	}
//
//	// endregion
//
//	// region Build mechanics schedules
//
//	void "test build mechanics schedules one mechanic two schedules"() {
//		given:
//		List<EmployeeSchedule> mechanics = [
//			new EmployeeSchedule(
//				day: today,
//				schedule: new Schedule(
//					morningStart: time8,
//					morningEnd: time15,
//					afternoonStart: time15,
//					afternoonEnd: time20
//				)
//			)
//		]
//
//		when:
//		List<DayEcommerceSchedule> daysEcommerceSchedules = ecommerceService.buildMechanicsSchedules(mechanics)
//
//		then:
//		daysEcommerceSchedules.size() == 1
//		daysEcommerceSchedules[0].day == today
//		daysEcommerceSchedules[0].schedules.size() == 1
//		daysEcommerceSchedules[0].schedules[0].type == AppointmentTypeCode.ECO
//		daysEcommerceSchedules[0].schedules[0].intervals.size() == 2
//		daysEcommerceSchedules[0].schedules[0].intervals[0].start == time8
//		daysEcommerceSchedules[0].schedules[0].intervals[0].end == time15
//		daysEcommerceSchedules[0].schedules[0].intervals[1].start == time15
//		daysEcommerceSchedules[0].schedules[0].intervals[1].end == time20
//	}
//
//	void "test build appointments schedules several types appointment"() {
//		given:
//		List<EmployeeSchedule> mechanics = [
//			new EmployeeSchedule(
//				day: today,
//				schedule: new Schedule(
//					morningStart: time8,
//					morningEnd: time15
//				)
//			),
//			new EmployeeSchedule(
//				day: today,
//				schedule: new Schedule(
//					afternoonStart: time15,
//					afternoonEnd: time20
//				)
//			),
//			new EmployeeSchedule(
//				day: today.plusDays(1),
//				schedule: new Schedule(
//					morningStart: time8,
//					morningEnd: time15,
//					afternoonStart: time15,
//					afternoonEnd: time20
//				)
//			)
//		]
//
//		when:
//		List<DayEcommerceSchedule> daysEcommerceSchedules = ecommerceService.buildMechanicsSchedules(mechanics)
//
//		then:
//		daysEcommerceSchedules.size() == 2
//		daysEcommerceSchedules[0].day == today
//		daysEcommerceSchedules[0].schedules.size() == 1
//		daysEcommerceSchedules[0].schedules[0].type == AppointmentTypeCode.ECO
//		daysEcommerceSchedules[0].schedules[0].intervals.size() == 2
//		daysEcommerceSchedules[0].schedules[0].intervals[0].start == time8
//		daysEcommerceSchedules[0].schedules[0].intervals[0].end == time15
//		daysEcommerceSchedules[0].schedules[0].intervals[1].start == time15
//		daysEcommerceSchedules[0].schedules[0].intervals[1].end == time20
//		daysEcommerceSchedules[1].day == today.plusDays(1)
//		daysEcommerceSchedules[1].schedules.size() == 1
//		daysEcommerceSchedules[1].schedules[0].type == AppointmentTypeCode.ECO
//		daysEcommerceSchedules[1].schedules[0].intervals.size() == 2
//		daysEcommerceSchedules[1].schedules[0].intervals[0].start == time8
//		daysEcommerceSchedules[1].schedules[0].intervals[0].end == time15
//		daysEcommerceSchedules[1].schedules[0].intervals[1].start == time15
//		daysEcommerceSchedules[1].schedules[0].intervals[1].end == time20
//	}
//
//	// endregion
//
//	// region Find schedules
//
//	void "test find schedules appointments schedules"() {
//		given:
//		cuboDatabaseClient.getMechanicAppointments(today, today, Constants.ECOMMERCE_SCHEDULES_APPOINTMENT_TYPE_CODES) >>
//			[
//				new MechanicAppointment(
//					mechanic: new EmployeeSchedule(day: today),
//					appointmentTypeCode: AppointmentTypeCode.ECO.toString(),
//					schedule: new ScheduleInterval(start: time8, end: time15)
//				),
//				new MechanicAppointment(
//					mechanic: new EmployeeSchedule(day: today),
//					appointmentTypeCode: AppointmentTypeCode.ECO.toString(),
//					schedule: new ScheduleInterval(start: time15, end: time20)
//				),
//				new MechanicAppointment(
//					mechanic: new EmployeeSchedule(day: today),
//					appointmentTypeCode: AppointmentTypeCode.TP.toString(),
//					schedule: new ScheduleInterval(start: time8, end: time15)
//				)
//			]
//
//		when:
//		GetEcommerceSchedulesInfo info = ecommerceService.findSchedules(today, today)
//
//		then:
//		!info.error
//		info.schedules.size() == 1
//		info.schedules[0].day == today
//		info.schedules[0].schedules.size() == 2
//		info.schedules[0].schedules[0].type == AppointmentTypeCode.ECO
//		info.schedules[0].schedules[0].intervals.size() == 2
//		info.schedules[0].schedules[0].intervals[0].start == time8
//		info.schedules[0].schedules[0].intervals[0].end == time15
//		info.schedules[0].schedules[0].intervals[1].start == time15
//		info.schedules[0].schedules[0].intervals[1].end == time20
//		info.schedules[0].schedules[1].type == AppointmentTypeCode.TP
//		info.schedules[0].schedules[1].intervals.size() == 1
//		info.schedules[0].schedules[1].intervals[0].start == time8
//		info.schedules[0].schedules[1].intervals[0].end == time15
//	}
//
//	void "test find schedules mechanics schedules"() {
//		given:
//		cuboDatabaseClient.getMechanicAppointments(today, today, Constants.ECOMMERCE_SCHEDULES_APPOINTMENT_TYPE_CODES) >> []
//		cuboDatabaseClient.getMechanics(today, today, false) >> [
//			new EmployeeSchedule(
//				day: today,
//				schedule: new Schedule(
//					morningStart: time8,
//					morningEnd: time15,
//					afternoonStart: time15,
//					afternoonEnd: time20
//				)
//			)
//		]
//
//		when:
//		GetEcommerceSchedulesInfo info = ecommerceService.findSchedules(today, today)
//
//		then:
//		info.error == GetEcommerceScheduleError.NO_APPOINTMENTS
//		info.schedules.size() == 1
//		info.schedules[0].day == today
//		info.schedules[0].schedules.size() == 1
//		info.schedules[0].schedules[0].type == AppointmentTypeCode.ECO
//		info.schedules[0].schedules[0].intervals.size() == 2
//		info.schedules[0].schedules[0].intervals[0].start == time8
//		info.schedules[0].schedules[0].intervals[0].end == time15
//		info.schedules[0].schedules[0].intervals[1].start == time15
//		info.schedules[0].schedules[0].intervals[1].end == time20
//	}

	// endregion

}
