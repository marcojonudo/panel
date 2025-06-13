package schedules.domains.skills

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import schedules.utils.Constants

import java.time.LocalDate

@Entity
class SkillEmployee implements GormEntity<SkillEmployee> {

    String skillCode
    String employeeCode
    SkillExpertise expertise

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate month

    static mapping = {
        version defaultValue: 0
    }

    enum SkillExpertise {

        LOW,
        MEDIUM,
        HIGH,
        TRAINING

    }

}
