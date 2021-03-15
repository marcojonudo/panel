package panel.domains.panel

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class MechanicAppointment implements GormEntity<MechanicAppointment> {

    long mechanicId
    String appointmentTypeCode
    long intervalId

    static mapping = {
        version defaultValue: false
    }

}
