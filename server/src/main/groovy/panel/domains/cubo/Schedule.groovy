package panel.domains.cubo

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

import java.time.LocalDateTime
import java.time.LocalTime

@Entity
class Schedule implements GormEntity<Schedule> {

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime morningStart

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime morningEnd

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime afternoonStart

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime afternoonEnd
    ScheduleType type
    float hours

    @JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
    LocalDateTime created = LocalDateTime.now()

    @JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
    LocalDateTime updated
    boolean deleted
//    @JsonBackReference
//    Set<EmployeeSchedule> employeeSchedule

    static constraints = {
        updated nullable: true
    }

    static mapping = {
        datasource 'cubo'

        version defaultValue: 0
    }

//    @JsonBackReference
//    static hasMany = [employeeSchedule: EmployeeSchedule]
    static belongsTo = EmployeeSchedule

    enum ScheduleType {

        MORNING({ Schedule scheduleDay -> scheduleDay.morningStart && !scheduleDay.afternoonStart }),
        AFTERNOON({ Schedule scheduleDay -> !scheduleDay.morningStart && scheduleDay.afternoonStart }),
        FULL_TIME({ Schedule scheduleDay -> scheduleDay.morningStart && scheduleDay.afternoonStart }),
        ABSENCE({ Schedule scheduleDay -> !scheduleDay.morningStart && !scheduleDay.afternoonStart }),

        final Closure criteria

        ScheduleType(Closure criteria) {
            this.criteria = criteria
        }

    }

}
