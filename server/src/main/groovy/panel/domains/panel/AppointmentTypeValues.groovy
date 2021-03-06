package panel.domains.panel

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.serializers.AppointmentDayMinSerializer

@Entity
class AppointmentTypeValues implements GormEntity<AppointmentTypeValues> {

    @JsonSerialize(using = AppointmentDayMinSerializer)
    AppointmentDay appointmentDay
    AppointmentType appointmentType
    int morning
    int afternoon
    int total
    int max

    static mapping = {
        appointmentType fetch: 'join'
    }

}
