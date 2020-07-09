package panel.pogos.cards

import com.fasterxml.jackson.annotation.JsonCreator
import groovy.transform.CompileStatic

@CompileStatic
class Pending {

	Boolean material
	boolean call
	boolean budget

    Pending() {}

	@JsonCreator
    Pending(Map pending) {
		material = pending.material
		call = pending.call
		budget = pending.budget
	}

}
