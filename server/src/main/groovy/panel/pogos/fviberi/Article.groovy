package panel.pogos.fviberi

import groovy.transform.CompileStatic

@CompileStatic
class Article {

    Integer code
    String name
	boolean labour

	int findUnitaryCode() {
		return (code as String)[1..-1] as int
	}

}
