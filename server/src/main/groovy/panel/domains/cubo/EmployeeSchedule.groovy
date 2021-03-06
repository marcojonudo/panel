package panel.domains.cubo

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalDateTime

@Entity
class EmployeeSchedule implements GormEntity<EmployeeSchedule> {

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate day

    Employee employee
    Schedule schedule
    Integer restMinutes
    Integer lines
    ScheduleAbsence absence
    JobPositionGroup jobPositionGroup
    String panelPosition
    String jobLineType
    boolean showInPanel

    @JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
    LocalDateTime created

    @JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
    LocalDateTime updated

    String userUpdated
    boolean deleted
    
    @JsonInclude
    Set<MechanicAppointment> appointments

    static hasMany = [appointments: MechanicAppointment]

    static constraints = {
        datasource 'cubo'

        day nullable: true
        restMinutes nullable: true
        lines nullable: true
        jobLineType nullable: true, maxSize: 10
        schedule nullable: true
        absence nullable: true
        updated nullable: true
	    userUpdated nullable: true, maxSize: 45
    }

    static mapping = {
        version defaultValue: 0
        lines column: '`lines`'

        employee fetch: 'join'
        schedule fetch: 'join'
        absence fetch: 'join'
        jobPositionGroup fetch: 'join'
        appointments fetch: 'join'
    }

}
