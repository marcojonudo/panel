package panel.clients.skills

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.client.annotation.Client
import utils.pogos.skills.Skill

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/panel")
@Header(name = "database", value = "cubo")
interface SkillsDatabaseClient {

	@Get("/mechanicsSkills")
	List<Skill> getMechanicsSkills()

}
