package panel.pogos.realTime

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.pogos.realTime.objects.RealTimeObject

@TupleConstructor
@CompileStatic
class RealTimeInfo {

	RealTimeAction action
	RealTimeObject content

}
