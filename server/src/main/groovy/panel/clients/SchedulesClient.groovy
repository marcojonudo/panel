package panel.clients

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client
import jakarta.inject.Singleton
import panel.pogos.schedules.EmployeeSchedule
import panel.pogos.schedules.skills.Skill
import panel.utils.Constants

import java.time.LocalDate

@Singleton
@CompileStatic
@Client("\${services.schedules.url}")
interface SchedulesClient {

	@Get("/mechanics")
	List<EmployeeSchedule> findMechanics(
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate from,
		@QueryValue @Format(Constants.DateFormat.yyyy_MM_dd) LocalDate to
	)

	@Get("/skills")
	List<Skill> findSkills()

}
