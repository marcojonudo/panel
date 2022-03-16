package panel.pogos.realTime.objects

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.domains.schedules.EmployeeSchedule

@TupleConstructor
@CompileStatic
class RealTimeMechanics implements RealTimeObject {

    List<EmployeeSchedule> mechanics

}
