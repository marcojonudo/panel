package panel.clients.schedules

import groovy.transform.CompileStatic
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.annotation.QueryValue
import io.micronaut.http.client.annotation.Client
import utils.pogos.EmployeeSchedule

import javax.inject.Singleton

@Singleton
@CompileStatic
@Requires(notEnv = Environment.TEST)
@Client("http://localhost:8084/schedules")
@Header(name = "database", value = "cubo2")
interface SchedulesDatabaseClient extends SchedulesDatabaseApi {

	@Get("/dayMechanics")
	List<Map> getDayMechanics(@QueryValue @Format("yyyy-mm-dd") Date day)

	@Get("/employeesSchedulesPosition")
	List<Map> updateEmployeesSchedulesPosition(@Body List<EmployeeSchedule> employeesSchedules)

}
