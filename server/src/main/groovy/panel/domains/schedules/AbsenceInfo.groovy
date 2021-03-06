package panel.domains.schedules

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

import java.time.LocalDate

@Entity
class AbsenceInfo implements GormEntity<AbsenceInfo> {

    @JsonIgnore
    EmployeeSchedule employeeSchedule
    Absence absence
    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate expectedEndDay

    static constraints = {
        expectedEndDay nullable: true
    }

    static mapping = {
        version defaultValue: 0
        absence fetch: 'join'
    }

}
