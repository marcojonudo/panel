package panel.pogos.realTime

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor

@TupleConstructor
@CompileStatic
class RealTimeRequestInfo {

	String action
	Object content

}
