package panel.services.data.panel


import grails.gorm.services.Service
import grails.gorm.services.Where
import jakarta.inject.Inject
import panel.domains.panel.MechanicAppointment
import panel.domains.schedules.EmployeeSchedule
import panel.domains.schedules.ScheduleInterval
import panel.services.data.schedules.EmployeeScheduleDataService
import panel.services.data.schedules.ScheduleIntervalDataService

import java.time.LocalDate
import java.time.LocalTime

@Service(MechanicAppointment)
abstract class MechanicAppointmentDataService {

	@Inject EmployeeScheduleDataService employeeScheduleDataService
	@Inject ScheduleIntervalDataService scheduleIntervalDataService

	abstract List<MechanicAppointment> findAllMechanicAppointments(long mechanicId)

	@Where({ mechanicId in ids && appointmentTypeCode in codes})
	abstract List<MechanicAppointment> findAll(List<Long> ids, List<String> codes)

	@Where({ mechanicId == mechanicId && appointmentTypeCode == appointmentTypeCode && intervalId == intervalId })
	abstract MechanicAppointment find(long mechanicId, String appointmentTypeCode, long intervalId)

	abstract void delete(Serializable id)

	abstract MechanicAppointment save(MechanicAppointment mechanicAppointment)

	abstract MechanicAppointment update(Serializable id, long intervalId)

	List<MechanicAppointment> findAll(LocalDate from, LocalDate to, List<String> codes) {
		List<Long> ids = employeeScheduleDataService.findAllIds(from, to)
		return findAll(ids, codes)
	}

	List<MechanicAppointment> findAll(long mechanicId) {
		List<MechanicAppointment> appointments = findAllMechanicAppointments(mechanicId)
		appointments.each {
			it.interval = scheduleIntervalDataService.find(it.intervalId)
		}
		return appointments
	}

	void save(LocalDate day, String mechanicCode, MechanicAppointment mechanicAppointment) {
		EmployeeSchedule mechanic = employeeScheduleDataService.find(day, mechanicCode)
		ScheduleInterval interval = scheduleIntervalDataService.find(
			mechanicAppointment.interval.start, mechanicAppointment.interval.end
		)
		mechanicAppointment.mechanicId = mechanic.id
		mechanicAppointment.intervalId = interval.id
		save(mechanicAppointment)
	}

	void update(
		LocalDate day,
		String mechanicCode,
		String appointmentTypeCode,
		LocalTime lastStart,
		LocalTime lastEnd,
		ScheduleInterval interval
	) {
		EmployeeSchedule mechanic = employeeScheduleDataService.find(day, mechanicCode)
		ScheduleInterval lastInterval = scheduleIntervalDataService.findScheduleInterval(lastStart, lastEnd)
		MechanicAppointment mechanicAppointment = find(mechanic.id, appointmentTypeCode, lastInterval.id)
		ScheduleInterval dbInterval = scheduleIntervalDataService.find(interval.start, interval.end)
		update(mechanicAppointment.id, dbInterval.id)
	}

	void delete(
		LocalDate day, String mechanicCode, String appointmentTypeCode, LocalTime lastStart, LocalTime lastEnd
	) {
		EmployeeSchedule mechanic = employeeScheduleDataService.find(day, mechanicCode)
		ScheduleInterval lastInterval = scheduleIntervalDataService.findScheduleInterval(lastStart, lastEnd)
		MechanicAppointment mechanicAppointment = find(mechanic.id, appointmentTypeCode, lastInterval.id)
		delete(mechanicAppointment.id)
	}

}
