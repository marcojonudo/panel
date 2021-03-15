package panel.services.data.skills

import grails.gorm.multitenancy.CurrentTenant
import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.skills.Skill
import panel.domains.skills.SkillEmployee
import panel.domains.skills.SkillEmployee.SkillExpertise

import javax.inject.Inject
import java.time.LocalDate

@Service(SkillEmployee)
abstract class SkillEmployeeDataService {

	@Inject private SkillDataService skillDataService

	abstract SkillEmployee find(Skill skill, String employeeCode)

	@Where({ employeeCode in codes })
	abstract List<SkillEmployee> findAll(List<String> codes)

	abstract SkillEmployee save(Skill skill, String employeeCode, SkillExpertise expertise, LocalDate month)

	abstract SkillEmployee update(Serializable id, SkillExpertise expertise)

	void update(SkillEmployee skillEmployee) {
		Skill skill = skillDataService.find(skillEmployee.skill.name)
		SkillEmployee savedSkillEmployee = find(skill, skillEmployee.employeeCode)
		update(savedSkillEmployee.id, skillEmployee.expertise)
	}

}
