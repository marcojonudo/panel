package panel.services.data.schedules

import grails.gorm.services.Service
import panel.domains.schedules.Centre

@Service(Centre)
interface CentreDataService {

	Centre find()

}
