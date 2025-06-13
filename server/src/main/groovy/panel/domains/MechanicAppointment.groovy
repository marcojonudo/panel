package panel.domains

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.pogos.realTime.objects.RealTimeObject
import panel.pogos.schedules.ScheduleInterval

@Entity
class MechanicAppointment implements GormEntity<MechanicAppointment>, RealTimeObject {

    long mechanicId
    String appointmentTypeCode
    long intervalId
    ScheduleInterval interval

    static mapping = {
        version defaultValue: false
    }

    static transients = ['interval']

}
