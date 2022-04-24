package schedules.domains

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import schedules.utils.Constants

import java.time.LocalDate

@Entity
class AbsenceInfo implements GormEntity<AbsenceInfo> {

    long employeeScheduleId
    Absence absence

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate expectedEndDay

//    static belongsTo = [employeeSchedule: EmployeeSchedule]

    static constraints = {
        expectedEndDay nullable: true
    }

    static mapping = {
        version defaultValue: 0
        absence fetch: 'join'
    }

}
