package panel.services.data.panel


import grails.gorm.services.Service
import panel.domains.panel.Group

@Service(Group)
interface GroupDataService {

	Group find(int code)

}
