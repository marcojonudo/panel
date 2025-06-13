package panel.services.data

import grails.gorm.services.Service
import panel.domains.AppointmentType

@Service(AppointmentType)
interface AppointmentTypeDataService {

	AppointmentType find(AppointmentType.Code code)

	List<AppointmentType> findAll()

}
