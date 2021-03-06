package panel.services.data.panel

import grails.gorm.services.Service
import panel.domains.panel.AppointmentType
import panel.domains.panel.AppointmentType.AppointmentTypeCode

@Service(AppointmentType)
interface AppointmentTypeDataService {

	AppointmentType find(AppointmentTypeCode code)

	List<AppointmentType> findAll()

}
