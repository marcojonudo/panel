package panel.services.data.skills

import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import panel.domains.skills.SkillEmployee
import panel.utils.Constants

@Service(SkillEmployee)
interface SkillEmployeeDataService {

	@Where({ employeeCode in codes })
	List<SkillEmployee> findAll(List<String> codes)

}
