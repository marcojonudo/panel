package panel.pogos.cards

import groovy.transform.TupleConstructor
import panel.domains.Group
import groovy.transform.CompileStatic

@CompileStatic
@TupleConstructor
class GroupUnits {

	Group group
	List<Float> units
	int duration

}
