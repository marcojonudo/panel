package panel.pogos.eCommerce.getSchedules

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.domains.panel.AppointmentType
import panel.domains.schedules.ScheduleInterval

@CompileStatic
@TupleConstructor
class EcommerceSchedule {

    AppointmentType.Code type
    List<ScheduleInterval> intervals

}
