package panel.services.data

import grails.gorm.services.Service
import panel.domains.JobLineType

@Service(JobLineType)
interface JobLineTypeDataService {

	List<JobLineType> findAll()

}
