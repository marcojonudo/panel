package panel.clients.schedules

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.QueryValue
import utils.pogos.EmployeeSchedule

import javax.inject.Singleton

@Singleton
@CompileStatic
interface SchedulesDatabaseApi {

	List<Map> getDayMechanics(@QueryValue @Format("yyyy-mm-dd") Date day)
	List<Map> updateEmployeesSchedulesPosition(@Body List<EmployeeSchedule> employeesSchedules)

}
