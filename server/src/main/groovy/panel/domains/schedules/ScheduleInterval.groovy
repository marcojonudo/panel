package panel.domains.schedules

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

import java.time.LocalTime

@Entity
class ScheduleInterval implements GormEntity<ScheduleInterval> {

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime start

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime end

    @JsonIgnore
    Set<EmployeeSchedule> employeeSchedules

    static hasMany = [employeeSchedules: EmployeeSchedule]
    static belongsTo = EmployeeSchedule

    static mapping = {
        version defaultValue: 0
        employeeSchedules lazy: false, joinTable: [name: 'employee_schedule_intervals', key: 'interval_id']
    }

    @Override
    boolean equals(Object o) {
        return ((ScheduleInterval) o).start == start && ((ScheduleInterval) o).end == end
    }

}
