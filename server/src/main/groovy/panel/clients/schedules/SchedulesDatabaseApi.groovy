package panel.clients.schedules

import groovy.transform.CompileStatic
import io.micronaut.core.convert.format.Format
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.QueryValue
import panel.utils.Constants
import utils.pogos.schedules.EmployeeSchedule

import javax.inject.Singleton

@Singleton
@CompileStatic
interface SchedulesDatabaseApi {

	List<EmployeeSchedule> getMechanics(@QueryValue @Format(Constants.DATE_DB_PATTERN) Date day, @QueryValue boolean fixedSchedules)
	List<Map> updateEmployeesSchedulesPosition(@Body List<EmployeeSchedule> employeesSchedules)
	void updateMechanicLines(@Body Map<String, Object> mechanic)

}
