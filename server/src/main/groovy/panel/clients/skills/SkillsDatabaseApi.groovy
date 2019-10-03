package panel.clients.skills

import groovy.transform.CompileStatic

import javax.inject.Singleton

@Singleton
@CompileStatic
interface SkillsDatabaseApi {

	List<Map> getMechanicsSkills()

}
