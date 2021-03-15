package panel.services.data.panel

import grails.gorm.services.Service
import panel.domains.panel.AppointmentType
import panel.domains.panel.AppointmentType.Code

@Service(AppointmentType)
interface AppointmentTypeDataService {

	AppointmentType find(Code code)

	List<AppointmentType> findAll()

}
