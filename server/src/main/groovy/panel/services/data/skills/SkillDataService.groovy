package panel.services.data.skills

import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.schedules.JobPositionGroup
import panel.domains.skills.Skill

@Service(Skill)
interface SkillDataService {

//	@Query("""
//		select $skill
//		from ${Skill skill}
//		inner join ${SkillCategory category = skill.category}
//		where $category.jobPositionGroupCode = $jobPositionGroupCode
//	""")
	@Where({ category.jobPositionGroupCode == jobPositionGroupCode })
	List<Skill> findAll(JobPositionGroup.Code jobPositionGroupCode)

	Skill find(String name)

}
