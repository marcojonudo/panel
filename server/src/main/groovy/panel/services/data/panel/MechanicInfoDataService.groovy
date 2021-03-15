package panel.services.data.panel


import grails.gorm.services.Service
import panel.domains.panel.MechanicInfo

@Service(MechanicInfo)
interface MechanicInfoDataService {

    MechanicInfo find(long mechanicId)

}
