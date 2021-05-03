package panel.domains.panel

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.domains.schedules.ScheduleInterval

@Entity
class MechanicAppointment implements GormEntity<MechanicAppointment> {

    long mechanicId
    String appointmentTypeCode
    long intervalId
    ScheduleInterval interval

    static mapping = {
        version defaultValue: false
    }

    static transients = ['interval']

}
