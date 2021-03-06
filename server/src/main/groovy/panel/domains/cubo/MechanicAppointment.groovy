package panel.domains.cubo

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.serializers.MechanicAppointmentSerializer

@JsonSerialize(using = MechanicAppointmentSerializer)
@Entity
class MechanicAppointment implements GormEntity<MechanicAppointment> {

    EmployeeSchedule mechanic
    String appointmentTypeCode
    ScheduleInterval schedule

    static mapping = {
        datasource 'cubo'

        version defaultValue: false
        mechanic lazy: false
        schedule lazy: false
    }

}
