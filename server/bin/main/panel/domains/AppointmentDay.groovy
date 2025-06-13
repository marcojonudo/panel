package panel.domains

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

import java.time.LocalDate

@Entity
class AppointmentDay implements GormEntity<AppointmentDay> {

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate day

    static hasMany = [values: AppointmentTypeValues]

    static mapping = {
        values fetch: 'join'
    }

}
