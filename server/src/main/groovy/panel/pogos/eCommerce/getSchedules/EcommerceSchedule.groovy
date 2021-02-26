package panel.pogos.eCommerce.getSchedules

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.pogos.appointmentDays.AppointmentType.AppointmentTypeCode
import panel.pogos.schedules.ScheduleInterval

@CompileStatic
@TupleConstructor
class EcommerceSchedule {

    AppointmentTypeCode type
    List<ScheduleInterval> intervals

}
