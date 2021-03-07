package panel.services.data.skills

import grails.gorm.services.Service
import panel.domains.skills.SkillCategory

@Service(SkillCategory)
interface SkillCategoryDataService {

	List<SkillCategory> findAll()

}
