package panel.pogos.appointmentDays

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import groovy.transform.CompileStatic
import panel.serializers.AppointmentDayMinSerializer

@CompileStatic
class AppointmentTypeValues {

    @JsonSerialize(using = AppointmentDayMinSerializer)
    AppointmentDay appointmentDay
    AppointmentType appointmentType
    int morning
    int afternoon
    int total
    int max

}
