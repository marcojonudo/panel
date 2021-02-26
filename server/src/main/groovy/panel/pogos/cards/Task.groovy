package panel.pogos.cards

import groovy.transform.CompileStatic

@CompileStatic
class Task {

	Long id
	Integer articleCode
	String name
	boolean absorbable
	boolean enabled
	List<Group> groups

}
