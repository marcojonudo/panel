package schedules.services.data.skills

import grails.gorm.services.Service
import grails.gorm.services.Where
import schedules.domains.skills.SkillEmployee

@Service(SkillEmployee)
interface SkillEmployeeDataService {

	@Where({ employeeCode in codes })
	List<SkillEmployee> findAll(List<String> codes)

}
