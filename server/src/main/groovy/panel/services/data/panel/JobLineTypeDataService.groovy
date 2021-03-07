package panel.services.data.panel

import grails.gorm.services.Service
import panel.domains.panel.JobLineType

@Service(JobLineType)
interface JobLineTypeDataService {

	List<JobLineType> findAll()

}
