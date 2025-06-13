package panel.pogos.realTime.objects

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.pogos.schedules.EmployeeSchedule

@TupleConstructor
@CompileStatic
class RealTimeMechanic implements RealTimeObject {

    EmployeeSchedule mechanic

}
