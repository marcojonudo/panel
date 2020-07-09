package panel.pogos.fviberi

import com.fasterxml.jackson.annotation.JsonCreator
import groovy.transform.CompileStatic

@CompileStatic
class OrderLine {

	Integer line
	Float units
	String boxNumber
	Article article

	@JsonCreator
    OrderLine(Map<String, Object> orderLine) {
		line = (Integer) orderLine.line
		units = (Float) orderLine.units
		boxNumber = (String) orderLine.boxNumber
		article = new Article((Map<String, Object>) orderLine.article)
	}

}
