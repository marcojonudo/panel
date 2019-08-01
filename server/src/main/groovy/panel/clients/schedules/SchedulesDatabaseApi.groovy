package panel.clients.schedules

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.QueryValue
import utils.pogos.schedules.EmployeeSchedule

import javax.inject.Singleton

@Singleton
@CompileStatic
interface SchedulesDatabaseApi {

	List<Map> getMechanics(@QueryValue @Format("yyyy-mm-dd") Date day, @QueryValue boolean fixedSchedules)
	List<Map> updateEmployeesSchedulesPosition(@Body List<EmployeeSchedule> employeesSchedules)

}
