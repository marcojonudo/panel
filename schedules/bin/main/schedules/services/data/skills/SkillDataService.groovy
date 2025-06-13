package schedules.services.data.skills

import grails.gorm.services.Service
import grails.gorm.services.Where
import schedules.domains.skills.Skill
import schedules.pogos.JobPositionGroupCode

@Service(Skill)
interface SkillDataService {

//	@Query("""
//		select $skill
//		from ${Skill skill}
//		inner join ${SkillCategory category = skill.category}
//		where $category.jobPositionGroupCode = $jobPositionGroupCode
//	""")
	@Where({ category.jobPositionGroupCode == jobPositionGroupCode })
	List<Skill> findAll(JobPositionGroupCode jobPositionGroupCode)

	Skill find(String name)

}
