package panel.services.data.panel


import grails.gorm.services.Service
import jakarta.inject.Inject
import panel.domains.panel.AppointmentDay
import panel.domains.panel.AppointmentType
import panel.domains.panel.AppointmentTypeValues

@Service(AppointmentTypeValues)
abstract class AppointmentTypeValuesDataService {

	@Inject AppointmentDayDataService appointmentDayDataService
	@Inject AppointmentTypeDataService appointmentTypeDataService

	abstract AppointmentTypeValues find(AppointmentDay appointmentDay, AppointmentType appointmentType)

	abstract AppointmentTypeValues updateAppointmentTypeValues(
		Serializable id, int morning, int afternoon, int total, int max
	)

	AppointmentTypeValues update(AppointmentTypeValues values) {
		AppointmentDay appointmentDay = appointmentDayDataService.find(values.appointmentDay.day)
		AppointmentType appointmentType = appointmentTypeDataService.find(values.appointmentType.code)
		AppointmentTypeValues appointmentTypeValues = find(appointmentDay, appointmentType)
		updateAppointmentTypeValues(
			appointmentTypeValues.id, values.morning, values.afternoon, values.total, values.max
		)
	}

}
