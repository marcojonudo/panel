package panel.services.data.panel

import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.panel.MechanicPanelInfo

@Service(MechanicPanelInfo)
interface MechanicPanelInfoDataService {

    MechanicPanelInfo find(long mechanicId)

    MechanicPanelInfo save(long mechanicId, String position)

    @Where({ mechanicId in mechanicsIds })
    List<MechanicPanelInfo> findAll(List<Long> mechanicsIds)

    MechanicPanelInfo update(Serializable id, int lines)

    MechanicPanelInfo update(Serializable id, boolean show, String position)

    MechanicPanelInfo update(Serializable id, String jobLineType)

}
