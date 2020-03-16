package panel.pogos.eCommerce.getSchedules

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import utils.pogos.panel.AppointmentType
import utils.pogos.schedules.ScheduleInterval

@CompileStatic
@TupleConstructor
class EcommerceSchedule {

    List<ScheduleInterval> intervals
    AppointmentType.Code type

}
