package panel.services.data.skills

import grails.gorm.services.Service
import panel.domains.skills.Skill

@Service(Skill)
interface SkillDataService {

	List<Skill> findAll()

	Skill find(String name)

}
