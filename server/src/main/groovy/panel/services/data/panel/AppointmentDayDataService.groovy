package panel.services.data.panel


import grails.gorm.services.Service
import grails.gorm.services.Where
import jakarta.inject.Inject
import panel.domains.panel.AppointmentDay

import java.time.LocalDate

@Service(AppointmentDay)
abstract class AppointmentDayDataService {

	@Inject AppointmentTypeDataService appointmentTypeDataService
	@Inject AppointmentTypeValuesDataService appointmentTypeValuesDataService

	abstract AppointmentDay find(LocalDate day)

	@Where({ day >= from })
	abstract List<AppointmentDay> findAll(LocalDate from)

	abstract AppointmentDay save(AppointmentDay appointmentDay)

	List<AppointmentDay> save(List<AppointmentDay> appointmentDays) {
		List<AppointmentDay> savedAppointmentDays = appointmentDays.collect { AppointmentDay appointmentDay ->
			appointmentDay.values.each {
//				it.appointmentDay = appointmentDay
				it.appointmentType = appointmentTypeDataService.find(it.appointmentType.code)
			}
			save(appointmentDay)
		}
		return savedAppointmentDays
	}

	void update(List<AppointmentDay> appointmentDays) {
		appointmentDays.each { AppointmentDay appointmentDay ->
			appointmentDay.values.each {
				appointmentTypeValuesDataService.update(it)
			}
		}
	}

}
