package panel.domains.cubo

import com.fasterxml.jackson.annotation.JsonFormat
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

    static mapping = {
        datasource 'cubo'

        version defaultValue: 0
    }

}
